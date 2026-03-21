import { useState, useCallback, useEffect } from "react";
import type { Sentence } from "@/lib/sentenceData";

export type SentenceStatus = "pending" | "learned" | "review";

export interface TrackedSentence extends Sentence {
  status: SentenceStatus;
}

interface LearningState {
  sentences: TrackedSentence[];
  score: number;
  scorePop: boolean;
}

const STORAGE_SCORE_KEY = "sm_score";
const STORAGE_REVIEW_KEY = "sm_review";

function loadScore(): number {
  try {
    return parseInt(localStorage.getItem(STORAGE_SCORE_KEY) ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

function loadReview(): TrackedSentence[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_REVIEW_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useLearning() {
  const [sentences, setSentences] = useState<TrackedSentence[]>([]);
  const [score, setScore] = useState<number>(loadScore);
  const [scorePop, setScorePop] = useState(false);
  const [reviewSentences, setReviewSentences] = useState<TrackedSentence[]>(loadReview);

  // Persist score & review list
  useEffect(() => {
    localStorage.setItem(STORAGE_SCORE_KEY, String(score));
  }, [score]);

  useEffect(() => {
    localStorage.setItem(STORAGE_REVIEW_KEY, JSON.stringify(reviewSentences));
  }, [reviewSentences]);

  const loadSentences = useCallback((newSentences: Sentence[]) => {
    setSentences(newSentences.map((s) => ({ ...s, status: "pending" as SentenceStatus })));
  }, []);

  const markLearned = useCallback((id: string) => {
    setSentences((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "learned" } : s))
    );
    // Remove from review list if it was there
    setReviewSentences((prev) => prev.filter((s) => s.id !== id));
    setScore((prev) => prev + 10);
    setScorePop(true);
    setTimeout(() => setScorePop(false), 500);
  }, []);

  const markReview = useCallback((id: string) => {
    setSentences((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, status: "review" as SentenceStatus } : s));
      // Add to persistent review list if not already there
      const target = updated.find((s) => s.id === id);
      if (target) {
        setReviewSentences((prevReview) => {
          const exists = prevReview.some((r) => r.id === id);
          return exists ? prevReview : [...prevReview, target];
        });
      }
      return updated;
    });
  }, []);

  const removeFromReview = useCallback((id: string) => {
    setReviewSentences((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const markReviewedLearned = useCallback((id: string) => {
    setReviewSentences((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "learned" } : s))
    );
    setScore((prev) => prev + 10);
    setScorePop(true);
    setTimeout(() => setScorePop(false), 500);
  }, []);

  return {
    sentences,
    score,
    scorePop,
    reviewSentences,
    loadSentences,
    markLearned,
    markReview,
    removeFromReview,
    markReviewedLearned,
  };
}
