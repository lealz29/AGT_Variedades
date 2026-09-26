// Configurações centrais da loja.
// Altere aqui se o WhatsApp, Instagram ou nome da loja mudar no futuro.
export const storeConfig = {
  name: 'AGT Variedades',
  tagline: 'Moda, beleza e muito mais para você.',
  whatsappNumber: '5511966629120', // com código do país (55) e DDD, sem espaços/traços
  instagramHandle: '@agt_variedades',
  instagramUrl: 'https://www.instagram.com/agt_variedades/',
  primaryColor: '#D473BF',
}

export const categories = [
  {
    slug: 'feminino',
    label: 'Feminino',
    icon: '👗',
    subcategories: ['Blusas', 'Camisetas', 'Calças', 'Shorts', 'Saias', 'Vestidos', 'Conjuntos', 'Jaquetas', 'Moletons', 'Outros'],
  },
  {
    slug: 'masculino',
    label: 'Masculino',
    icon: '👔',
    subcategories: ['Camisetas', 'Camisas', 'Calças', 'Bermudas', 'Jaquetas', 'Moletons', 'Conjuntos', 'Outros'],
  },
  {
    slug: 'cosmeticos',
    label: 'Cosméticos',
    icon: '✨',
    subcategories: ['Perfumes', 'Hidratantes', 'Body Splash', 'Desodorantes', 'Cremes', 'Produtos para cabelo', 'Maquiagem', 'Kits', 'Outros'],
  },
]

export const clothingSizes = ['PP', 'P', 'M', 'G', 'GG', 'XG']
