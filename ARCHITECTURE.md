# Arquitetura do Sistema

Este documento descreve a arquitetura técnica do **ness.MKT**.

---

## 📐 Visão Geral

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTE                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     Next.js 16 (Static Export)                  │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │   │
│  │  │  Dashboard │Signatures│ Proposals│ Templates│ ...      │  │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │   │
│  │                           │                                      │   │
│  │                    ┌──────┴──────┐                              │   │
│  │                    │ AuthContext │                              │   │
│  │                    └──────┬──────┘                              │   │
│  │                           │                                      │   │
│  │              ┌────────────┼────────────┐                        │   │
│  │              ▼            ▼            ▼                        │   │
│  │        Firebase Auth  Firestore    Cloud Functions             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           FIREBASE PLATFORM                             │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Hosting   │  │   Auth      │  │  Firestore  │  │  Functions  │   │
│  │             │  │             │  │             │  │             │   │
│  │ Static Site │  │ Google OAuth│  │ NoSQL DB    │  │ Serverless  │   │
│  │ CDN Global  │  │ @ness.com.br│  │ Real-time   │  │ API Routes  │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Componentes

### 1. Frontend (Next.js)

| Característica | Descrição |
|----------------|-----------|
| Framework | Next.js 16 com App Router |
| Renderização | Static Export (SSG) |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS 4 + shadcn/ui |
| State | React Context + useState |

**Por que Static Export?**

- Menor custo (sem servidor)
- Melhor performance (CDN)
- Simplifica deploy
- Ideal para conteúdo que não muda frequentemente

### 2. Backend (Cloud Functions)

| Função | Método | Propósito |
|--------|--------|-----------|
| `getSignatures` | GET | Lista assinaturas |
| `createSignature` | POST | Cria assinatura |
| `getSignatureBySlug` | GET | Busca por slug |
| `getProposals` | GET | Lista propostas |
| `createProposal` | POST | Cria proposta |

**Runtime:** Node.js 20

### 3. Banco de Dados (Firestore)

**Collections:**

```
firestore/
├── signatures/
│   ├── id: string
│   ├── userId: string
│   ├── nome: string
│   ├── sobrenome: string
│   ├── area: string
│   ├── email: string
│   ├── telefone: string
│   ├── linkedin: string (optional)
│   ├── whatsapp: string (optional)
│   ├── template: 'classic' | 'modern' | 'minimal' | 'corporate'
│   ├── theme: 'branco' | 'azul' | 'dark'
│   ├── slug: string
│   ├── views: number
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── proposals/
│   ├── id: string
│   ├── title: string
│   ├── clientName: string
│   ├── clientEmail: string
│   ├── description: string
│   ├── value: string
│   ├── status: 'draft' | 'sent' | 'accepted' | 'rejected'
│   ├── gammaDocId: string (optional)
│   ├── gammaUrl: string (optional)
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
└── brandAssets/
    ├── id: string
    ├── category: 'logo' | 'color' | 'font' | 'icon' | 'template'
    ├── name: string
    ├── description: string
    ├── fileUrl: string
    └── metadata: map
```

**Índices:**

```javascript
// signatures
signatures.userId (ASC)
signatures.slug (ASC)
signatures.createdAt (DESC)

// proposals
proposals.status (ASC)
proposals.createdAt (DESC)
```

### 4. Autenticação (Firebase Auth)

**Fluxo:**

```
1. Usuário clica "Sign in with Google"
2. Firebase Auth abre popup OAuth
3. Google retorna dados do usuário
4. App valida domínio @ness.com.br
5. Firestore cria/atualiza profile
6. Usuário é redirecionado ao Dashboard
```

**Claims Personalizados:**

```json
{
  "role": "admin" | "user",
  "department": "executive" | "operations" | "backoffice"
}
```

---

## 🔄 Fluxo de Dados

### Criação de Assinatura

```
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│ Usuário│────▶│ Frontend│────▶│Function│────▶│Firestore│
└────────┘     └────────┘     └────────┘     └────────┘
                    │                              │
                    │                              │
                    ▼                              ▼
              Validations                    Document Created
              - Required fields              - ID generated
              - Email format                 - Slug generated
              - Area exists                  - Timestamps set
```

### Compartilhamento de Assinatura

```
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│Visitor │────▶│Hosting │────▶│Function│────▶│Firestore│
└────────┘     └────────┘     └────────┘     └────────┘
   /s/abc123       │              │              │
                    │              │              │
                    │              ▼              ▼
                    │         Get by slug    Return data
                    │         Increment views
                    ▼
              Render Page
```

---

## 🔒 Segurança

### Autenticação

- Apenas domínio `@ness.com.br` autorizado
- Sessões gerenciadas pelo Firebase Auth
- Tokens JWT renovados automaticamente

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Signatures - owner only
    match /signatures/{signatureId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
                    && request.auth.token.email.matches('.*@ness\\.com\\.br$');
      allow update, delete: if request.auth != null 
                             && resource.data.userId == request.auth.uid;
    }
    
    // Proposals - owner only
    match /proposals/{proposalId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Brand Assets - read only for users
    match /brandAssets/{assetId} {
      allow read: if request.auth != null;
      allow write: if false; // Admin only via Cloud Functions
    }
  }
}
```

### API Security

- CORS configurado para domínios autorizados
- Rate limiting via Firebase (nativo)
- Validação de input em todas as Functions

---

## 📊 Performance

### Otimizações Frontend

| Técnica | Implementação |
|---------|---------------|
| Static Generation | `output: 'export'` no next.config |
| Code Splitting | Automático por rota |
| Image Optimization | Next/Image component |
| Font Loading | `next/font` com preload |
| CSS | Tailwind purging automático |

### Otimizações Backend

| Técnica | Implementação |
|---------|---------------|
| Caching | Firebase CDN |
| Connection Pooling | Firebase SDK nativo |
| Cold Start | Functions com mesma região |
| Bundle Size | Tree shaking automático |

### Métricas Target

| Métrica | Target |
|---------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| TTFB | < 200ms |

---

## 🚀 Deploy

### Pipeline CI/CD

```yaml
Trigger: Push to master
    │
    ▼
┌─────────────────┐
│   Checkout      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Setup Bun     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Install Deps  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Build Next.js │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Build Functions │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Deploy Firebase │
└────────┬────────┘
         │
         ▼
    ✅ Done
```

### Rollback

```bash
# Listar releases
firebase hosting:releases:list

# Rollback para versão anterior
firebase hosting:rollback
```

---

## 📈 Escalabilidade

### Limites Atuais

| Recurso | Limite Free | Limite Blaze |
|---------|-------------|--------------|
| Hosting | 10 GB/mês | Ilimitado |
| Functions | 125K invocações/mês | Ilimitado |
| Firestore | 50K leituras/dia | Ilimitado |
| Auth | 10K usuários | Ilimitado |

### Estratégia de Escala

1. **Horizontal:** Functions escalam automaticamente
2. **CDN:** Hosting serve de edge locations globais
3. **Database:** Firestore escalona automaticamente
4. **Caching:** Implementar cache de API se necessário

---

## 🛠️ Manutenção

### Monitoramento

- Firebase Console (erros, performance)
- GitHub Actions (deploy status)

### Logs

```bash
# Functions logs
firebase functions:log

# Hosting logs
firebase hosting:log
```

### Backup

- Firestore: Backup automático diário (Blaze plan)
- Código: Git (GitHub)

---

## 📚 Referências

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/rules)
- [Cloud Functions](https://firebase.google.com/docs/functions)
