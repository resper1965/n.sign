<p align="center">
  <img src="https://img.shields.io/badge/version-2.1.0-00ade8?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind">
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/n.sign-Gerador%20de%20Assinaturas-00ade8?style=for-the-badge">
    <img src="https://img.shields.io/badge/n.sign-Gerador%20de%20Assinaturas-00ade8?style=for-the-badge" alt="n.sign">
  </picture>
</p>

<h1 align="center">n.sign</h1>

<p align="center">
  <strong>Gerador de assinaturas de e-mail profissionais da NESS</strong><br>
  <em>Crie assinaturas corporativas elegantes em segundos</em>
</p>

<p align="center">
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-demonstração">Demonstração</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-deploy">Deploy</a> •
  <a href="#-documentação-da-api">API</a> •
  <a href="#-design-system">Design System</a>
</p>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Demonstração](#-demonstração)
- [Stack Tecnológica](#-stack-tecnológica)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Deploy](#-deploy)
- [Documentação da API](#-documentação-da-api)
- [Design System](#-design-system)
- [Templates](#-templates)
- [Atalhos de Teclado](#-atalhos-de-teclado)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Visão Geral

**n.sign** é uma ferramenta web profissional para criação de assinaturas de e-mail corporativas da NESS. Desenvolvida com foco em experiência do usuário e conformidade com a identidade visual da marca, a aplicação permite que colaboradores criem assinaturas profissionais em poucos segundos.

### Público-Alvo
- Colaboradores NESS
- Executivos (C-Levels)
- Equipes de TI e Security
- Departamentos corporativos

### Problema Resolvido
- Padronização de assinaturas corporativas
- Conformidade com a identidade visual NESS
- Facilidade de uso sem necessidade de conhecimento técnico
- Compatibilidade com clientes de e-mail (Gmail, Outlook, etc.)

---

## ✨ Funcionalidades

### 🎨 Personalização

| Funcionalidade | Descrição |
|----------------|-----------|
| **4 Templates** | Clássico, Moderno, Minimal, Corporativo |
| **3 Temas** | Branco, Azul, Dark |
| **Campos Dinâmicos** | Nome, Sobrenome, Área, E-mail, Telefone, LinkedIn, WhatsApp |
| **Template Recomendado** | Sugestão automática baseada no cargo/área |

### 🔧 Recursos Técnicos

| Funcionalidade | Descrição |
|----------------|-----------|
| **Preview em Tempo Real** | Visualização instantânea enquanto digita |
| **Validação de E-mail** | Verifica domínio corporativo (@ness.com.br) |
| **Progresso de Preenchimento** | Barra indicando % de completude |
| **Preview Responsivo** | Alternância entre Desktop e Mobile |

### 📤 Exportação e Compartilhamento

| Funcionalidade | Descrição |
|----------------|-----------|
| **Copiar HTML** | Copia assinatura para área de transferência |
| **Exportar PNG/JPEG** | Download como imagem de alta qualidade |
| **QR Code vCard** | Código para adicionar contato ao celular |
| **Link Público** | URL compartilhável com contador de visualizações |

### 💾 Persistência

| Funcionalidade | Descrição |
|----------------|-----------|
| **Salvar Localmente** | Armazenamento no navegador (localStorage) |
| **Histórico de Versões** | Até 10 versões anteriores por assinatura |
| **Sincronização Cloud** | Banco de dados para links compartilháveis |

### ⌨️ Produtividade

| Atalho | Ação |
|--------|------|
| `Ctrl + S` | Salvar assinatura |
| `Ctrl + Shift + C` | Copiar assinatura |
| `Ctrl + E` | Exportar como PNG |

---

## 🎬 Demonstração

### Interface Principal

```
┌─────────────────────────────────────────────────────────────┐
│  n.sign v2.1                           [Salvas] [Ajuda]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────────┐│
│  │ DADOS DA ASSINATURA  │  │ PRÉ-VISUALIZAÇÃO            ││
│  │                      │  │                              ││
│  │ Nome: [__________]   │  │  ┌────────────────────────┐ ││
│  │ Sobrenome: [______]  │  │  │  ness.               │ ││
│  │ Área: [▼ Selecione]  │  │  │  ─────────────────── │ ││
│  │ Email: [__________]  │  │  │  Nome Sobrenome      │ ││
│  │ Celular: [________]  │  │  │  CARGO               │ ││
│  │ LinkedIn: [________] │  │  │  📞 +55 (11) ...     │ ││
│  │ WhatsApp: [________] │  │  │  📧 email@ness.com   │ ││
│  │                      │  │  └────────────────────────┘ ││
│  │ Progresso: ████░ 80% │  │                              ││
│  │                      │  │  [Template: Clássico ▼]     ││
│  │ Ctrl+S para salvar   │  │  [Tema: Branco ▼]           ││
│  └──────────────────────┘  │                              ││
│                            │  [Copiar] [Exportar] [QR]    ││
│                            │  [Salvar] [Compartilhar]     ││
│                            └──────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Uso

```mermaid
graph LR
    A[Acessar n.sign] --> B[Preencher Dados]
    B --> C[Selecionar Template]
    C --> D[Escolher Tema]
    D --> E[Preview em Tempo Real]
    E --> F{Ação}
    F --> G[Copiar HTML]
    F --> H[Exportar Imagem]
    F --> I[Gerar QR Code]
    F --> J[Compartilhar Link]
    G --> K[Colar no Email]
```

---

## 🛠️ Stack Tecnológica

### Frontend
- **[Next.js 16](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Estilização utilitária
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI (New York style)
- **[Lucide Icons](https://lucide.dev/)** - Ícones outline

### Backend
- **[Prisma ORM](https://www.prisma.io/)** - ORM para banco de dados
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - API REST

### Dependências
- **[html-to-image](https://github.com/bubkoo/html-to-image)** - Exportação de imagens
- **[qrcode](https://www.npmjs.com/package/qrcode)** - Geração de QR Codes
- **[nanoid](https://github.com/ai/nanoid)** - IDs únicos para URLs
- **[sonner](https://sonner.emilkowal.ski/)** - Notificações toast

### Banco de Dados
- **Desenvolvimento**: SQLite
- **Produção**: PostgreSQL (Vercel Postgres, Neon, Supabase)

---

## 📦 Instalação

### Pré-requisitos

- **Node.js** >= 18.x
- **Bun** >= 1.x (recomendado) ou npm/yarn/pnpm
- **Git**

### Clone e Instalação

```bash
# Clone o repositório
git clone https://github.com/resper1965/n.sign.git
cd n.sign

# Instale as dependências
bun install
# ou
npm install

# Configure o banco de dados
bun run db:push
# ou
npx prisma db push

# Inicie o servidor de desenvolvimento
bun run dev
# ou
npm run dev
```

### Acesso

```
http://localhost:3000
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados (SQLite - Desenvolvimento)
DATABASE_URL="file:./dev.db"

# Banco de Dados (PostgreSQL - Produção)
# DATABASE_URL="postgresql://user:password@host:5432/nsign?schema=public"
```

### Configuração do Prisma

O schema está em `prisma/schema.prisma`. Para PostgreSQL, altere:

```prisma
datasource db {
  provider = "postgresql"  // Mude de "sqlite" para "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 🚀 Uso

### Desenvolvimento

```bash
# Servidor de desenvolvimento
bun run dev

# Verificar código (lint)
bun run lint

# Gerar cliente Prisma
bun run db:generate

# Sincronizar schema com banco
bun run db:push
```

### Build de Produção

```bash
# Build
bun run build

# Iniciar servidor de produção
bun run start
```

---

## 🌐 Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/resper1965/n.sign)

#### Passo a Passo

1. **Fork/Clone** este repositório para sua conta GitHub

2. **Acesse [Vercel](https://vercel.com)** e clique em "New Project"

3. **Importe o repositório** `n.sign`

4. **Configure o banco de dados**:

   **Opção A: Vercel Postgres** (Recomendado)
   ```
   Dashboard Vercel → Storage → Create Database → Postgres
   ```
   
   **Opção B: Neon** (Gratuito)
   ```
   1. Acesse neon.tech
   2. Crie um projeto gratuito
   3. Copie a connection string
   ```

5. **Configure variáveis de ambiente**:
   ```
   DATABASE_URL=postgresql://...
   ```

6. **Deploy!**

### Outras Plataformas

| Plataforma | Compatibilidade |
|------------|-----------------|
| Railway | ✅ Suporte nativo a PostgreSQL |
| Render | ✅ Web Service + PostgreSQL |
| Fly.io | ✅ Requer configuração de banco |
| AWS Amplify | ✅ Requer banco externo |

---

## 📚 Documentação da API

### Endpoints

#### `POST /api/signatures`

Cria uma nova assinatura e retorna o link de compartilhamento.

**Request:**
```json
{
  "nome": "João",
  "sobrenome": "Silva",
  "area": "cto",
  "email": "joao.silva@ness.com.br",
  "telefone": "11 99999-9999",
  "linkedin": "joaosilva",
  "whatsapp": "11 99999-9999",
  "template": "modern",
  "theme": "branco"
}
```

**Response:**
```json
{
  "signature": {
    "id": "cm2abc123xyz",
    "slug": "Xk9mN2pQ",
    "nome": "João",
    "sobrenome": "Silva",
    "area": "cto",
    "email": "joao.silva@ness.com.br",
    "telefone": "11 99999-9999",
    "linkedin": "joaosilva",
    "whatsapp": "11 99999-9999",
    "template": "modern",
    "theme": "branco",
    "views": 0,
    "createdAt": "2026-01-15T10:30:00.000Z"
  },
  "shareUrl": "/s/Xk9mN2pQ"
}
```

---

#### `GET /api/signatures/:slug`

Retorna uma assinatura pelo slug e incrementa o contador de visualizações.

**Response:**
```json
{
  "signature": {
    "id": "cm2abc123xyz",
    "slug": "Xk9mN2pQ",
    "nome": "João",
    "sobrenome": "Silva",
    "area": "cto",
    "email": "joao.silva@ness.com.br",
    "telefone": "11 99999-9999",
    "linkedin": "joaosilva",
    "whatsapp": "11 99999-9999",
    "template": "modern",
    "theme": "branco",
    "views": 42,
    "createdAt": "2026-01-15T10:30:00.000Z"
  }
}
```

---

#### `DELETE /api/signatures/:slug`

Remove uma assinatura.

**Response:**
```json
{
  "success": true
}
```

---

#### `GET /api/signatures`

Lista todas as assinaturas (admin).

**Response:**
```json
{
  "signatures": [
    {
      "id": "cm2abc123xyz",
      "slug": "Xk9mN2pQ",
      "nome": "João",
      "sobrenome": "Silva",
      "area": "cto",
      "views": 42
    }
  ]
}
```

### Códigos de Status

| Código | Descrição |
|--------|-----------|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `400` | Requisição inválida |
| `404` | Assinatura não encontrada |
| `500` | Erro interno do servidor |

---

## 🎨 Design System

### Paleta de Cores NESS

| Nome | Hex | Uso |
|------|-----|-----|
| **Primary** | `#00ade8` | Cor principal, acentos |
| **Primary Hover** | `#008bb8` | Hover em botões |
| **Primary Light** | `#4dc2ff` | Destaques sutis |
| **Primary Dark** | `#006988` | Elementos escuros |
| **Background** | `#0f172a` | Fundo principal |
| **Card** | `#1e293b` | Cards e painéis |
| **Border** | `#334155` | Bordas |
| **Text Primary** | `#f1f5f9` | Texto principal |
| **Text Secondary** | `#94a3b8` | Texto secundário |
| **Text Muted** | `#64748b` | Texto desabilitado |

### Regras da Marca

```css
/* ✅ Correto */
ness.

/* ❌ Incorreto */
NESS.
NESS
ness
```

- Sempre em minúsculas: `ness`
- Ponto final obrigatório: `.`
- Ponto sempre em `#00ade8`

### Tipografia

| Elemento | Fonte | Peso | Tamanho |
|----------|-------|------|---------|
| Logo | Montserrat | 500 | 42px |
| Títulos | Montserrat | 600 | 17-20px |
| Corpo | Montserrat | 400 | 11-12px |
| Labels | Montserrat | 700 | 9-11px |

### Componentes

#### Botões

```tsx
// Primary
<Button className="bg-[#00ade8] hover:bg-[#008bb8] text-white">
  Ação
</Button>

// Outline
<Button variant="outline" className="border-2 border-[#00ade8] text-[#00ade8] hover:bg-[#00ade8] hover:text-white">
  Ação
</Button>

// Ghost
<Button variant="ghost" className="text-[#00ade8] hover:bg-[#00ade8]/10">
  Ação
</Button>
```

#### Inputs

```tsx
<Input className="bg-slate-900 border-slate-700 text-white focus:ring-2 focus:ring-[#00ade8]/50 focus:border-[#00ade8]" />
```

---

## 📐 Templates

### 1. Clássico

Layout tradicional com logo à esquerda separado por linha vertical.

```
┌─────────────┬──────────────────────────────┐
│             │ Nome Sobrenome               │
│   ness.     │ ÁREA | CARGO                 │
│             │ 📞 +55 (11) 2504-7650        │
│             │ 📱 +55 11 99999-9999         │
│             │ 📧 email@ness.com.br         │
│             │ 🌐 ness.com.br               │
└─────────────┴──────────────────────────────┘
```

**Ideal para:** Operações, Security, Backoffice

---

### 2. Moderno

Design clean com linha colorida superior.

```
ness.
─────────────────────────────────

Nome Sobrenome
ÁREA | CARGO

📞 +55 (11) 2504-7650
📱 +55 11 99999-9999
📧 email@ness.com.br
🌐 ness.com.br

[LinkedIn] [WhatsApp]
```

**Ideal para:** CTO, CMO, CPO, CDO

---

### 3. Minimal

Versão compacta e direta.

```
Nome Sobrenome
ÁREA | CARGO

📧 email@ness.com.br  📞 +55 (11) 2504-7650
📱 +55 11 99999-9999
🌐 ness.com.br
```

**Ideal para:** Finance, HR, Facilities

---

### 4. Corporativo

Layout profissional em grade.

```
┌────────────────────────────────────────────┐
│ ness.                  Nome Sobrenome      │
│ Cybersecurity &       ÁREA | CARGO         │
│ Tech Solutions                             │
├────────────────────────────────────────────┤
│ 📞 +55 (11) 2504-7650   📱 +55 11 99999... │
│ 📧 email@ness.com.br    🌐 ness.com.br     │
└────────────────────────────────────────────┘
```

**Ideal para:** CEO, CFO, COO, CIO, CSO, CHRO

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação | Contexto |
|--------|------|----------|
| `Ctrl + S` | Salvar assinatura | Formulário preenchido |
| `Ctrl + Shift + C` | Copiar HTML | Formulário preenchido |
| `Ctrl + E` | Exportar PNG | Formulário preenchido |

---

## 📁 Estrutura do Projeto

```
n.sign/
├── 📁 prisma/
│   └── 📄 schema.prisma        # Schema do banco de dados
│
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 api/
│   │   │   └── 📁 signatures/
│   │   │       ├── 📄 route.ts           # GET, POST /api/signatures
│   │   │       └── 📁 [slug]/
│   │   │           └── 📄 route.ts       # GET, DELETE /api/signatures/:slug
│   │   │
│   │   ├── 📁 s/
│   │   │   └── 📁 [slug]/
│   │   │       └── 📄 page.tsx           # Página de assinatura compartilhada
│   │   │
│   │   ├── 📄 layout.tsx       # Layout principal + metadados
│   │   ├── 📄 page.tsx         # Página principal do gerador
│   │   └── 📄 globals.css      # Estilos globais + animações
│   │
│   ├── 📁 components/
│   │   └── 📁 ui/              # Componentes shadcn/ui
│   │
│   └── 📁 lib/
│       └── 📄 db.ts            # Cliente Prisma
│
├── 📄 package.json             # Dependências e scripts
├── 📄 tailwind.config.ts       # Configuração Tailwind + tema NESS
├── 📄 tsconfig.json            # Configuração TypeScript
├── 📄 next.config.ts           # Configuração Next.js
└── 📄 README.md                # Esta documentação
```

---

## 🤝 Contribuição

### Fluxo de Contribuição

1. **Fork** o repositório
2. **Crie uma branch** (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request`

### Padrões de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Formatação, ponto e vírgula, etc |
| `refactor` | Refatoração de código |
| `test` | Adição/correção de testes |
| `chore` | Tarefas de manutenção |

### Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade

---

## 📊 Roadmap

### v2.2 (Próximo)

- [ ] Upload de foto de perfil
- [ ] Assinaturas em massa (importar CSV)
- [ ] API de integração com HR systems
- [ ] Dashboard administrativo

### v2.3 (Futuro)

- [ ] Múltiplos idiomas (PT-BR, EN, ES)
- [ ] Templates customizáveis
- [ ] Analytics de cliques
- [ ] Webhooks para integrações

---

## 📄 Licença

```
© 2026 NESS. Todos os direitos reservados.

Este software é propriedade da NESS Cybersecurity & Tech Solutions.
Uso restrito a colaboradores e parceiros autorizados.
```

---

## 📞 Suporte

### Canais

| Canal | Contato |
|-------|---------|
| **Email** | contato@ness.com.br |
| **Website** | [ness.com.br](https://www.ness.com.br) |
| **GitHub Issues** | [github.com/resper1965/n.sign/issues](https://github.com/resper1965/n.sign/issues) |

### FAQ

<details>
<summary><strong>Como usar a assinatura no Gmail?</strong></summary>

1. Copie a assinatura clicando em "Copiar HTML"
2. Acesse Gmail → Configurações → Ver todas as configurações
3. Role até "Assinatura" e cole na caixa de texto
4. Salve as alterações

</details>

<details>
<summary><strong>Por que meu email não é validado?</strong></summary>

O sistema valida apenas emails corporativos NESS (`@ness.com.br`). Se você é colaborador, use seu email institucional.

</details>

<details>
<summary><strong>As assinaturas ficam salvas onde?</strong></summary>

- **Localmente**: No navegador (localStorage)
- **Compartilhamento**: No banco de dados PostgreSQL

</details>

---

<p align="center">
  <strong>n.sign</strong><br>
  <em>Desenvolvido com ❤️ para NESS Cybersecurity & Tech Solutions</em>
</p>

<p align="center">
  <a href="https://www.ness.com.br" target="_blank">ness.com.br</a>
</p>
