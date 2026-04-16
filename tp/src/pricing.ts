export const BASE_FEE = 2.00;
export const MAX_DISTANCE = 10;

export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  expiresAt: string;
}

export function calculateDeliveryFee(distance: number, weight: number): number | null {
    if(distance < 0 || weight < 0) {
        throw new Error('Distance or weight cannot be negative');
    }
    if(distance > MAX_DISTANCE) {
        return null;
    }

    let fee = 2.00;

    if(distance > 3) {
        fee += (distance - 3) * 0.50;
    }
    if(weight > 5) {
        fee += 1.50;
    }

    return fee;
}

export function applyPromoCode(subtotal: number, promoCode: string, promoCodes: PromoCode[]): number {
    const promo = promoCodes.find((p) => p.code === promoCode);
    if (!promo) { throw new Error('Code inconnu'); }

    const now = new Date();
    const expiryDate = new Date(promo.expiresAt);

    if (!promo) {throw new Error('Code inconnu');}
    let finalTotal = subtotal;

    if (now > expiryDate) {
        throw new Error('Promo expirée');
    }
    if (promo.minOrder > subtotal) {
        throw new Error('Promo non applicable');
    }
    if (promo.type === 'percentage') {
        finalTotal = subtotal * (1 - promo.value / 100);
    }
    if (promo.type === 'fixed') {
        finalTotal = subtotal - promo.value;
    }

    return finalTotal;
}