# PhraseMaster English / SentenceMiner

**Domine o inglês através de frases autênticas e contextualizadas.**  
SentenceMiner é uma plataforma moderna de aprendizado de idiomas que gera frases personalizadas e imersivas usando IA, ajudando estudantes a expandir vocabulário e compreensão contextual de forma eficiente.

## ✨ Funcionalidades Principais

- **Geração de frases contextualizadas** com a API da Groq para alta qualidade e velocidade.
- **Interface intuitiva e responsiva** construída com React e Tailwind CSS.
- **Armazenamento e autenticação seguros** via Supabase.
- **Edge Functions** para processamento serverless eficiente e escalável.
- **Foco em imersão**: frases reais, variadas e adaptadas ao nível do usuário.
- **Experiência de aprendizado gamificada** e progressiva.

## 🛠 Stack Tecnológica

### Frontend
- **React** + **Vite** (build tool moderno e rápido)
- **Tailwind CSS** (estilização utilitária e design responsivo)

### Backend / Banco de Dados
- **Supabase** (PostgreSQL, autenticação e Edge Functions)

### IA
- **Groq API** (inferência de LLM ultra-rápida para geração de conteúdo)

### Deploy
- **Vercel** (frontend) + Supabase (backend e edge functions)

## 🚀 Configuração Local

### 1. Clone o repositório
```bash
git clone https://github.com/Joda33/phrasemaster-english.git
cd phrasemaster-english
2. Instale as dependências
Bashnpm install
3. Configure as variáveis de ambiente
Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:
envVITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
# Opcional: outras chaves conforme necessário (ex: Groq API key se exposta no client-side)
Importante: Mantenha as chaves de API (Supabase e Groq) seguras. Nunca commite o arquivo .env no repositório. As Edge Functions do Supabase lidam com chaves sensíveis no lado do servidor.
4. Execute o projeto em modo desenvolvimento
Bashnpm run dev
A aplicação estará disponível em http://localhost:5173 (padrão do Vite).
🌐 Deploy na Vercel

Faça fork ou importe o repositório diretamente na Vercel.
Conecte o projeto ao seu repositório GitHub.
Na seção Environment Variables, adicione:
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

Deploy automático será acionado após o push.

O frontend é otimizado para Vercel. Certifique-se de que as Edge Functions do Supabase estejam configuradas e ativas.
📄 Licença
Este projeto está licenciado sob a MIT License.

Desenvolvido com ❤️ para estudantes de idiomas que buscam excelência através da prática contextual.
Contribuições são bem-vindas! Abra uma Issue ou envie um Pull Request.
