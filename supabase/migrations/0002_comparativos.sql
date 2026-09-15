-- =============================================================================
-- Módulo de comparativos
--
-- O cliente cria uma conta, envia a configuração que encontrou em outro lugar
-- (print, texto colado ou os dois) e conversa com a equipe da UPAR na própria
-- página. A IA redige um rascunho de resposta que só a equipe enxerga.
--
-- Separação que estrutura o arquivo inteiro: o rascunho da IA vive em uma
-- tabela própria, `comparison_drafts`, com política exclusiva de administrador.
-- O RLS do Postgres é por linha, não por coluna — se o rascunho ficasse em
-- `comparisons`, qualquer política que deixasse o cliente ler a própria linha
-- entregaria junto o texto que a equipe ainda não revisou.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabelas
-- -----------------------------------------------------------------------------

/**
 * Cliente cadastrado. O `id` é o mesmo do usuário no Supabase Auth, então a
 * política de acesso consegue comparar direto com `auth.uid()`.
 *
 * O WhatsApp é obrigatório: é por ele que o vendedor liga, e sem ele o módulo
 * não cumpre a função comercial.
 */
create table if not exists public.customers (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null,
  email       text not null unique,
  whatsapp    text not null,
  created_at  timestamptz not null default now()
);

/** Uma solicitação de comparativo aberta pelo cliente. */
create table if not exists public.comparisons (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.customers (id) on delete cascade,
  -- novo: aguardando a equipe | em_analise: alguém assumiu | respondido | encerrado
  status       text not null default 'novo'
               check (status in ('novo', 'em_analise', 'respondido', 'encerrado')),
  -- Configuração colada pelo cliente. Pode ficar vazia se ele mandou só print.
  source_text  text not null default '',
  -- Caminhos no bucket `comparativos`. Pode ficar vazio se ele só colou texto.
  image_paths  text[] not null default '{}',
  assigned_to  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists comparisons_customer_idx on public.comparisons (customer_id, created_at desc);
create index if not exists comparisons_status_idx   on public.comparisons (status, created_at desc);

/**
 * A conversa. `role` diz quem falou: o cliente ou a UPAR.
 *
 * Toda mensagem aqui já é visível para o cliente — o que ainda não foi revisado
 * não entra nesta tabela, fica em `comparison_drafts`.
 */
create table if not exists public.comparison_messages (
  id             uuid primary key default gen_random_uuid(),
  comparison_id  uuid not null references public.comparisons (id) on delete cascade,
  role           text not null check (role in ('cliente', 'upar')),
  body           text not null,
  -- Quem da equipe enviou. Nulo quando quem falou foi o cliente.
  author_email   text,
  created_at     timestamptz not null default now()
);

create index if not exists comparison_messages_idx on public.comparison_messages (comparison_id, created_at);

/**
 * Rascunho redigido pela IA, um por comparativo. Nunca é exposto ao cliente:
 * a política abaixo só permite administrador. O vendedor lê, edita e o que ele
 * enviar vira uma mensagem em `comparison_messages`.
 */
create table if not exists public.comparison_drafts (
  comparison_id    uuid primary key references public.comparisons (id) on delete cascade,
  body             text not null default '',
  -- Slug do produto do catálogo que a IA considerou mais coerente.
  suggested_slug   text,
  -- pendente: ainda não rodou | gerado | indisponivel: sem chave de IA | erro
  status           text not null default 'pendente'
                   check (status in ('pendente', 'gerado', 'indisponivel', 'erro')),
  model            text,
  error            text,
  updated_at       timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.customers           enable row level security;
alter table public.comparisons         enable row level security;
alter table public.comparison_messages enable row level security;
alter table public.comparison_drafts   enable row level security;

-- Cliente enxerga e edita só o próprio cadastro; a equipe enxerga todos.
create policy customers_self_read on public.customers
  for select using (id = auth.uid() or public.is_active_admin());

create policy customers_self_update on public.customers
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy customers_self_insert on public.customers
  for insert with check (id = auth.uid());

-- Comparativos: o dono vê os seus, a equipe vê todos.
create policy comparisons_owner_read on public.comparisons
  for select using (
    customer_id = auth.uid() or public.is_active_admin()
  );

create policy comparisons_owner_insert on public.comparisons
  for insert with check (customer_id = auth.uid());

create policy comparisons_admin_write on public.comparisons
  for update using (public.is_active_admin()) with check (public.is_active_admin());

-- Mensagens: o dono do comparativo lê e escreve como cliente; a equipe, tudo.
create policy comparison_messages_owner_read on public.comparison_messages
  for select using (
    public.is_active_admin()
    or exists (
      select 1 from public.comparisons c
      where c.id = comparison_id and c.customer_id = auth.uid()
    )
  );

create policy comparison_messages_owner_insert on public.comparison_messages
  for insert with check (
    public.is_active_admin()
    or (
      role = 'cliente'
      and exists (
        select 1 from public.comparisons c
        where c.id = comparison_id and c.customer_id = auth.uid()
      )
    )
  );

-- Rascunho da IA: exclusivo da equipe, em qualquer operação.
create policy comparison_drafts_admin_only on public.comparison_drafts
  for all using (public.is_active_admin()) with check (public.is_active_admin());

-- -----------------------------------------------------------------------------
-- Storage: bucket privado para os prints
--
-- Privado de propósito. A configuração que o cliente manda é dele, e o print
-- costuma trazer contexto que ele não escolheu publicar. A equipe acessa por
-- URL assinada de curta duração, gerada no servidor.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('comparativos', 'comparativos', false)
on conflict (id) do nothing;
