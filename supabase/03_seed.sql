-- ============================================================
-- AGT VARIEDADES — Dados de demonstração (15 produtos fictícios)
-- Execute por último, depois do schema e do storage.
-- As fotos abaixo são apenas placeholders (picsum.photos) — substitua
-- pelas fotos reais no painel administrativo (/admin) quando quiser.
-- ============================================================

-- FEMININO
insert into products (name, slug, category, subcategory, description, price, promotional_price, promotion, featured, available, main_image)
values
  ('Vestido Midi Floral', 'vestido-midi-floral', 'feminino', 'Vestidos', 'Vestido midi leve, estampa floral, ideal para o dia a dia.', 129.90, 99.90, true, true, true, 'https://picsum.photos/seed/vestido1/600/750'),
  ('Blusa Cropped Canelada', 'blusa-cropped-canelada', 'feminino', 'Blusas', 'Blusa cropped em tecido canelado, caimento justo.', 49.90, null, false, false, true, 'https://picsum.photos/seed/blusa1/600/750'),
  ('Calça Wide Leg', 'calca-wide-leg', 'feminino', 'Calças', 'Calça pantalona de cintura alta, tecido fluido.', 119.90, null, false, true, true, 'https://picsum.photos/seed/calca1/600/750'),
  ('Conjunto Moletom Feminino', 'conjunto-moletom-feminino', 'feminino', 'Conjuntos', 'Conjunto de moletom, blusa + calça, super confortável.', 159.90, 139.90, true, false, true, 'https://picsum.photos/seed/conjunto1/600/750'),
  ('Jaqueta Jeans Feminina', 'jaqueta-jeans-feminina', 'feminino', 'Jaquetas', 'Jaqueta jeans clássica, forro leve.', 149.90, null, false, false, false, 'https://picsum.photos/seed/jaqueta1/600/750')
on conflict (slug) do nothing;

-- MASCULINO
insert into products (name, slug, category, subcategory, description, price, promotional_price, promotion, featured, available, main_image)
values
  ('Camiseta Oversized', 'camiseta-oversized', 'masculino', 'Camisetas', 'Camiseta 100% algodão, modelagem oversized.', 79.90, null, false, true, true, 'https://picsum.photos/seed/camiseta1/600/750'),
  ('Calça Jogger Masculina', 'calca-jogger-masculina', 'masculino', 'Calças', 'Calça jogger com punho, ótima para o dia a dia.', 109.90, 89.90, true, false, true, 'https://picsum.photos/seed/jogger1/600/750'),
  ('Bermuda Sarja', 'bermuda-sarja', 'masculino', 'Bermudas', 'Bermuda de sarja, bolsos laterais.', 69.90, null, false, false, true, 'https://picsum.photos/seed/bermuda1/600/750'),
  ('Camisa Social Slim', 'camisa-social-slim', 'masculino', 'Camisas', 'Camisa social de corte slim, tecido de fácil manutenção.', 99.90, null, false, false, true, 'https://picsum.photos/seed/camisa1/600/750'),
  ('Moletom Canguru Masculino', 'moletom-canguru-masculino', 'masculino', 'Moletons', 'Moletom com capuz e bolso canguru.', 129.90, null, false, true, true, 'https://picsum.photos/seed/moletom1/600/750')
on conflict (slug) do nothing;

-- COSMÉTICOS
insert into products (name, slug, category, subcategory, description, price, promotional_price, promotion, featured, available, main_image, brand, type, volume, fragrance)
values
  ('Perfume Floral Elegance', 'perfume-floral-elegance', 'cosmeticos', 'Perfumes', 'Perfume floral marcante, fixação prolongada.', 89.90, null, false, true, true, 'https://picsum.photos/seed/perfume1/600/750', 'AGT Beauty', 'Eau de Parfum', '100ml', 'Floral'),
  ('Hidratante Corporal Hidra+', 'hidratante-corporal-hidra', 'cosmeticos', 'Hidratantes', 'Hidratante corporal de alta absorção.', 34.90, null, false, false, true, 'https://picsum.photos/seed/hidratante1/600/750', 'AGT Beauty', 'Hidratante', '400ml', null),
  ('Body Splash Doce Encanto', 'body-splash-doce-encanto', 'cosmeticos', 'Body Splash', 'Body splash refrescante de longa duração.', 39.90, 29.90, true, true, true, 'https://picsum.photos/seed/bodysplash1/600/750', 'AGT Beauty', 'Body Splash', '200ml', 'Doce'),
  ('Kit Skincare Facial', 'kit-skincare-facial', 'cosmeticos', 'Kits', 'Kit completo com sabonete, tônico e hidratante facial.', 119.90, null, false, false, true, 'https://picsum.photos/seed/kit1/600/750', 'AGT Beauty', 'Kit', null, null),
  ('Creme para Mãos e Unhas', 'creme-para-maos-e-unhas', 'cosmeticos', 'Cremes', 'Creme nutritivo para mãos e unhas.', 24.90, null, false, false, false, 'https://picsum.photos/seed/creme1/600/750', 'AGT Beauty', 'Creme', '60ml', null)
on conflict (slug) do nothing;

-- Variantes (cor/tamanho/estoque) para os produtos de roupa
insert into product_variants (product_id, color, size, stock)
select id, color, size, stock from (
  values
    ('vestido-midi-floral', 'Rosa', 'P', 4),
    ('vestido-midi-floral', 'Rosa', 'M', 6),
    ('vestido-midi-floral', 'Rosa', 'G', 2),
    ('vestido-midi-floral', 'Preto', 'M', 3),
    ('blusa-cropped-canelada', 'Branco', 'P', 5),
    ('blusa-cropped-canelada', 'Branco', 'M', 5),
    ('blusa-cropped-canelada', 'Preto', 'P', 4),
    ('calca-wide-leg', 'Bege', 'M', 3),
    ('calca-wide-leg', 'Bege', 'G', 2),
    ('calca-wide-leg', 'Preto', 'M', 4),
    ('conjunto-moletom-feminino', 'Cinza', 'M', 3),
    ('conjunto-moletom-feminino', 'Cinza', 'G', 1),
    ('jaqueta-jeans-feminina', 'Azul', 'M', 0),
    ('camiseta-oversized', 'Preto', 'M', 8),
    ('camiseta-oversized', 'Preto', 'G', 5),
    ('camiseta-oversized', 'Branco', 'M', 6),
    ('calca-jogger-masculina', 'Preto', 'M', 4),
    ('calca-jogger-masculina', 'Cinza', 'G', 3),
    ('bermuda-sarja', 'Bege', 'M', 5),
    ('bermuda-sarja', 'Verde-militar', 'G', 2),
    ('camisa-social-slim', 'Branco', 'M', 4),
    ('camisa-social-slim', 'Azul-marinho', 'G', 3),
    ('moletom-canguru-masculino', 'Cinza', 'M', 6),
    ('moletom-canguru-masculino', 'Preto', 'GG', 1)
) as v(slug, color, size, stock)
join products on products.slug = v.slug;
