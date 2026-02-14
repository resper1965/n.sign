# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [1.0.0] - 2026-02-13

### Adicionado

#### Plataforma
- Dashboard principal com visão geral dos módulos
- Sistema de autenticação Firebase (Google OAuth)
- Restrição de domínio @ness.com.br
- Modo demo para testes sem Firebase
- Integração com ness.PEOPLE

#### Módulos

**Signatures (Assinaturas)**
- 4 templates de assinatura (Clássico, Moderno, Minimal, Corporativo)
- 3 temas de cores (Branco, Azul, Dark)
- Exportação HTML, PNG, JPEG
- Geração de QR Code vCard
- Links de compartilhamento público
- Histórico de versões (até 10)
- Validação de email corporativo
- Preview responsivo (Desktop/Mobile)
- Atalhos de teclado (Ctrl+S, Ctrl+Shift+C, Ctrl+E)

**Brand Manual (Manual da Marca)**
- Diretrizes de logo
- Paleta de cores
- Tipografia
- Aplicações

**Business Cards (Cartões de Visita)**
- Geração de cartão digital
- QR Code para contato
- Exportação para impressão

**Email Templates (Templates de Email)**
- 5 templates prontos
- Boas-vindas, Newsletter, Promocional, Transacional, Institucional

**Presentations (Apresentações)**
- Templates corporativos
- Integração Gamma.app
- Categorias: Corporativo, Comercial, Técnico, Treinamento

**Social Media (Redes Sociais)**
- Guias por plataforma
- Tamanhos recomendados
- Templates

**Proposals (Propostas)**
- Templates de propostas comerciais
- Tracking de status
- Integração com Gamma

**Press Kit (Kit de Imprensa)**
- Logos em múltiplos formatos
- Fotos institucionais
- Templates de press release

#### Infraestrutura
- Firebase Hosting configurado
- Firebase Cloud Functions para APIs
- Firestore como banco de dados
- GitHub Actions para CI/CD
- Deploy automático no push

#### Documentação
- README.md completo
- CHANGELOG.md
- CONTRIBUTING.md
- .env.example

---

## Versões Anteriores

### [0.2.0] - 2026-02-13 (n.sign standalone)

- Gerador de assinaturas standalone
- LocalStorage para persistência
- API com Prisma/SQLite

### [0.1.0] - 2026-02-11 (Inicial)

- Protótipo inicial do n.sign
- Template básico de assinatura

---

## Próximas Versões

### [1.1.0] - Planejado

- Upload de fotos de perfil
- Assinaturas em massa via CSV
- Dashboard administrativo
- Analytics de visualizações

### [1.2.0] - Futuro

- Integração completa com Gamma.app
- API pública documentada
- Webhooks
- Múltiplos idiomas (EN, ES)

---

[1.0.0]: https://github.com/resper1965/ness.MKT/releases/tag/v1.0.0
