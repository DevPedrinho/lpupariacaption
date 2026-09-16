-- -----------------------------------------------------------------------------
-- Storage: bucket público para fotos dos produtos
--
-- Público de propósito: a foto do computador é conteúdo do site, servida por
-- URL direta na página do produto e no catálogo. Quem grava é só o servidor,
-- com a chave de serviço (não há política de escrita para anon/authenticated).
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('produtos', 'produtos', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists produtos_public_read on storage.objects;
create policy produtos_public_read on storage.objects
  for select using (bucket_id = 'produtos');
