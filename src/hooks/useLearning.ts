import { useState, useCallback, useEffect } from "react";
import type { Sentence } from "@/lib/sentenceData";

export type SentenceStatus = "pending" | "added";

export interface ReviewCard extends Sentence {
  /** Spaced-repetition interval in "rounds". Starts at 1, doubles on correct. */
  interval: number;
  /** How many rounds until this card shows again. */
  dueIn: number;
}

const STORAGE_SCORE_KEY = "sm_score";
const STORAGE_REVIEW_KEY = "sm_review_v2";

function loadScore(): number {
  try {
    return parseInt(localStorage.getItem(STORAGE_SCORE_KEY) ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

function loadReview(): ReviewCard[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_REVIEW_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useLearning() {
  const [sentences, setSentences] = useState<(Sentence & { status: SentenceStatus | "added" })[]>([]);
  const [score, setScore] = useState<number>(loadScore);
  const [scorePop, setScorePop] = useState(false);
  const [reviewCards, setReviewCards] = useState<ReviewCard[]>(loadReview);

  useEffect(() => {
    localStorage.setItem(STORAGE_SCORE_KEY, String(score));
  }, [score]);

  useEffect(() => {
    localStorage.setItem(STORAGE_REVIEW_KEY, JSON.stringify(reviewCards));
  }, [reviewCards]);

  const loadSentences = useCallback((newSentences: Sentence[]) => {
    setSentences(newSentences.map((s) => ({ ...s, status: "pending" as const })));
  }, []);

  /** Add a sentence to the Anki review queue */
  const addToReview = useCallback((id: string) => {
    setSentences((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "added" as const } : s))
    );
    setSentences((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target) {
        setReviewCards((prevCards) => {
          const exists = prevCards.some((c) => c.id === id);
          if (exists) return prevCards;
          const { status: _status, ...sentence } = target as typeof target & { status: string };
          return [...prevCards, { ...sentence, interval: 1, dueIn: 0 }];
        });
      }
      return prev;
    });
  }, []);

  /**
   * Get the next due card for the Anki session.
   * Cards with dueIn === 0 are eligible.
   */
  const getDueCards = useCallback((): ReviewCard[] => {
    return reviewCards.filter((c) => c.dueIn === 0);
  }, [reviewCards]);

  const popScore = useCallback((delta: number) => {
    setScore((prev) => Math.max(0, prev + delta));
    setScorePop(true);
    setTimeout(() => setScorePop(false), 500);
  }, []);

  /** Mark card as correct: double interval, -5 from due counter on all others */
  const markCorrect = useCallback((id: string) => {
    popScore(10);
    setReviewCards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newInterval = Math.min(c.interval * 2, 32);
          return { ...c, interval: newInterval, dueIn: newInterval };
        }
        return { ...c, dueIn: Math.max(0, c.dueIn - 1) };
      })
    );
  }, [popScore]);

  /** Mark card as wrong: reset interval to 1, show again soon */
  const markWrong = useCallback((id: string) => {
    popScore(-5);
    setReviewCards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, interval: 1, dueIn: 0 };
        }
        return { ...c, dueIn: Math.max(0, c.dueIn - 1) };
      })
    );
  }, [popScore]);

  /** Remove a card from the review deck entirely */
  const removeCard = useCallback((id: string) => {
    setReviewCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    sentences,
    score,
    scorePop,
    reviewCards,
    getDueCards,
    loadSentences,
    addToReview,
    markCorrect,
    markWrong,
    removeCard,
  };
}
