-- ============================================================
-- AGT VARIEDADES — Configuração do Storage (fotos dos produtos)
-- Execute depois do 01_schema.sql
-- ============================================================

-- Cria o bucket público "product-images" (se ainda não existir).
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Qualquer pessoa pode VISUALIZAR as fotos (necessário para o catálogo público).
drop policy if exists "Leitura pública das fotos" on storage.objects;
create policy "Leitura pública das fotos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- Somente o admin autenticado pode enviar, substituir ou excluir fotos.
drop policy if exists "Admin envia fotos" on storage.objects;
create policy "Admin envia fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Admin atualiza fotos" on storage.objects;
create policy "Admin atualiza fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Admin exclui fotos" on storage.objects;
create policy "Admin exclui fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
