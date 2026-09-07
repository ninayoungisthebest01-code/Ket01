export interface Product {
  id: number
  name: string
  description: string
  category: string
  price: number
  oldPrice?: number
  image: string
  tag?: string
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Glow Ritual Set',
    description: 'Un ritual luminoso para comenzar y cerrar el día.',
    category: 'Skincare',
    price: 59.9,
    oldPrice: 74.9,
    image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=85',
    tag: 'Favorito',
  },
  {
    id: 2,
    name: 'Velvet Blush',
    description: 'Color modulable con acabado suave y aterciopelado.',
    category: 'Maquillaje',
    price: 34.9,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 3,
    name: 'Silk Hair Elixir',
    description: 'Aceite ligero para puntas suaves y brillantes.',
    category: 'Cabello',
    price: 42.9,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85',
    tag: 'Nuevo',
  },
  {
    id: 4,
    name: 'Eau de Victoria',
    description: 'Una fragancia floral, cálida y memorable.',
    category: 'Fragancias',
    price: 89.9,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=85',
  },
]

export const productById = new Map(PRODUCTS.map((product) => [product.id, product]))
