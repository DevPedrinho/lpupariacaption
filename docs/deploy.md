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

### O que já foi publicado desta sessão

Dois projetos foram criados e receberam um deploy de produção:

| Projeto | O que é | Endereço |
| --- | --- | --- |
| `upar-ai` | a aplicação Next.js completa | `upar-ai-pedros-projects-8bfe3549.vercel.app` |
| `upar-ai-demo` | página estática de apresentação (`static-demo/`) | `upar-ai-demo-pedros-projects-8bfe3549.vercel.app` |

O token desta sessão consegue **criar** deploys, mas recebe `403` ao ler
qualquer coisa do escopo `pedros-projects-8bfe3549` (status, logs de build,
lista de projetos). O resultado dos dois deploys, portanto, **não foi
verificado** — confira no painel da Vercel.

### Como o deploy foi feito (e por que é provisório)

A conexão desta sessão não permite ligar o projeto ao repositório pelo Git.
Como contorno, o deploy sobe apenas o `package.json` e busca o código-fonte no
próprio GitHub durante o build, usando um comando de instalação customizado:

```
curl -sSL -o src.tgz https://codeload.github.com/DevPedrinho/lpupariacaption/tar.gz/refs/heads/claude/practical-bell-ko7hcb \
  && tar xzf src.tgz --strip-components=1 && rm -f src.tgz && npm ci --no-audit --no-fund
```

Isso funciona porque o repositório é público. Mas tem duas limitações:

- **não há deploy automático a cada push** — é preciso disparar manualmente;
- o comando aponta para uma branch fixa, então ele ignora qualquer outra
  referência que a Vercel venha a passar.

> **Ao importar o repositório pelo Git (recomendado), apague esse comando** em
> *Settings → Build & Development Settings → Install Command*. Se ele ficar,
> continuará sobrescrevendo o checkout pela branch fixa e o deploy deixará de
> refletir o que foi enviado.

### Importação definitiva pelo painel

1. Acesse **https://vercel.com/new** e importe `DevPedrinho/lpupariacaption`.
2. Framework: **Next.js** (detectado automaticamente). Nenhum ajuste de build é
   necessário — sem *root directory*, sem comando customizado.
3. Branch de produção: `claude/practical-bell-ko7hcb` (ou faça o merge na branch
   padrão antes de importar).
4. Configure as variáveis de ambiente abaixo **antes do primeiro deploy**.

### Variáveis de ambiente

As **públicas já estão versionadas** em `.env.production` (URL e chave `anon` do
Supabase, mais a URL do site). A chave `anon` é projetada para ser exposta ao
navegador — quem protege os dados é o RLS. Não é preciso configurá-las na Vercel.

Faltam apenas **dois segredos**, que precisam ser definidos na Vercel em
*Settings → Environment Variables*:

| Variável | Para que serve | Onde obter |
| --- | --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | registro de leads e painel administrativo | Supabase → Settings → API Keys → `service_role` |
| `ADMIN_SESSION_SECRET` | assina o cookie de sessão (mín. 32 caracteres) | `openssl rand -base64 48` |

Variáveis definidas na Vercel têm precedência sobre `.env.production`, então dá
para sobrescrever qualquer valor público sem editar o repositório — inclusive
`NEXT_PUBLIC_SITE_URL`, ao apontar o domínio final.

**Sem `ADMIN_SESSION_SECRET` o painel administrativo fica desabilitado por
segurança** (nenhuma sessão é criada nem aceita). Isso é proposital: o valor
padrão do código é público no repositório e permitiria forjar um cookie de
administrador.

> **`SUPABASE_SERVICE_ROLE_KEY` é secreta.** Ela dá acesso total ao banco,
> ignorando RLS. Vai apenas na Vercel — nunca no repositório, nunca em variável
> `NEXT_PUBLIC_`.

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

## Risco conhecido: build depende do Supabase de pé

O build gera as páginas estáticas lendo o catálogo. Se o Supabase estiver
inacessível nesse momento, `/comparador` interrompe o build inteiro — as rotas
dinâmicas e o `sitemap.xml` já toleram a falha, essa página ainda não.

Isso importa porque **projetos no plano gratuito do Supabase são pausados
automaticamente após alguns dias sem uso**. Com o projeto pausado, todo novo
deploy passa a falhar, e a mensagem no log aponta para o host do Supabase.

Se acontecer: despause o projeto em <https://supabase.com/dashboard> e refaça o
deploy. Para eliminar a dependência de vez, a página `/comparador` precisa
degradar em vez de quebrar, como já fazem `generateStaticParams` e o sitemap.

Comprovação local (os dois comandos que a Vercel executa):

```bash
curl -sSL -o src.tgz https://codeload.github.com/DevPedrinho/lpupariacaption/tar.gz/refs/heads/claude/practical-bell-ko7hcb
tar xzf src.tgz --strip-components=1 && npm ci && npm run build
```
