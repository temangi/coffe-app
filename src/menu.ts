import type { Category, Product } from './types';

export const MENU_CATEGORIES: Category[] = ['Coffee', 'Tea', 'Desserts'];

export const MENU_ITEMS: Product[] = [
  {
    id: 'm1',
    name: 'Капучино “Signature”',
    description: 'Эспрессо, бархатистое молоко, тонкая пенка. Подаём в прогретой чашке.',
    category: 'Coffee',
    price: 390,
    options: [
      { id: '250', grams: 250, price: 390 },
      { id: '160', grams: 160, price: 270 },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'm2',
    name: 'Латте с ванилью',
    description: 'Мягкий кофе, тёплая ваниль и сливочное молоко. Идеален для неспешного утра.',
    category: 'Coffee',
    price: 390,
    options: [
      { id: '250', grams: 250, price: 390 },
      { id: '160', grams: 160, price: 270 },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'm3',
    name: 'Матча латте',
    description: 'Японская матча, молоко и лёгкая сладость. Чистый вкус и мягкая энергия.',
    category: 'Tea',
    price: 390,
    options: [
      { id: '250', grams: 250, price: 390 },
      { id: '160', grams: 160, price: 270 },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1542444459-db47a8a9d8dd?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'm4',
    name: 'Чизкейк Нью-Йорк',
    description: 'Нежная классика на тонком песочном корже. Подаём с лёгким соусом.',
    category: 'Desserts',
    price: 390,
    options: [
      { id: '250', grams: 250, price: 390 },
      { id: '160', grams: 160, price: 270 },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'm5',
    name: 'Флэт уайт',
    description: 'Насыщенный двойной эспрессо и тонкий слой микропены — чистый баланс.',
    category: 'Coffee',
    price: 390,
    options: [
      { id: '250', grams: 250, price: 390 },
      { id: '160', grams: 160, price: 270 },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80',
  },
];

