# Guia de Contribuição

Obrigado pelo interesse em contribuir com o **ness.MKT**! Este documento fornece diretrizes para contribuir com o projeto.

---

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Ambiente de Desenvolvimento](#ambiente-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Features](#sugerindo-features)

---

## Código de Conduta

### Nossos Compromissos

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia para com outros membros

### Comportamento Inaceitável

- Uso de linguagem ou imagens sexualizadas
- Trolling, insultos ou comentários depreciativos
- Assédio público ou privado
- Publicar informações privadas sem permissão

---

## Como Contribuir

### 1. Fork e Clone

```bash
# Fork via GitHub UI, depois:
git clone https://github.com/SEU-USUARIO/ness.MKT.git
cd ness.MKT
```

### 2. Crie uma Branch

```bash
# Feature nova
git checkout -b feature/nome-da-feature

# Bug fix
git checkout -b fix/descricao-do-bug

# Documentação
git checkout -b docs/descricao
```

### 3. Faça suas Mudanças

- Siga os [padrões de código](#padrões-de-código)
- Escreva testes se aplicável
- Atualize documentação se necessário

### 4. Commit e Push

```bash
git add .
git commit -m "feat: descrição da mudança"
git push origin feature/nome-da-feature
```

### 5. Abra um Pull Request

- Vá ao GitHub e abra um PR
- Preencha o template
- Aguarde review

---

## Ambiente de Desenvolvimento

### Pré-requisitos

| Ferramenta | Versão | Instalação |
|------------|--------|------------|
| Bun | >= 1.x | `curl -fsSL https://bun.sh/install | bash` |
| Node.js | >= 18.x | `nvm install 20` |
| Git | Latest | `apt install git` |

### Setup Inicial

```bash
# Instale dependências
bun install

# Instale dependências das Functions
cd functions && npm install && cd ..

# Configure ambiente
cp .env.example .env.local

# Rode o projeto
bun run dev
```

### Scripts Disponíveis

```bash
# Desenvolvimento
bun run dev          # Inicia servidor de dev

# Build
bun run build        # Build de produção
bun run lint         # Verifica código

# Functions
cd functions
npm run build        # Build das Functions
npm run serve        # Emulador local
```

### Estrutura de Branches

```
master        → Produção (deploy automático)
├── develop   → Desenvolvimento
├── feature/* → Features em desenvolvimento
├── fix/*     → Bug fixes
└── docs/*    → Documentação
```

---

## Padrões de Código

### TypeScript

```typescript
// ✅ Preferido
interface Signature {
  id: string
  nome: string
  email: string
}

function createSignature(data: Signature): Promise<Signature> {
  return db.collection('signatures').add(data)
}

// ❌ Evite
function createSignature(data: any) {
  return db.collection('signatures').add(data)
}
```

### Componentes React

```tsx
// ✅ Preferido
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'outline'
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      className={cn(
        'px-4 py-2 rounded-lg',
        variant === 'primary' && 'bg-[#00ade8] text-white',
        variant === 'outline' && 'border-2 border-[#00ade8]'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ❌ Evite
export default ({ children, ...props }) => (
  <button {...props}>{children}</button>
)
```

### Estilização (Tailwind)

```tsx
// ✅ Use classes utilitárias
<div className="flex items-center gap-4 p-6 bg-slate-800 rounded-xl">

// ✅ Use cn() para condicionais
<div className={cn(
  'base-classes',
  isActive && 'active-classes'
)}>

// ❌ Evite CSS-in-JS
<div style={{ display: 'flex', padding: '24px' }}>
```

### Imports

```typescript
// ✅ Ordem correta
import { useState } from 'react'           // React
import { useRouter } from 'next/navigation' // Next.js
import { Button } from '@/components/ui'    // Componentes
import { useAuth } from '@/contexts'        // Contextos
import { db } from '@/lib/firebase'         // Libs
import { Signature } from '@/types'         // Tipos
```

### Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `SignatureCard` |
| Funções | camelCase | `createSignature` |
| Constantes | SCREAMING_SNAKE | `MAX_SIGNATURES` |
| Arquivos (componentes) | PascalCase | `SignatureCard.tsx` |
| Arquivos (utils) | camelCase | `formatters.ts` |
| Pastas | kebab-case | `cartao-visita/` |

---

## Commits

### Formato

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[footer opcional]
```

### Tipos

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat(auth): add Google OAuth` |
| `fix` | Correção de bug | `fix(signatures): correct QR generation` |
| `docs` | Documentação | `docs: update README` |
| `style` | Formatação | `style: format code` |
| `refactor` | Refatoração | `refactor(auth): simplify auth flow` |
| `perf` | Performance | `perf: optimize image loading` |
| `test` | Testes | `test: add signature tests` |
| `chore` | Manutenção | `chore: update dependencies` |

### Escopos

- `auth` - Autenticação
- `signatures` - Módulo Assinaturas
- `proposals` - Módulo Propostas
- `ui` - Componentes UI
- `api` - Cloud Functions
- `deploy` - Deploy/CI

### Exemplos

```bash
# Feature
feat(signatures): add corporate template

# Bug fix
fix(auth): restrict to @ness.com.br domain

# Breaking change
feat(api)!: change signature response format

BREAKING CHANGE: signature response now includes views count
```

---

## Pull Requests

### Checklist

- [ ] Código segue os padrões do projeto
- [ ] Commit messages seguem convenção
- [ ] Documentação atualizada (se necessário)
- [ ] Sem warnings de lint
- [ ] Build passa localmente

### Template

```markdown
## Descrição
Breve descrição das mudanças.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passos para testar...

## Screenshots (se aplicável)

## Checklist
- [ ] Código formatado
- [ ] Lint passa
- [ ] Build passa
```

### Processo de Review

1. **Automated Checks** - CI roda automaticamente
2. **Code Review** - Pelo menos 1 aprovação
3. **Testing** - Testado em ambiente de dev
4. **Merge** - Squash e merge para master

---

## Reportando Bugs

### Antes de Reportar

1. Verifique se já existe issue aberta
2. Teste na versão mais recente
3. Colete informações do ambiente

### Template de Bug Report

```markdown
## Descrição
Descrição clara do bug.

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

## Comportamento Esperado
O que deveria acontecer.

## Comportamento Atual
O que acontece.

## Screenshots
Se aplicável.

## Ambiente
- OS: [e.g. Windows, macOS]
- Browser: [e.g. Chrome 120]
- Versão: [e.g. 1.0.0]
```

---

## Sugerindo Features

### Template

```markdown
## Problema
Qual problema essa feature resolveria?

## Solução Proposta
Como você imagina que funcionaria?

## Alternativas Consideradas
Outras soluções que você considerou.

## Contexto Adicional
Qualquer outro contexto, screenshots, etc.
```

---

## Contato

Dúvidas? Entre em contato:

- **Email:** contato@ness.com.br
- **GitHub Issues:** [github.com/resper1965/ness.MKT/issues](https://github.com/resper1965/ness.MKT/issues)

---

Obrigado por contribuir! 🎉
