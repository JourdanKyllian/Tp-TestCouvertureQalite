export const BASE_FEE = 2.00;
export const MAX_DISTANCE = 10;

export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  expiresAt: string;
}

/**
 * calculateDeliveryFee
 * @param distance 
 * @param weight 
 * @returns 
 */
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

/**
 * applyPromoCode
 * @param subtotal 
 * @param promoCode 
 * @param promoCodes 
 * @returns 
 */
export function applyPromoCode(subtotal: number, promoCode: string, promoCodes: PromoCode[], now: Date = new Date()): number {
    if (subtotal < 0) {throw new Error('Le sous-total ne peut pas être négatif');}
    const promo = promoCodes.find((p) => p.code === promoCode);
    if (!promo) { throw new Error('Code inconnu'); }

    const expiryDate = new Date(promo.expiresAt);
    if (now > expiryDate) {
        throw new Error('Promo expirée');
    }
    if (promo.minOrder > subtotal) {
        throw new Error('Promo non applicable');
    }

    let finalTotal = subtotal;
    if (promo.type === 'percentage') {
        finalTotal = subtotal * (1 - promo.value / 100);
    }
    if (promo.type === 'fixed') {
        finalTotal = subtotal - promo.value;
    }

    return Math.max(0, finalTotal);
}

export type DayOfWeek = 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi' | 'Dimanche';

/**
 * calculateSurge
 * @param hour
 * @param dayOfWeek
 */
export function calculateSurge(hour: number, dayOfWeek: DayOfWeek): number {
    if (hour < 10 || hour > 22) {
        return 0;
    }
    if (dayOfWeek === 'Dimanche') {
        return 1.2;
    }

    const isWeekDay = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi'].includes(dayOfWeek);
    const isWeekEndDay = ['Vendredi', 'Samedi'].includes(dayOfWeek);

    if (isWeekDay) {
        if (hour >= 10 && hour <= 11.5 || hour >= 14 && hour <= 18) {return 1.0;}
        if (hour >= 12 && hour <= 13.5) {return 1.3;}
        if (hour >= 19 && hour <= 21) {return 1.5;}
    }
    if (isWeekEndDay) {
        if (hour >= 19 && hour <= 22) {return 1.8;}
    }

    return 1.0;
}

export const PROMO_CODES: PromoCode[] = [
    {
        code: "BIENVENUE20",
        type: "percentage",
        value: 20,
        minOrder: 15.00,
        expiresAt: "2026-12-31"
    },
    {
        code: "EXPIRE", // Ajout du code pour le test
        type: "percentage",
        value: 10,
        minOrder: 0,
        expiresAt: "2020-01-01" // Date passée
    },
    {
        code: "MINI20", // On ajoute ce code pour que l'API le connaisse !
        type: "fixed",
        value: 5,
        minOrder: 20,
        expiresAt: "2026-12-31"
    }
];

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface OrderTotal {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  surge: number;
  total: number;
}

/**
 * calculateOrderTotal
 * @param items 
 * @param distance 
 * @param weight 
 * @param promoCode 
 * @param hour 
 * @param dayOfWeek 
 * @returns 
 */
export function calculateOrderTotal(items: OrderItem[], distance: number, weight: number, promoCode: string | null, hour: number, dayOfWeek: DayOfWeek): OrderTotal {
    if (!items || items.length === 0) {
        throw new Error('Panier vide');
    }
    const subtotal = items.reduce((total, item) => {
        if (item.price < 0) {
            throw new Error('Prix négatif');
        }
        if (item.quantity <= 0) {
            throw new Error('Quantité invalide');
        }
        return total + item.price * item.quantity;
    }, 0);

    let discount = 0;
    if (promoCode) {
        const totalAfterPromo = applyPromoCode(subtotal, promoCode, PROMO_CODES);
        discount = subtotal - totalAfterPromo;
    }

    const deliveryFee = calculateDeliveryFee(distance, weight);
    if (deliveryFee === null) {
        throw new Error('Hors zone de livraison');
    }

    const surge = calculateSurge(hour, dayOfWeek);
    if (surge === 0) {
        throw new Error('Boutique fermée');
    }
    
    
    const total = (subtotal - discount) + deliveryFee * surge;

    return { 
        subtotal: Math.round(subtotal * 100) / 100, 
        discount: Math.round(discount * 100) / 100, 
        deliveryFee: Math.round(deliveryFee * 100) / 100, 
        surge, 
        total: Math.round(total * 100) / 100 
    };
}
