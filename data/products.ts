import { Product, Category } from '../types';

export const categories: Category[] = [
  { id: 'all',   name: 'All',    icon: '🐾' },
  { id: 'dog',   name: 'Dogs',   icon: '🐶' },
  { id: 'cat',   name: 'Cats',   icon: '🐱' },
  { id: 'bird',  name: 'Birds',  icon: '🐦' },
  { id: 'fish',  name: 'Fish',   icon: '🐟' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Royal Canin Dog Food',
    price: 2999,
    image: 'https://placedog.net/400/300?id=1',
    description: 'Premium dry food for adult dogs. Supports digestion and healthy skin.',
    category: 'dog',
  },
  {
    id: '2',
    name: 'Dog Leash & Collar Set',
    price: 1299,
    image: 'https://placedog.net/400/300?id=5',
    description: 'Adjustable nylon collar and matching 6ft leash.',
    category: 'dog',
  },
  {
    id: '3',
    name: 'Cat Scratching Post',
    price: 1499,
    image: 'https://placekitten.com/400/300',
    description: 'Durable sisal scratching post to keep your cat entertained.',
    category: 'cat',
  },
  {
    id: '4',
    name: 'Cat Wet Food Pack',
    price: 999,
    image: 'https://placekitten.com/401/300',
    description: 'Pack of 12 gourmet wet food pouches for adult cats.',
    category: 'cat',
  },
  {
    id: '5',
    name: 'Bird Cage Deluxe',
    price: 4999,
    image: 'https://picsum.photos/seed/birdcage/400/300',
    description: 'Spacious cage with multiple perches and feeding stations.',
    category: 'bird',
  },
  {
    id: '6',
    name: 'Aquarium Starter Kit',
    price: 8999,
    image: 'https://picsum.photos/seed/aquarium/400/300',
    description: '20-gallon tank with filter, heater, and LED lighting.',
    category: 'fish',
  },
];
