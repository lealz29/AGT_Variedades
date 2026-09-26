# AGT Variedades — Catálogo Digital

Catálogo online da AGT Variedades: os clientes veem os produtos, montam uma
"seleção" e enviam pelo WhatsApp para fechar a compra. Não há pagamento nem
cadastro de cliente dentro do site — a negociação final é sempre pelo WhatsApp.

Tecnologias: **React + Vite + Tailwind CSS + Supabase** (banco de dados,
autenticação do admin e armazenamento das fotos).

---

## 1. Como executar o projeto no computador

Pré-requisito: ter o [Node.js](https://nodejs.org) instalado (versão 18 ou mais recente).

```bash
# entrar na pasta do projeto
cd agt-variedades

# instalar as dependências
npm install

# rodar localmente
npm run dev
```

O site abrirá em `http://localhost:5173`.

---

## 2. Como configurar o Supabase (passo a passo)

### 2.1. Criar o projeto

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Clique em **New Project**, dê um nome (ex: `agt-variedades`) e uma senha
   para o banco (guarde essa senha).
3. Aguarde o projeto ser criado (leva cerca de 2 minutos).

### 2.2. Executar o SQL (cria as tabelas e as regras de segurança)

1. No painel do Supabase, vá em **SQL Editor**.
2. Abra o arquivo `supabase/01_schema.sql` deste projeto, copie todo o
   conteúdo, cole no SQL Editor e clique em **Run**.
3. Repita o mesmo processo com `supabase/02_storage.sql` (cria o espaço de
   armazenamento das fotos).
4. (Opcional, recomendado para testar) Repita com `supabase/03_seed.sql`
   para criar 15 produtos de exemplo.

### 2.3. Criar o usuário administrador (sua mãe)

1. No painel do Supabase, vá em **Authentication > Users**.
2. Clique em **Add user > Create new user**.
3. Preencha o e-mail e uma senha (esse será o login em `/admin`).
4. Marque a opção para confirmar o e-mail automaticamente (ou confirme pelo
   e-mail enviado).

Esse é o único login que terá acesso ao painel administrativo — os
visitantes do catálogo nunca precisam criar conta.

### 2.4. Pegar as chaves da API

1. Vá em **Project Settings > API**.
2. Copie a **Project URL** e a chave **anon public**.

### 2.5. Configurar as variáveis de ambiente

1. Copie o arquivo `.env.example` e renomeie a cópia para `.env`.
2. Preencha:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

> A chave "anon public" é segura para ficar no site — ela só permite o que as
> regras de segurança (RLS) autorizam: qualquer pessoa pode **ver** produtos,
> mas só quem faz login (o admin) pode **criar, editar ou excluir**.

---

## 3. Como publicar o site online (Vercel)

1. Suba este projeto para um repositório no GitHub.
2. Acesse [vercel.com](https://vercel.com), crie uma conta e clique em
   **Add New Project**, escolhendo o repositório.
3. Em **Environment Variables**, adicione as mesmas duas variáveis do `.env`
   (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).
4. Clique em **Deploy**. Em poucos minutos o site estará no ar com um link
   `algumacoisa.vercel.app`.
5. Depois, em **Project Settings > Domains**, você pode adicionar um domínio
   próprio (ex: `agtvariedades.com.br`) quando quiser.

O painel administrativo ficará em `SEU-SITE.vercel.app/admin`.

---

## 4. Guia rápido para a administradora da loja (sem termos técnicos)

### Entrar no painel
Acesse `/admin` no site, digite o e-mail e a senha cadastrados no passo 2.3.

### Cadastrar uma roupa
1. No painel, clique em **+ Adicionar produto**.
2. Preencha nome, categoria (Feminino/Masculino), subcategoria, descrição e preço.
3. Envie a foto principal e, se quiser, mais fotos.
4. Na seção **Cores, tamanhos e estoque**, clique em **+ Adicionar cor/tamanho**
   para cada combinação (ex: Preto + M + 5 unidades). Repita para cada cor/tamanho.
5. Clique em **Salvar produto**.

### Cadastrar um cosmético
1. Clique em **+ Adicionar produto** e escolha a categoria **Cosméticos**.
2. Preencha marca, tipo, volume e fragrância (todos opcionais).
3. Não é preciso cadastrar cor/tamanho para cosméticos.
4. Envie a foto e clique em **Salvar produto**.

### Colocar ou trocar uma foto
Na tela de edição do produto, use os campos **Foto principal** e **Outras
fotos**. Para remover uma foto extra, clique no "✕" sobre ela.

### Alterar o preço
Abra o produto em **Editar**, mude o valor no campo **Preço** e clique em
**Salvar produto**.

### Alterar o estoque
Abra o produto em **Editar** e mude o número de unidades na linha da
cor/tamanho correspondente, na seção **Cores, tamanhos e estoque**.

### Colocar um produto em promoção
Marque a caixinha **Produto em promoção** e preencha o **Preço promocional**.
O site mostrará o preço antigo riscado e o novo em destaque.

### Marcar como esgotado
Na lista de produtos do painel, clique em **Desativar** — o produto some do
catálogo para os clientes, mas continua salvo (você pode reativar depois).

### Excluir um produto definitivamente
Na lista de produtos, clique em **Excluir** e confirme. Essa ação não pode
ser desfeita — se for um produto que pode voltar a vender, prefira
**Desativar**.

### Configurar o número do WhatsApp
Abra o arquivo `src/lib/storeConfig.js` e altere o campo `whatsappNumber`
(sempre com código do país 55 + DDD + número, sem espaços ou traços).

### Acessar o painel pelo celular
Basta abrir `SEU-SITE.vercel.app/admin` no navegador do celular — o painel
foi desenhado para funcionar bem em telas pequenas.

---

## 5. Estrutura do projeto

```
agt-variedades/
├── src/
│   ├── components/     Header, Footer, cards de produto, filtros...
│   ├── contexts/        Seleção do cliente (localStorage) e login do admin
│   ├── lib/              Configuração da loja, Supabase, WhatsApp
│   ├── pages/            Páginas públicas (catálogo, produto, seleção)
│   └── pages/admin/     Login, dashboard e formulário de produto
├── supabase/
│   ├── 01_schema.sql     Tabelas e regras de segurança (RLS)
│   ├── 02_storage.sql    Espaço de armazenamento das fotos
│   └── 03_seed.sql       15 produtos de demonstração
└── README.md
```

## 6. O que pode ser expandido depois

Este projeto entrega o fluxo completo pedido — catálogo, filtros, busca,
seleção com WhatsApp, e painel administrativo com fotos e estoque por
variante. Alguns extras ficam fáceis de adicionar depois, se quiser:
notificação por e-mail a cada novo pedido, categorias configuráveis pelo
próprio painel (hoje ficam no arquivo `storeConfig.js`), e histórico de
pedidos enviados.
