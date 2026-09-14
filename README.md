# UPAR AI — Computadores de alta performance para Inteligência Artificial

Plataforma consultiva de captação de clientes para a UPAR: o visitante entende qual
configuração atende a sua aplicação, compara opções e chega ao WhatsApp com contexto.
Não é um e-commerce — não há carrinho nem checkout.

> **Estado da entrega:** primeira etapa concluída e navegável, com dados demonstrativos
> claramente identificados no site e no painel. Veja [`docs/dados-reais-pendentes.md`](docs/dados-reais-pendentes.md)
> para a lista do que a UPAR precisa fornecer antes da publicação.

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Linguagem | TypeScript (modo estrito) |
| Estilo | Tailwind CSS 4 (configuração CSS-first em `src/styles/globals.css`) |
| Dados / Auth / Storage | Supabase (opcional — há fallback em memória para homologação) |
| Validação | Zod |
| Fontes | Inter (texto) e Sora (títulos), via `next/font` |

Sem dependências de UI de terceiros: ícones, gráficos e as ilustrações dos
equipamentos são SVG próprios, o que mantém o carregamento leve.

## Como rodar

```bash
npm install
cp .env.example .env.local     # opcional nesta fase
npm run dev                    # http://localhost:3000
```

Sem variáveis do Supabase o site sobe com o **catálogo demonstrativo em memória** —
tudo funciona, inclusive o painel administrativo (as alterações valem enquanto o
processo estiver no ar).

Outros comandos: `npm run build`, `npm start`, `npm run typecheck`.

### Acesso ao painel

`/admin/login` — em modo de demonstração as credenciais vêm de `ADMIN_DEMO_EMAIL` e
`ADMIN_DEMO_PASSWORD` (padrão: `admin@uparai.com.br` / `upar-ai-demo`).
**Remova essas variáveis em produção** e use exclusivamente o Supabase Auth.

## Conectando o Supabase

1. Crie o projeto e rode `supabase/migrations/0001_init.sql` (tabelas, índices,
   políticas de RLS e o bucket `produtos` do Storage).
2. Preencha `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e
   `SUPABASE_SERVICE_ROLE_KEY`.
3. Crie os usuários no Supabase Auth e insira a linha correspondente em
   `admin_users` (com `auth_uid` e o papel).
4. Migre o conteúdo demonstrativo de `src/data/` para as tabelas.

A troca é transparente para o restante do código: `getRepository()`
(`src/lib/repository/index.ts`) escolhe o adaptador conforme as variáveis presentes.
Nenhuma página conhece a origem dos dados.

## Arquitetura

```
src/
  app/
    (site)/            páginas públicas — layout com header, rodapé, WhatsApp e cookies
    admin/
      login/           autenticação
      (painel)/        área autenticada com navegação por permissão
    api/leads/         registro de leads (POST, validado com Zod)
    api/admin/leads/csv exportação de leads (exige sessão)
    sitemap.ts robots.ts icon.svg
  components/
    ui/                primitivos (Button, Badge, Field, Accordion, Icon, Section…)
    site/              header, rodapé, CTAs de WhatsApp, consentimento, renders SVG
    home/ catalog/ product/ compare/ diagnostic/ forms/ admin/
  data/                conteúdo demonstrativo (aplicações, produtos, artigos, leads)
  lib/
    types.ts           modelo de domínio
    repository/        contrato + adaptadores (memória e Supabase)
    whatsapp.ts        mensagens contextuais por origem
    diagnostic.ts      perguntas e motor de recomendação
    catalog-filters.ts motor de filtros e ordenação
    analytics.ts       GA4, GTM, Meta Pixel, Google Ads e captura de UTM
    auth.ts            sessão assinada (HMAC) e matriz de permissões
    schema.ts          dados estruturados schema.org
  middleware.ts        proteção de /admin e /api/admin
supabase/migrations/   esquema SQL com RLS
docs/                  sitemap, design system e pendências de dados reais
```

### Princípios que guiaram o código

- **Um único ponto de acesso a dados.** Páginas chamam `getRepository()`; trocar
  memória por Supabase não altera componente algum.
- **Nada de número inventado.** Benchmarks só aparecem quando cadastrados **e**
  marcados como validados. Preços têm três modos (exibido, a partir de, sob consulta).
  Conteúdo demonstrativo é sinalizado na interface, não escondido.
- **WhatsApp contextual.** Todo CTA passa pelo mesmo componente, que monta a mensagem
  a partir da origem (produto, comparador, diagnóstico, aplicação, catálogo).
- **Mensuração com consentimento.** Nenhum script de medição carrega antes do aceite.

## O que já funciona

- Home completa e responsiva, com as nove seções previstas.
- Catálogo com 12 grupos de filtros combináveis, busca, ordenação e URL compartilhável.
- Página de produto com galeria, ficha técnica, “Entenda esta máquina”,
  “O que este computador consegue fazer?”, expansão, garantia, comparação e CTA fixo.
- Comparador de até três configurações, com destaque de diferenças **sem** eleger
  um vencedor absoluto.
- Diagnóstico de dez perguntas com recomendação de categoria, até três produtos,
  registro do lead e envio do resumo por WhatsApp.
- Painel: visão geral, leads (filtros, status, consultor, anotações, CSV), produtos
  (criar, editar, duplicar, publicar, remover), conteúdos, configurações, usuários e
  registros de alteração.
- SEO técnico: metadata por página, canônicas, sitemap, robots e schema.org
  (Organization, WebSite, Product, Article, FAQPage, BreadcrumbList).

## Verificações realizadas

- `npm run build` e `npm run typecheck` sem erros.
- Navegação real em Chromium: filtros, comparador, diagnóstico ponta a ponta
  (incluindo gravação do lead), login do painel e exportação CSV.
- Sem rolagem horizontal em 360, 390, 768, 1024 e 1440 px.
- Auditoria estrutural de acessibilidade nas oito páginas principais: um `h1` por
  página, hierarquia de títulos sem saltos, todos os campos rotulados, todos os
  controles com nome acessível, `main` presente e atalho “Ir para o conteúdo”.
- Sem erros de console em nenhuma página.

## Próximos passos sugeridos

1. Substituir os dados demonstrativos (ver `docs/dados-reais-pendentes.md`).
2. Conectar o Supabase e migrar o conteúdo.
3. Fotografia real dos equipamentos (a estrutura de imagens já está pronta).
4. Integração com CRM e API oficial do WhatsApp (a modelagem de leads já contempla).
