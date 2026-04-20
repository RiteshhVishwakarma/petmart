/**
 * Offer Calculation Utilities
 * 
 * Admin sirf MRP aur Selling Price dalega
 * Ye functions automatically calculate karenge:
 * - Discount amount
 * - Discount percentage
 * - Savings
 */

export interface OfferDetails {
  mrp: number;              // Original price
  sellingPrice: number;     // Final price
  discount: number;         // Discount amount (₹)
  discountPercent: number;  // Discount percentage (%)
  savings: number;          // Amount saved (₹)
  hasOffer: boolean;        // Is there an active offer?
}

/**
 * Calculate offer details from MRP and Selling Price
 */
export const calculateOffer = (mrp: number, sellingPrice: number): OfferDetails => {
  // Validate inputs
  if (mrp <= 0 || sellingPrice <= 0) {
    return {
      mrp: sellingPrice,
      sellingPrice,
      discount: 0,
      discountPercent: 0,
      savings: 0,
      hasOffer: false,
    };
  }

  // If selling price >= MRP, no offer
  if (sellingPrice >= mrp) {
    return {
      mrp,
      sellingPrice,
      discount: 0,
      discountPercent: 0,
      savings: 0,
      hasOffer: false,
    };
  }

  // Calculate discount
  const discount = mrp - sellingPrice;
  const discountPercent = Math.round((discount / mrp) * 100);
  const savings = discount;

  return {
    mrp,
    sellingPrice,
    discount,
    discountPercent,
    savings,
    hasOffer: true,
  };
};

/**
 * Get discount percentage from MRP and Selling Price
 */
export const getDiscountPercent = (mrp: number, sellingPrice: number): number => {
  if (mrp <= 0 || sellingPrice >= mrp) return 0;
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
};

/**
 * Get discount amount from MRP and Selling Price
 */
export const getDiscountAmount = (mrp: number, sellingPrice: number): number => {
  if (mrp <= 0 || sellingPrice >= mrp) return 0;
  return mrp - sellingPrice;
};

/**
 * Check if product has an active offer
 */
export const hasActiveOffer = (mrp?: number, sellingPrice?: number): boolean => {
  if (!mrp || !sellingPrice) return false;
  return sellingPrice < mrp;
};

/**
 * Format offer badge text (e.g., "20% OFF")
 */
export const getOfferBadgeText = (mrp: number, sellingPrice: number): string | null => {
  const percent = getDiscountPercent(mrp, sellingPrice);
  if (percent === 0) return null;
  return `${percent}% OFF`;
};
