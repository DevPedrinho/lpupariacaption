# Dados reais que a UPAR precisa fornecer

Tudo o que está no site hoje funciona, mas parte do conteúdo é **demonstrativo** e
está sinalizado como tal na interface. Esta lista também aparece na visão geral do
painel administrativo e é editável em **Configurações**.

## Bloqueantes para publicar

| # | Item | Onde entra | Como cadastrar |
| --- | --- | --- | --- |
| 1 | **Número oficial do WhatsApp comercial** | Todos os CTAs do site | Painel → Configurações → WhatsApp. Hoje está `5585000000000` (placeholder) |
| 2 | **Cores oficiais da marca** | Todo o design system | `src/styles/globals.css`, bloco “MARCA”. A paleta atual é provisória: não foi possível acessar `upartech.com.br` a partir do ambiente de desenvolvimento para extrair as cores oficiais |
| 3 | **Logotipo em vetor (SVG)**, versões clara e escura | Cabeçalho, rodapé, painel, favicon | Substituir `src/components/site/Logo.tsx` e `src/app/icon.svg` |
| 4 | **CNPJ, endereço, telefone e e-mail públicos** | Rodapé, contato, dados estruturados | Painel → Configurações → Dados da empresa |
| 5 | **Catálogo real de produtos** | Catálogo, comparador, diagnóstico | Painel → Produtos. As 9 configurações atuais são demonstrativas |
| 6 | **Condições reais de garantia e suporte** | Páginas de produto e institucional | Painel → Configurações (política geral) e por produto |
| 7 | **Revisão jurídica** da Política de Privacidade e dos Termos de Uso | Páginas institucionais | Textos preliminares em `src/app/(site)/politica-de-privacidade` e `termos-de-uso` |

## Importantes, mas não bloqueantes

| # | Item | Observação |
| --- | --- | --- |
| 8 | **Fotografias reais dos equipamentos e da estrutura física** | Hoje o site usa ilustrações vetoriais próprias, identificadas como “ilustração técnica”. O campo `images[].src` já aceita URL do Supabase Storage (bucket `produtos`) |
| 9 | **Depoimentos e avaliações reais, com autorização de uso** | Os três depoimentos atuais aparecem com aviso visível de que são demonstrativos. **Não invente depoimentos** — a seção some sozinha se a lista ficar vazia |
| 10 | **Números institucionais** (tempo de mercado, clientes atendidos, tamanho da equipe) | Deliberadamente ausentes da página “Sobre”. Serão exibidos assim que forem informados |
| 11 | **Benchmarks medidos e validados** | O campo existe no modelo (`benchmarks`), mas está vazio em todos os produtos. A seção “Medições validadas” só aparece quando houver item com `validated: true`. O site declara publicamente que não publica número não medido |
| 12 | **IDs de GA4, GTM, Meta Pixel e Google Ads** | Painel → Configurações → SEO e mensuração. Os scripts só carregam após o aceite de cookies |
| 13 | **Preços reais** | Quatro produtos demonstrativos têm valor marcado como “valor demonstrativo” apenas para exercitar o filtro de faixa de investimento. Os demais estão “sob consulta” |
| 14 | **Segmentos e clientes atendidos** | A página “Sobre” lista perfis genéricos; substituir por segmentos reais quando houver autorização |

## Como o site sinaliza conteúdo demonstrativo

- Selo **“Dado demonstrativo”** nos cards e nas páginas de produto.
- Aviso em destaque nas seções de depoimentos, artigos e na página “Sobre”.
- Coluna “Demo” na listagem de produtos e conteúdos do painel.
- Contador de pendências na visão geral do painel.

Ao substituir um item, desmarque a caixa **“Marcar como dado demonstrativo”** no
cadastro correspondente e remova a linha da lista em Configurações.

## Decisões conscientes de não inventar

Durante a construção, estas informações foram **deixadas de fora** em vez de
preenchidas com estimativas:

- Tempo de mercado, número de clientes e tamanho da equipe.
- Prazos de entrega e de garantia.
- Tokens por segundo, tempo de renderização e compatibilidade com modelos específicos.
- Depoimentos, avaliações e nomes de clientes.
- Preços da maior parte do catálogo.

A estrutura para todos eles existe e está pronta para receber o dado real.
