import {
  applyPromoCode,
  calculateDeliveryFee,
  calculateOrderTotal,
  calculateSurge,
  PromoCode,
} from './pricing';

/**
 * calculateDeliveryFee(distance: number, weight: number)
 */
describe('calculateDeliveryFee', () => {
  it('should return 2.00 for a distance <= 3km and weight <= 5kg', () => {
    expect(calculateDeliveryFee(2, 1)).toBe(2.0);
  });
  it('should not add supplement for exactly 3km', () => {
    expect(calculateDeliveryFee(3, 1)).toBe(2.0);
  });
  it('should not add weight supplement for exactly 5kg', () => {
    expect(calculateDeliveryFee(2, 5)).toBe(2.0);
  });
  it('should add 1.50€ supplement when weight is greater than 5kg', () => {
    expect(calculateDeliveryFee(2, 8)).toBe(3.5);
  });
  it('should add 0.50€ per km for distance between 3km and 10km', () => {
    expect(calculateDeliveryFee(7, 2)).toBe(4.0);
  });
  it('should accept exactly 10km', () => {
    expect(calculateDeliveryFee(10, 1)).toBe(5.5);
  });
  it('should return null if distance is greater than 10km', () => {
    expect(calculateDeliveryFee(15, 2)).toBeNull();
  });
  it('should throw error if distance or weight is negative', () => {
    expect(() => calculateDeliveryFee(-1, 5)).toThrow();
    expect(() => calculateDeliveryFee(5, -1)).toThrow();
  });
  it('should return 2.00 when distance is 0', () => {
    expect(calculateDeliveryFee(0, 1)).toBe(2.0);
  });
  it('should calculate correctly for 7km and 3kg', () => {
    expect(calculateDeliveryFee(7, 3)).toBe(4.0);
  });
  it('should calculate correctly for 6km and 2kg', () => {
    expect(calculateDeliveryFee(6, 2)).toBe(3.5);
  });
  it('should calculate correctly for 10km and 6kg', () => {
    expect(calculateDeliveryFee(10, 6)).toBe(7.0);
  });
});

/**
 * applyPromoCode(subtotal: number, promoCode: string, promoCodes: PromoCode[])
 */
describe('applyPromoCode', () => {
  const mockPromos: PromoCode[] = [
    {
      code: 'BIENVENUE20',
      type: 'percentage',
      value: 20,
      minOrder: 15,
      expiresAt: '2026-12-31',
    },
    {
      code: 'REDUC5',
      type: 'fixed',
      value: 5,
      minOrder: 0,
      expiresAt: '2026-12-31',
    },
    {
      code: 'EXPIRE',
      type: 'percentage',
      value: 10,
      minOrder: 0,
      expiresAt: '2020-01-01',
    },
    {
      code: 'MINI20',
      type: 'fixed',
      value: 5,
      minOrder: 20,
      expiresAt: '2026-12-31',
    },
    {
      code: 'REDUC50',
      type: 'fixed',
      value: 50,
      minOrder: 0,
      expiresAt: '2026-12-31',
    },
    {
      code: 'GRATUIT',
      type: 'percentage',
      value: 100,
      minOrder: 0,
      expiresAt: '2026-12-31',
    },
  ];
  it('should throw an error for an unknown promo code', () => {
    expect(() => applyPromoCode(50, 'CODE_INEXISTANT', [])).toThrow(
      'Code inconnu',
    );
  });
  it('should apply a 20% discount on a 50€ order', () => {
    expect(applyPromoCode(50, 'BIENVENUE20', mockPromos)).toBe(40);
  });
  it('should apply a fixed discount of 5€ on a 30€ order', () => {
    expect(applyPromoCode(30, 'REDUC5', mockPromos)).toBe(25);
  });
  it('should refuse the code if subtotal is below minOrder', () => {
    expect(() => applyPromoCode(15, 'MINI20', mockPromos)).toThrow();
  });
  it('should throw an error if the promo code is expired', () => {
    expect(() => applyPromoCode(100, 'EXPIRE', mockPromos)).toThrow(
      'Promo expirée',
    );
  });
  it('should not return a negative total if the discount exceeds the subtotal', () => {
    expect(applyPromoCode(30, 'REDUC50', mockPromos)).toBe(0);
  });
  it('should return 0€ for a 100% discount', () => {
    expect(applyPromoCode(50, 'GRATUIT', mockPromos)).toBe(0);
  });
  it('should accept the code if subtotal is exactly minOrder', () => {
    expect(applyPromoCode(20, 'MINI20', mockPromos)).toBe(15);
  });
  it('should return 0 if subtotal is 0', () => {
    expect(applyPromoCode(0, 'REDUC5', mockPromos)).toBe(0);
  });
  it('should throw an error if subtotal is negative', () => {
    expect(() => applyPromoCode(-10, 'BIENVENUE20', [])).toThrow();
  });
});

describe('calculateSurge', () => {
  it('should return 0 when the shop is closed (before 10h)', () => {
    expect(calculateSurge(9.5, 'Lundi')).toBe(0);
  });
  it('should return 0 when the shop is closed (after 22h)', () => {
    expect(calculateSurge(22.5, 'Mardi')).toBe(0);
  });
  it('should return 1.2 for Sunday all day (e.g., 14h)', () => {
    expect(calculateSurge(14, 'Dimanche')).toBe(1.2);
  });
  it('should return 1.0 for breakfast surge (Tuesday 15h00)', () => {
    expect(calculateSurge(15, 'Mardi')).toBe(1.0);
  });
  it('should return 1.3 for lunch surge (Wednesday 12h30)', () => {
    expect(calculateSurge(12.5, 'Mercredi')).toBe(1.3);
  });
  it('should return 1.5 for dinner surge (Thursday 20h00)', () => {
    expect(calculateSurge(20, 'Jeudi')).toBe(1.5);
  });
  it('should return 1.8 for Friday 21h00', () => {
    expect(calculateSurge(21, 'Vendredi')).toBe(1.8);
  });
  it('should be closed exactly at 22h01', () => {
    expect(calculateSurge(22.01, 'Lundi')).toBe(0);
  });
  it('should be closed exactly at 9h59', () => {
    expect(calculateSurge(9.99, 'Lundi')).toBe(0);
  });
  it('should be open exactly at 10h00', () => {
    expect(calculateSurge(10, 'Lundi')).toBe(1.0);
  });
  it('should be open exactly at 22h00', () => {
    expect(calculateSurge(22, 'Lundi')).toBe(1.0);
  });
  it('should the price still be normal or is it already lunchtime', () => {
    expect(calculateSurge(11.5, 'Lundi')).toBe(1.0);
  });
});

describe(calculateOrderTotal, () => {
  const items = [{ name: 'Pizza', price: 12.5, quantity: 2 }];

  it('should calculate the correct total for a simple order (25€ + 5km + Tuesday 15h)', () => {
    const result = calculateOrderTotal(items, 5, 1, null, 15, 'Mardi');

    expect(result).toEqual({
      subtotal: 25.0,
      discount: 0,
      deliveryFee: 3.0,
      surge: 1.0,
      total: 28.0,
    });
  });
  it('should apply a 20% discount when a valid promo code is provided', () => {
    const result = calculateOrderTotal(items, 5, 1, 'BIENVENUE20', 15, 'Mardi');

    expect(result.discount).toBe(5.0);
    expect(result.total).toBe(23.0);
  });
  it('should throw an error if an item has a negative price', () => {
    const itemsWithBug = [{ name: 'Pizza Bug', price: -10, quantity: 1 }];
    expect(() =>
      calculateOrderTotal(itemsWithBug, 5, 1, null, 15, 'Mardi'),
    ).toThrow('Prix négatif');
  });
  it('should throw an error if the cart is empty', () => {
    expect(() => calculateOrderTotal([], 5, 1, null, 15, 'Mardi')).toThrow(
      'Panier vide',
    );
  });
  it('should throw an error if an item has a quantity of 0 or less', () => {
    const itemsWithZero = [{ name: 'Pizza Fantôme', price: 12.5, quantity: 0 }];
    expect(() =>
      calculateOrderTotal(itemsWithZero, 5, 1, null, 15, 'Mardi'),
    ).toThrow('Quantité invalide');
  });
  it('should throw an error if the shop is closed (e.g., 23h)', () => {
    expect(() => calculateOrderTotal(items, 5, 1, null, 23, 'Lundi')).toThrow(
      'Boutique fermée',
    );
  });
  it('should throw an error if the delivery distance is out of bounds (e.g., 15km)', () => {
    expect(() => calculateOrderTotal(items, 15, 1, null, 15, 'Lundi')).toThrow(
      'Hors zone de livraison',
    );
  });
  it('should apply the weekend surge multiplier (1.8) on delivery fee', () => {
    const result = calculateOrderTotal(items, 5, 1, null, 20, 'Vendredi');

    expect(result.surge).toBe(1.8);
    expect(result.deliveryFee).toBe(3.0);
    expect(result.total).toBe(30.4);
  });
  it('should round all values to 2 decimal places', () => {
    const complexItems = [{ name: 'Pizza Gourmet', price: 12.57, quantity: 1 }];
    const result = calculateOrderTotal(
      complexItems,
      5.5,
      1,
      null,
      12.5,
      'Mardi',
    );

    expect(result.total).toBe(16.8);
    expect(result.subtotal).toBe(12.57);
    expect(result.deliveryFee).toBe(3.25);
  });
  it('should apply surge only to delivery fee, not to subtotal', () => {
    const simpleItem = [{ name: 'Pizza Test', price: 10.0, quantity: 1 }];
    const result = calculateOrderTotal(simpleItem, 2, 1, null, 14, 'Dimanche');

    expect(result.total).toBe(12.4);
    expect(result.subtotal).toBe(10.0);
  });
  it('should apply the lunch rush multiplier (1.3) correctly on Tuesday 12h30', () => {
    const result = calculateOrderTotal(items, 5, 1, null, 12.5, 'Mardi');

    expect(result.surge).toBe(1.3);
    expect(result.deliveryFee).toBe(3.0);
    expect(result.total).toBe(28.9);
  });
});
