# 🚀 Guia de Deploy - Startup Tracker

## ⏱️ Tempo estimado: 10-15 minutos

---

## 📋 PASSO 1: Criar conta no GitHub (se não tiver)

1. Acesse https://github.com
2. Clique em "Sign up"
3. Siga as instruções

---

## 📤 PASSO 2: Enviar código para o GitHub

### 2.1. Criar novo repositório no GitHub
1. Acesse https://github.com/new
2. Nome do repositório: `startup-tracker`
3. Deixe como **Público** (ou Privado, ambos funcionam)
4. **NÃO marque** "Initialize with README"
5. Clique em "Create repository"

### 2.2. Copie a URL do repositório
Exemplo: `https://github.com/SEU-USUARIO/startup-tracker.git`

### 2.3. No seu terminal, execute:
```bash
cd /Users/leonardomonteiro/Desktop/Project/startup-tracker

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit"

# Adicionar origem remota (SUBSTITUA pela SUA URL)
git remote add origin https://github.com/SEU-USUARIO/startup-tracker.git

# Enviar para o GitHub
git push -u origin main
```

**Se der erro "main não existe"**, execute:
```bash
git branch -M main
git push -u origin main
```

---

## 🗄️ PASSO 3: Hospedar Backend + Banco de Dados (Render)

### 3.1. Criar conta no Render
1. Acesse https://render.com
2. Clique em "Get Started"
3. Conecte com sua conta do GitHub

### 3.2. Criar serviços automaticamente
1. No painel do Render, clique em "New +" no topo
2. Selecione "Blueprint"
3. Conecte seu repositório `startup-tracker`
4. O Render vai detectar automaticamente o arquivo `render.yaml`
5. Clique em "Apply"

**O Render vai criar automaticamente:**
- ✅ Banco de dados PostgreSQL
- ✅ API backend na URL: `https://startup-tracker-api-XXXX.onrender.com`

### 3.3. Anotar a URL da API
1. Aguarde o deploy terminar (~3-5 min)
2. Copie a URL da API (exemplo: `https://startup-tracker-api-abc123.onrender.com`)
3. **Guarde essa URL** - você vai precisar no próximo passo!

---

## 🌐 PASSO 4: Hospedar Frontend (Vercel)

### 4.1. Criar conta na Vercel
1. Acesse https://vercel.com
2. Clique em "Sign Up"
3. Conecte com sua conta do GitHub

### 4.2. Criar novo projeto
1. No painel da Vercel, clique em "Add New..." → "Project"
2. Selecione o repositório `startup-tracker`
3. Clique em "Import"

### 4.3. Configurar o projeto
Na tela de configuração:

**Root Directory:**
- Clique em "Edit" ao lado de "Root Directory"
- Selecione `apps/web`

**Environment Variables:**
- Clique em "Environment Variables"
- Adicione:
  - **Name:** `NEXT_PUBLIC_API_URL`
  - **Value:** `https://startup-tracker-api-XXXX.onrender.com` (a URL que você copiou do Render)

**Framework Preset:**
- Deixe como "Next.js"

### 4.4. Deploy
1. Clique em "Deploy"
2. Aguarde o deploy terminar (~2-3 min)
3. Copie a URL do projeto (exemplo: `https://startup-tracker-xyz.vercel.app`)

---

## 🔧 PASSO 5: Atualizar configuração do Backend

### 5.1. Voltar ao Render
1. Acesse https://dashboard.render.com
2. Clique no serviço `startup-tracker-api`
3. No menu lateral, clique em "Environment"

### 5.2. Atualizar variável FRONTEND_URL
1. Encontre a variável `FRONTEND_URL`
2. Clique em "Edit"
3. Substitua o valor pela URL da Vercel: `https://startup-tracker-xyz.vercel.app`
4. Clique em "Save Changes"

**O Render vai fazer redeploy automaticamente (~2 min)**

---

## ✅ PASSO 6: Testar a aplicação

### 6.1. Acessar o projeto
1. Abra a URL da Vercel: `https://startup-tracker-xyz.vercel.app`
2. Navegue até o Dashboard
3. Clique em "Sync YC Companies"
4. Aguarde sincronizar (~30 segundos)

### 6.2. Verificar se funciona
- ✅ Dashboard carrega
- ✅ Empresas aparecem
- ✅ Consegue adicionar um launch
- ✅ Analytics mostra dados

---

## 🎉 PRONTO! Seu projeto está no ar!

**URLs finais:**
- 🌐 Frontend: `https://startup-tracker-xyz.vercel.app`
- 🔌 API: `https://startup-tracker-api-abc123.onrender.com/api/v1/health`

**Compartilhe essas URLs na sua entrevista!**

---

## ⚠️ Notas importantes

### Plano Grátis - Limitações:
- **Render:** O backend "dorme" após 15 min de inatividade. Primeira requisição pode levar ~30s para acordar
- **Vercel:** Frontend sempre rápido, sem limitações significativas

### Se algo der errado:
1. **Logs do Backend (Render):**
   - Acesse o serviço no Render
   - Clique em "Logs"
   - Veja erros em tempo real

2. **Logs do Frontend (Vercel):**
   - Acesse o projeto na Vercel
   - Clique em "Deployments"
   - Clique no último deploy
   - Veja os logs

---

## 🆘 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique se o banco de dados está ativo no Render
- Vá em "Databases" → `startup-tracker-db`
- Status deve estar "Available"

### Erro: "API not responding"
- Aguarde ~30s (serviço pode estar dormindo)
- Verifique se a URL da API está correta no Vercel
- Teste a API diretamente: `https://sua-api.onrender.com/api/v1/health`

### Erro: "CORS error"
- Verifique se a variável `FRONTEND_URL` no Render está correta
- Deve ser EXATAMENTE a URL da Vercel (sem `/` no final)

---

**Dúvidas? Verifique os logs primeiro! 90% dos problemas aparecem lá.**
