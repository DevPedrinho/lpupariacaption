# Sitemap e arquitetura das páginas — UPAR AI

Cada página tem um papel definido no funil: **entender → escolher → conversar**.
Nenhuma delas é um fim em si; todas levam a uma conversa com um especialista.

## Site público

| Rota | Papel no funil | Conteúdo principal |
| --- | --- | --- |
| `/` | Captura e orientação | Primeira dobra com os dois CTAs, aplicações atendidas, computadores em destaque, como a consultoria funciona, benefícios de IA local, comparativo de categorias, diferenciais, depoimentos, FAQ e CTA final |
| `/solucoes` | Entendimento | Índice das 13 aplicações, com contagem de configurações e categorias indicadas |
| `/solucoes/[slug]` | Entendimento | Para quem é indicada, desafios de hardware, peso relativo de cada componente, configurações recomendadas, expansão e CTA |
| `/catalogo` | Escolha | 12 grupos de filtros, busca, ordenação, cards com especificação resumida e dois CTAs |
| `/produtos/[slug]` | Decisão | Galeria, resumo comercial, ficha completa, “Entenda esta máquina”, “O que este computador consegue fazer?”, medições validadas (quando houver), expansão, garantia, comparação, relacionados e CTA fixo |
| `/comparador` | Decisão | Até três configurações lado a lado, com destaque de diferenças e ressalva explícita de que não há vencedor absoluto |
| `/encontre-sua-configuracao` | Qualificação | Diagnóstico de 10 perguntas → categoria indicada + até 3 produtos + registro do lead + envio por WhatsApp |
| `/consultoria` | Confiança | As sete etapas do processo, o que levar para a conversa, compromissos e FAQ |
| `/conteudos` | Autoridade / SEO | Guias, comparativos, IA local, estudos de caso, glossário |
| `/conteudos/[slug]` | Autoridade / SEO | Artigo com dados estruturados `Article` |
| `/sobre` | Confiança | História, forma de trabalho, estrutura, segmentos atendidos, serviços e garantia |
| `/contato` | Conversão | Formulário com registro de lead + canais diretos |
| `/politica-de-privacidade` | Conformidade | LGPD (texto preliminar, pendente de revisão jurídica) |
| `/termos-de-uso` | Conformidade | Condições de uso (texto preliminar) |

Rotas técnicas: `/sitemap.xml`, `/robots.txt`, `/icon.svg` e página 404 própria.

## Painel administrativo

| Rota | Perfis com acesso | Função |
| --- | --- | --- |
| `/admin/login` | público | Autenticação |
| `/admin` | todos | Indicadores, funil comercial, leads recentes, pendências de dados reais e últimas alterações |
| `/admin/leads` | administrador, gestor comercial, consultor de vendas | Filtros, detalhe com respostas do diagnóstico, status, consultor responsável, anotações e exportação CSV |
| `/admin/produtos` | administrador, gestor comercial, editor de conteúdo | Listar, criar, editar, duplicar, publicar/despublicar e remover |
| `/admin/produtos/novo`, `/admin/produtos/[id]` | idem | Formulário completo da configuração |
| `/admin/conteudos` | administrador, editor de conteúdo | Artigos, FAQ e depoimentos |
| `/admin/conteudos/novo`, `/admin/conteudos/[slug]` | idem | Editor de artigo com campos de SEO |
| `/admin/configuracoes` | administrador | WhatsApp, dados da empresa, textos da home, garantia, SEO, mensuração e pendências |
| `/admin/usuarios` | administrador | Usuários e descrição dos quatro perfis |
| `/admin/registros` | administrador, gestor comercial | Histórico de alterações |

## Matriz de permissões

| | Visão geral | Leads | Produtos | Conteúdos | Configurações | Usuários | Registros |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Administrador | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Gestor comercial | ✓ | ✓ | ✓ | — | — | — | ✓ |
| Editor de conteúdo | ✓ | — | ✓ | ✓ | — | — | — |
| Consultor de vendas | ✓ | ✓ | — | — | — | — | — |

Definida em `src/lib/auth.ts` e aplicada tanto na navegação quanto no servidor
(`requireSession(capability)`), além do `middleware.ts` que bloqueia `/admin` e
`/api/admin` sem sessão válida.

## Mensagens de WhatsApp por origem

Montadas em `src/lib/whatsapp.ts`. A origem de cada clique define o texto:

- **Página de produto** — “Olá! Estou analisando o computador *[NOME]* no site da UPAR AI. Minha principal aplicação será *[APLICAÇÃO]*. Gostaria de validar essa configuração com um especialista.”
- **Comparador** — “Olá! Comparei as configurações *[A]*, *[B]* e *[C]* no site da UPAR AI. Quero ajuda para identificar a melhor opção para minha aplicação.”
- **Diagnóstico** — “Olá! Finalizei o diagnóstico no site da UPAR AI. Estas são as minhas respostas: *[RESUMO]*. Categoria indicada pelo site: *[CATEGORIA]*. Gostaria de receber uma recomendação e um orçamento.”
- **Solução por aplicação**, **catálogo com filtros**, **consultoria** e **genérica** têm variações próprias.

## Eventos de mensuração

Disparados em `src/lib/analytics.ts` para dataLayer, gtag e fbq (após consentimento):
`whatsapp_click`, `view_item`, `compare_products`, `filter_catalog`,
`diagnostic_start`, `diagnostic_step`, `diagnostic_complete`, `generate_lead`,
`form_submit`. Parâmetros de UTM, `gclid` e `fbclid` são capturados na primeira
visita e anexados aos eventos e ao lead.
