-- ============================================================
-- AGT VARIEDADES — Schema do banco de dados
-- Execute este arquivo no SQL Editor do Supabase (Project > SQL Editor)
-- ============================================================

-- Extensão para gerar UUIDs
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tabela: products
-- ------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null check (category in ('feminino', 'masculino', 'cosmeticos')),
  subcategory text,
  description text,
  price numeric(10,2) not null default 0,
  promotional_price numeric(10,2),
  main_image text,
  images text[] default '{}',
  available boolean not null default true,
  featured boolean not null default false,
  promotion boolean not null default false,
  brand text,
  type text,
  volume text,
  fragrance text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on products (category);
create index if not exists idx_products_subcategory on products (subcategory);
create index if not exists idx_products_available on products (available);
create index if not exists idx_products_featured on products (featured);
create index if not exists idx_products_slug on products (slug);

-- ------------------------------------------------------------
-- Tabela: product_variants (cor + tamanho + estoque)
-- ------------------------------------------------------------
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  color text,
  size text,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_variants_product_id on product_variants (product_id);

-- Mantém "updated_at" sempre atualizado
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table products enable row level security;
alter table product_variants enable row level security;

-- Qualquer pessoa (inclusive visitantes não logados) pode LER os produtos.
-- Isso é necessário para o catálogo público funcionar.
drop policy if exists "Leitura pública de produtos" on products;
create policy "Leitura pública de produtos"
  on products for select
  to anon, authenticated
  using (true);

drop policy if exists "Leitura pública de variantes" on product_variants;
create policy "Leitura pública de variantes"
  on product_variants for select
  to anon, authenticated
  using (true);

-- Somente usuários AUTENTICADOS (o admin, que faz login em /admin)
-- podem criar, editar ou excluir produtos e variantes.
drop policy if exists "Admin gerencia produtos" on products;
create policy "Admin gerencia produtos"
  on products for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin gerencia variantes" on product_variants;
create policy "Admin gerencia variantes"
  on product_variants for all
  to authenticated
  using (true)
  with check (true);
