import { Product } from '../types';

export type SortOption = 'popularity' | 'priceLowToHigh' | 'priceHighToLow' | 'rating' | 'newest';
export type PriceRange = 'all' | '0-500' | '500-1000' | '1000-2000' | '2000+';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'priceLowToHigh', label: 'Price: Low to High' },
  { value: 'priceHighToLow', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
];

export const PRICE_RANGES: { value: PriceRange; label: string }[] = [
  { value: 'all', label: 'All Prices' },
  { value: '0-500', label: 'Under ₹500' },
  { value: '500-1000', label: '₹500 - ₹1000' },
  { value: '1000-2000', label: '₹1000 - ₹2000' },
  { value: '2000+', label: 'Above ₹2000' },
];

/**
 * Filter products by price range
 */
export function filterByPriceRange(products: Product[], range: PriceRange): Product[] {
  if (range === 'all') return products;

  return products.filter((product) => {
    const price = product.price;
    switch (range) {
      case '0-500':
        return price < 500;
      case '500-1000':
        return price >= 500 && price < 1000;
      case '1000-2000':
        return price >= 1000 && price < 2000;
      case '2000+':
        return price >= 2000;
      default:
        return true;
    }
  });
}

/**
 * Sort products by selected option
 */
export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'priceLowToHigh':
      return sorted.sort((a, b) => a.price - b.price);

    case 'priceHighToLow':
      return sorted.sort((a, b) => b.price - a.price);

    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    case 'popularity':
      return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));

    case 'newest':
      // For now, reverse order (assuming newer products are added last)
      return sorted.reverse();

    default:
      return sorted;
  }
}

/**
 * Apply both filter and sort
 */
export function filterAndSortProducts(
  products: Product[],
  priceRange: PriceRange,
  sortBy: SortOption
): Product[] {
  const filtered = filterByPriceRange(products, priceRange);
  return sortProducts(filtered, sortBy);
}
