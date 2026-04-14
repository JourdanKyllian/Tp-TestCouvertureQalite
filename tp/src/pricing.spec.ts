import { applyPromoCode, calculateDeliveryFee, PromoCode } from './pricing';

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

describe('applyPromoCode', () => {
    const mockPromos: PromoCode[] = [{
        "code": "BIENVENUE20",
        "type": "percentage",
        "value": 20,
        "minOrder": 15.00,
        "expiresAt": "2026-12-31"
    }];
    it('should apply a 20% discount on a 50€ order', () => {
        expect(applyPromoCode(50, 'BIENVENUE20', mockPromos)).toBe(40);
    });
});