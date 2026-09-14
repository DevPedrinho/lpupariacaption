# Deploy — UPAR AI

## Supabase (pronto)

| Item | Valor |
| --- | --- |
| Projeto | **UPAR AI** |
| Referência | `bzkhsyquveiuyosojwtr` |
| Região | `sa-east-1` (São Paulo) |
| URL da API | `https://bzkhsyquveiuyosojwtr.supabase.co` |
| Painel | https://supabase.com/dashboard/project/bzkhsyquveiuyosojwtr |
| Plano | Gratuito (R$ 0/mês) |

### O que já está aplicado

- **Schema completo**: 9 tabelas, índices (inclusive GIN em `applications`) e o bucket
  público `produtos` no Storage.
- **RLS ativa em todas as tabelas**, com as funções `is_active_admin()` e
  `has_admin_role(text[])`. Leitura pública apenas de conteúdo publicado; `leads`
  nunca é legível sem sessão administrativa.
- **Conteúdo carregado**: 13 aplicações, 9 produtos, 6 artigos, 8 perguntas
  frequentes, 3 depoimentos, configurações do site e 4 perfis administrativos.
- **`leads` começa vazia** — nenhum lead demonstrativo foi para produção.

### O que falta no Supabase

Criar os usuários em **Authentication → Users** e vincular cada um ao perfil já
existente em `admin_users`, preenchendo `auth_uid`:

```sql
update public.admin_users
set auth_uid = '<uuid-do-usuario-no-auth>'
where email = 'admin@uparai.com.br';
```

Enquanto `auth_uid` estiver nulo, o perfil não concede acesso — é o comportamento
correto: nenhum acesso é liberado por engano.

## Vercel

O projeto precisa ser importado uma vez pelo painel (a conexão desta sessão não
expõe nenhum time da Vercel, e a criação de projeto exige um `teamId`).

1. Acesse **https://vercel.com/new** e importe `DevPedrinho/lpupariacaption`.
2. Framework: **Next.js** (detectado automaticamente). Nenhum ajuste de build é
   necessário — sem *root directory*, sem comando customizado.
3. Branch de produção: `claude/practical-bell-ko7hcb` (ou faça o merge na branch
   padrão antes de importar).
4. Configure as variáveis de ambiente abaixo **antes do primeiro deploy**.

### Variáveis de ambiente

| Variável | Valor | Onde obter |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL final do site | Defina o domínio de produção |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bzkhsyquveiuyosojwtr.supabase.co` | já definido |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave `anon` / publishable | Supabase → Settings → API Keys |
| `SUPABASE_SERVICE_ROLE_KEY` | chave `service_role` | Supabase → Settings → API Keys |
| `ADMIN_SESSION_SECRET` | string longa e aleatória | gere você (ver abaixo) |

> **`SUPABASE_SERVICE_ROLE_KEY` é secreta.** Ela dá acesso total ao banco,
> ignorando RLS. Vai apenas na Vercel (nunca no repositório, nunca em variável
> `NEXT_PUBLIC_`). É ela que permite registrar leads e usar o painel.

> **`ADMIN_SESSION_SECRET`** assina o cookie de sessão do painel. Se ficar no
> valor padrão, qualquer pessoa que conheça o código consegue forjar uma sessão.
> Gere com: `openssl rand -base64 48`

Não defina `ADMIN_DEMO_EMAIL` nem `ADMIN_DEMO_PASSWORD` em produção. Sem elas e
com o Supabase configurado, o login passa a exigir Supabase Auth.

Opcionais (também editáveis pelo painel administrativo):
`NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`.

### Depois do primeiro deploy

1. Ajuste `NEXT_PUBLIC_SITE_URL` para o domínio final e refaça o deploy
   (essa variável alimenta canônicas, sitemap e dados estruturados).
2. Em **Supabase → Authentication → URL Configuration**, inclua o domínio da
   Vercel nas URLs permitidas.
3. Acesse `/admin/login` com o usuário criado no Supabase Auth.
4. Em **Configurações**, troque o WhatsApp de demonstração (`5585000000000`)
   pelo número real — é o item que mais impacta a conversão.

## Observação sobre a validação

O adaptador Supabase **não pôde ser exercitado no ambiente de desenvolvimento**:
o proxy de rede do sandbox bloqueia `*.supabase.co` para o processo Node (as
tabelas foram criadas e populadas por outro caminho). O schema, as políticas e os
dados estão verificados por consulta direta ao banco; o caminho de leitura da
aplicação contra o Supabase real só será exercitado no primeiro deploy.

Para reduzir o risco disso derrubar um deploy, `generateStaticParams` das rotas
dinâmicas foi tornado tolerante a falha: se a origem de dados estiver
indisponível no build, as páginas passam a ser renderizadas sob demanda em vez
de interromper a publicação.

Se o catálogo aparecer vazio após o deploy, a causa quase certa é variável de
ambiente ausente ou incorreta — confira `NEXT_PUBLIC_SUPABASE_URL` e
`NEXT_PUBLIC_SUPABASE_ANON_KEY` antes de investigar o código.

## Recarregar o conteúdo

`npm run seed` recarrega `src/data` no Supabase. É idempotente (usa upsert) e
**não** toca na tabela de leads. Requer `NEXT_PUBLIC_SUPABASE_URL` e
`SUPABASE_SERVICE_ROLE_KEY` no ambiente ou em `.env.local`.
