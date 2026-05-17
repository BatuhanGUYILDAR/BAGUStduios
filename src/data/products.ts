import type { Product } from '../types/Product';

export const products: Product[] = [
  {
    id: 'ghost-vision-system',
    title: 'Ghost Vision System',
    shortDescription:
      'A Blueprint-based ghost mode ability system for Unreal Engine 5.',
    longDescription:
      'A Blueprint-based ghost mode ability system for Unreal Engine 5. The player can leave the body, move freely for a short time, and return with cooldown-based gameplay. Built for single-player games that need a polished supernatural exploration mechanic with readable state handling and designer-friendly tuning.',
    image: '/images/ghost-vision.jpg',
    video: '/videos/ghost-vision-demo.mp4',
    price: '9.99$',
    category: 'Unreal Engine Blueprint System',
    tags: ['Unreal Engine', 'Blueprint', 'Ghost Mode', 'Ability System', 'Single Player'],
    marketplaceUrl: 'https://www.fab.com/sellers/BAGU%20Studio',
    featured: true,
  },
  {
    id: 'soul-shift-possession-system',
    title: 'Soul Shift - Possession System',
    shortDescription:
      'A Blueprint-based possession system for Unreal Engine 5.',
    longDescription:
      'A Blueprint-based possession system for Unreal Engine 5. The player can enter soul mode, target possessable actors, and take control of different characters, pawns, or actors. Designed for interaction-heavy gameplay, puzzle systems, and character-switching mechanics.',
    image: '/images/soul-shift.jpg',
    video: '/videos/soul-shift-demo.mp4',
    price: '14.99$',
    category: 'Unreal Engine Blueprint System',
    tags: ['Unreal Engine', 'Blueprint', 'Possession', 'Gameplay System', 'Interaction'],
    marketplaceUrl: 'https://www.fab.com/sellers/BAGU%20Studio',
    featured: true,
  },
];
