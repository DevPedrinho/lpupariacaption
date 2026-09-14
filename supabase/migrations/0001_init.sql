-- =============================================================================
-- UPAR AI — esquema inicial
-- Aplicar com: supabase db push  (ou via SQL Editor do painel Supabase)
--
-- Estratégia: o objeto completo de cada entidade fica em `payload jsonb`
-- (espelhando os tipos de src/lib/types.ts) e as colunas escalares existem
-- para filtro, ordenação e índice.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ------------------------------- Catálogo ------------------------------------

create table if not exists public.products (
  id                text primary key,
  slug              text not null unique,
  status            text not null default 'draft' check (status in ('published','draft')),
  featured          boolean not null default false,
  form_factor       text not null check (form_factor in ('workstation','desktop','server')),
  performance_tier  text not null check (performance_tier in ('essencial','avancado','profissional','extremo')),
  gpu_vendor        text not null,
  gpu_quantity      int  not null default 1,
  vram_gb           int  not null default 0,
  ram_gb            int  not null default 0,
  cpu_cores         int  not null default 0,
  storage_gb        int  not null default 0,
  price_mode        text not null check (price_mode in ('displayed','from','on_request')),
  price_brl         numeric(12,2),
  availability      text not null check (availability in ('in_stock','made_to_order','pre_order','unavailable')),
  applications      text[] not null default '{}',
  payload           jsonb not null,
  updated_at        timestamptz not null default now()
);

create index if not exists products_status_idx      on public.products (status);
create index if not exists products_tier_idx        on public.products (performance_tier);
create index if not exists products_vram_idx        on public.products (vram_gb);
create index if not exists products_applications_ix on public.products using gin (applications);

create table if not exists public.applications (
  slug          text primary key,
  status        text not null default 'published' check (status in ('published','draft')),
  display_order int  not null default 0,
  payload       jsonb not null
);

-- ------------------------------- Conteúdo ------------------------------------

create table if not exists public.articles (
  slug         text primary key,
  status       text not null default 'draft' check (status in ('published','draft')),
  category     text not null,
  published_at date not null default current_date,
  payload      jsonb not null
);

create table if not exists public.testimonials (
  id      text primary key,
  status  text not null default 'draft' check (status in ('published','draft')),
  payload jsonb not null
);

create table if not exists public.faqs (
  id            text primary key,
  status        text not null default 'published' check (status in ('published','draft')),
  scope         text not null default 'geral' check (scope in ('home','produto','consultoria','geral')),
  display_order int  not null default 0,
  payload       jsonb not null
);

-- --------------------------------- Leads -------------------------------------

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  status       text not null default 'novo'
    check (status in ('novo','aguardando_contato','em_atendimento','qualificado',
                      'orcamento_enviado','negociacao','venda_concluida','perdido')),
  origin       text not null check (origin in ('diagnostico','produto','comparador','contato','consultoria','catalogo')),
  product_slug text,
  application  text,
  owner_email  text,
  payload      jsonb not null
);

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_idx  on public.leads (status);

-- ---------------------------- Configurações ----------------------------------

create table if not exists public.site_settings (
  id      int primary key default 1 check (id = 1),
  payload jsonb not null
);

-- --------------------- Usuários administrativos e auditoria ------------------

create table if not exists public.admin_users (
  id         uuid primary key default gen_random_uuid(),
  auth_uid   uuid unique,               -- referência a auth.users
  email      text not null unique,
  role       text not null default 'consultor_vendas'
    check (role in ('administrador','gestor_comercial','editor_conteudo','consultor_vendas')),
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  payload    jsonb not null
);

create table if not exists public.audit_logs (
  id      uuid primary key default gen_random_uuid(),
  at      timestamptz not null default now(),
  payload jsonb not null
);

create index if not exists audit_logs_at_idx on public.audit_logs (at desc);

-- =============================================================================
-- RLS
-- Leitura pública apenas do conteúdo publicado.
-- Escrita e leitura de leads/usuários/logs: somente service role ou usuário
-- autenticado presente em admin_users e ativo.
-- =============================================================================

alter table public.products      enable row level security;
alter table public.applications  enable row level security;
alter table public.articles      enable row level security;
alter table public.testimonials  enable row level security;
alter table public.faqs          enable row level security;
alter table public.leads         enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_users   enable row level security;
alter table public.audit_logs    enable row level security;

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users u
    where u.auth_uid = auth.uid() and u.active
  );
$$;

create or replace function public.has_admin_role(required text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users u
    where u.auth_uid = auth.uid() and u.active and u.role = any(required)
  );
$$;

-- Conteúdo publicado: leitura anônima
do $$
begin
  perform 1;
end $$;

create policy products_public_read on public.products
  for select using (status = 'published' or public.is_active_admin());

create policy applications_public_read on public.applications
  for select using (status = 'published' or public.is_active_admin());

create policy articles_public_read on public.articles
  for select using (status = 'published' or public.is_active_admin());

create policy testimonials_public_read on public.testimonials
  for select using (status = 'published' or public.is_active_admin());

create policy faqs_public_read on public.faqs
  for select using (status = 'published' or public.is_active_admin());

create policy settings_public_read on public.site_settings
  for select using (true);

-- Escrita de catálogo e conteúdo
create policy products_admin_write on public.products
  for all using (public.has_admin_role(array['administrador','gestor_comercial']))
  with check (public.has_admin_role(array['administrador','gestor_comercial']));

create policy applications_admin_write on public.applications
  for all using (public.has_admin_role(array['administrador','editor_conteudo']))
  with check (public.has_admin_role(array['administrador','editor_conteudo']));

create policy articles_admin_write on public.articles
  for all using (public.has_admin_role(array['administrador','editor_conteudo']))
  with check (public.has_admin_role(array['administrador','editor_conteudo']));

create policy testimonials_admin_write on public.testimonials
  for all using (public.has_admin_role(array['administrador','editor_conteudo']))
  with check (public.has_admin_role(array['administrador','editor_conteudo']));

create policy faqs_admin_write on public.faqs
  for all using (public.has_admin_role(array['administrador','editor_conteudo']))
  with check (public.has_admin_role(array['administrador','editor_conteudo']));

create policy settings_admin_write on public.site_settings
  for all using (public.has_admin_role(array['administrador']))
  with check (public.has_admin_role(array['administrador']));

-- Leads: nunca legíveis publicamente. A inserção ocorre pelo servidor
-- (service role), que ignora RLS.
create policy leads_admin_read on public.leads
  for select using (public.is_active_admin());

create policy leads_admin_write on public.leads
  for all using (public.is_active_admin())
  with check (public.is_active_admin());

create policy admin_users_self_read on public.admin_users
  for select using (auth_uid = auth.uid() or public.has_admin_role(array['administrador']));

create policy admin_users_admin_write on public.admin_users
  for all using (public.has_admin_role(array['administrador']))
  with check (public.has_admin_role(array['administrador']));

create policy audit_logs_admin_read on public.audit_logs
  for select using (public.has_admin_role(array['administrador']));

-- =============================================================================
-- Storage: bucket público para imagens de produto
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;
