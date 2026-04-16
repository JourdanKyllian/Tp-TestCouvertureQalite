import { applyPromoCode, calculateDeliveryFee, calculateSurge, PromoCode } from './pricing';

/**
 * calculateDeliveryFee(distance: number, weight: number)
 */
describe('calculateDeliveryFee', () => {
    it('should return 2.00 for a distance <= 3km and weight <= 5kg', () => {
        expect(calculateDeliveryFee(2, 1)).toBe(2.00);
    });
    it('should not add supplement for exactly 3km', () => {
        expect(calculateDeliveryFee(3, 1)).toBe(2.00);
    });
    it('should not add weight supplement for exactly 5kg', () => {
        expect(calculateDeliveryFee(2, 5)).toBe(2.00);
    });
    it('should add 1.50€ supplement when weight is greater than 5kg', () => {
        expect(calculateDeliveryFee(2, 8)).toBe(3.50);
    });
    it('should add 0.50€ per km for distance between 3km and 10km', () => {
        expect(calculateDeliveryFee(7, 2)).toBe(4.00);
    });
    it('should accept exactly 10km', () => {
        expect(calculateDeliveryFee(10, 1)).toBe(5.50);
    });
    it('should return null if distance is greater than 10km', () => {
        expect(calculateDeliveryFee(15, 2)).toBeNull();
    });
    it('should throw error if distance or weight is negative', () => {
        expect(() => calculateDeliveryFee(-1, 5)).toThrow();
        expect(() => calculateDeliveryFee(5, -1)).toThrow();
    });
    it('should return 2.00 when distance is 0', () => {
        expect(calculateDeliveryFee(0, 1)).toBe(2.00);
    });
    it('should calculate correctly for 7km and 3kg', () => {
        expect(calculateDeliveryFee(7, 3)).toBe(4.00);
    });
    it('should calculate correctly for 6km and 2kg', () => {
        expect(calculateDeliveryFee(6, 2)).toBe(3.50);
    });
    it('should calculate correctly for 10km and 6kg', () => {
        expect(calculateDeliveryFee(10, 6)).toBe(7.00);
    });
});

/**
 * applyPromoCode(subtotal: number, promoCode: string, promoCodes: PromoCode[])
 */
describe('applyPromoCode', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString();
    it('should throw an error for an unknown promo code', () => {
        expect(() => applyPromoCode(50, 'CODE_INEXISTANT', [])).toThrow('Code inconnu');
    });
    it('should apply a 20% discount on a 50€ order', () => {
        const promos: PromoCode[] = [{
            "code": "BIENVENUE20",
            "type": "percentage",
            "value": 20,
            "minOrder": 15.00,
            "expiresAt": tomorrowDate
        }];
        expect(applyPromoCode(50, 'BIENVENUE20', promos)).toBe(40);
    });
    it('should apply a fixed discount of 5€ on a 30€ order', () => {
        const promos: PromoCode[] = [{
            code: 'REDUC5',
            type: 'fixed',
            value: 5,
            minOrder: 0,
            expiresAt: tomorrowDate
        }];
        expect(applyPromoCode(30, 'REDUC5', promos)).toBe(25);
    });
    it('should refuse the code if subtotal is below minOrder', () => {
        const promos: PromoCode[] = [{
            code: 'MINI20',
            type: 'fixed',
            value: 5,
            minOrder: 20,
            expiresAt: tomorrowDate
        }];
        expect(() => applyPromoCode(15, 'MINI20', promos)).toThrow();
    });
    it('should throw an error if the promo code is expired', () => {
        const promos: PromoCode[] = [{
            code: 'EXPIRE',
            type: 'percentage',
            value: 10,
            minOrder: 0,
            expiresAt: yesterdayDate
        }];
        expect(() => applyPromoCode(100, 'EXPIRE', promos)).toThrow('Promo expirée');
    });
    it('should not return a negative total if the discount exceeds the subtotal', () => {
        const promos: PromoCode[] = [{
            code: 'REDUC50',
            type: 'fixed',
            value: 50,
            minOrder: 0,
            expiresAt: tomorrowDate
        }];
        expect(applyPromoCode(30, 'REDUC50', promos)).toBe(0);
    });
    it('should return 0€ for a 100% discount', () => {
        const promos: PromoCode[] = [{
            code: 'GRATUIT',
            type: 'percentage',
            value: 100,
            minOrder: 0,
            expiresAt: tomorrowDate
        }];
        expect(applyPromoCode(50, 'GRATUIT', promos)).toBe(0);
    });
    it('should accept the code if subtotal is exactly minOrder', () => {
        const promos: PromoCode[] = [{
            code: 'MINI20',
            type: 'fixed',
            value: 5,
            minOrder: 20,
            expiresAt: tomorrowDate
        }];
        expect(applyPromoCode(20, 'MINI20', promos)).toBe(15);
    });
    it('should return 0 if subtotal is 0', () => {
        const promos: PromoCode[] = [{
            code: 'REDUC5',
            type: 'fixed',
            value: 5,
            minOrder: 0,
            expiresAt: tomorrowDate
        }];
        expect(applyPromoCode(0, 'REDUC5', promos)).toBe(0);
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
    it('should return 1.3 for lunch surge (Tuesday 12h30)', () => {
        expect(calculateSurge(12.5, 'Mardi')).toBe(1.3);
    });
});