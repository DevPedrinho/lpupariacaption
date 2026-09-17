-- -----------------------------------------------------------------------------
-- Storage: bucket público para imagens dos conteúdos (artigos)
--
-- Mesmo desenho do bucket `produtos`: leitura pública por URL direta, escrita
-- só pelo servidor com a chave de serviço.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('conteudos', 'conteudos', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists conteudos_public_read on storage.objects;
create policy conteudos_public_read on storage.objects
  for select using (bucket_id = 'conteudos');
