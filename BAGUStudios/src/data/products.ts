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
    youtubeVideoId: 'WyYJ-EBWdi0',
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
    youtubeVideoId: 'KOlFaHSh2_0',
    price: '14.99$',
    category: 'Unreal Engine Blueprint System',
    tags: ['Unreal Engine', 'Blueprint', 'Possession', 'Gameplay System', 'Interaction'],
    marketplaceUrl: 'https://www.fab.com/sellers/BAGU%20Studio',
    featured: true,
  },
  {
    id: 'multiplayer-atm-system-persistent-wallet-transaction-log',
    title: 'Multiplayer ATM System – Persistent Wallet & Transaction Log',
    shortDescription:
      'A Blueprint-based multiplayer ATM banking system with persistent wallets and transaction history.',
    longDescription:
      'The Multiplayer ATM System is a fully functional Blueprint-based banking solution designed for multiplayer projects. It provides players with their own persistent wallet, allowing them to deposit, withdraw, and manage money through an intuitive ATM interface.\n\nUnlike simple temporary currency systems, all wallet data remains stored and accessible even after players leave the ATM. When they return, their latest balance and complete transaction history are instantly available.\n\nThis system is designed to be easy to integrate, cleanly organized, and suitable for a wide range of multiplayer games.',
    image: '/images/atm-services-cover.png',
    youtubeVideoId: 'NkibKLA9KX4',
    price: 'Fab Marketplace',
    category: 'Unreal Engine Blueprint System',
    tags: ['Unreal Engine', 'Blueprint', 'Multiplayer', 'ATM System', 'Persistent Wallet'],
    marketplaceUrl: 'https://fab.com/s/e9bd0c2bc3fb',
    featured: true,
  },
];
