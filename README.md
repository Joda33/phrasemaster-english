# 🚀 SentenceMiner

**SentenceMiner** é uma plataforma de aprendizado de idiomas desenvolvida para auxiliar estudantes a expandirem seu vocabulário através da geração de frases contextualizadas. Utilizando Inteligência Artificial, a aplicação cria exemplos naturais e relevantes para facilitar a memorização de novas palavras e expressões.

O projeto combina uma interface moderna construída com React e Tailwind CSS, processamento serverless com Supabase Edge Functions e geração de conteúdo por meio da API da Groq, proporcionando uma experiência rápida, escalável e eficiente.

---

# ✨ Funcionalidades Principais

* Geração de frases contextualizadas utilizando Inteligência Artificial.
* Interface moderna e responsiva.
* Integração com Supabase para autenticação e serviços backend.
* Uso de Edge Functions para processamento seguro das requisições à IA.
* Comunicação com a API da Groq para geração dinâmica de conteúdo.
* Arquitetura otimizada utilizando Vite para desenvolvimento rápido.
* Código organizado e preparado para deploy na Vercel.

---

# 🛠️ Stack Tecnológica

## Frontend

* React
* Vite
* Tailwind CSS
* JavaScript (ES6+)

## Backend

* Supabase
* Supabase Edge Functions

## Inteligência Artificial

* Groq API (LLMs)

## Deploy

* Vercel

---

# ⚙️ Configuração Local

## 1. Clone o repositório

```bash
git clone https://github.com/Joda33/phrasemaster-english.git
```

## 2. Acesse o diretório

```bash
cd phrasemaster-english
```

## 3. Instale as dependências

```bash
npm install
```

## 4. Configure as variáveis de ambiente

Crie um arquivo chamado:

```text
.env
```

Adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Importante**
>
> As credenciais do Supabase permitem que o frontend se comunique com o backend da aplicação.
>
> As chamadas para a API da Groq devem ser realizadas pelas **Supabase Edge Functions**, mantendo a chave da IA protegida no servidor. Nunca exponha chaves privadas diretamente no frontend ou em arquivos versionados.

## 5. Execute o projeto

```bash
npm run dev
```

Após iniciar o servidor, acesse:

```text
http://localhost:5173
```

---

# ☁️ Deploy na Vercel

O projeto está preparado para deploy utilizando a Vercel.

## Passo 1

Importe este repositório para sua conta da Vercel.

## Passo 2

Durante a configuração do projeto, adicione as seguintes Environment Variables:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Utilize exatamente os mesmos valores configurados no ambiente local.

## Passo 3

Conclua o deploy.

A Vercel realizará automaticamente:

* instalação das dependências;
* build da aplicação;
* publicação do projeto.

> **Observação**
>
> As **Supabase Edge Functions** continuam sendo responsáveis pela comunicação segura com a API da Groq. Certifique-se de que as variáveis e segredos utilizados pelas Edge Functions estejam configurados no ambiente do Supabase para garantir o funcionamento correto da geração de frases.

---

# 📄 Licença

Este projeto está distribuído sob a licença **MIT**.

Sinta-se à vontade para estudar, modificar e utilizar o código de acordo com os termos da licença.

---

<sub>Desenvolvido com foco em aprendizado de idiomas, arquitetura moderna e integração segura entre frontend, backend serverless e Inteligência Artificial.</sub>
