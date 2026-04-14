import { calculateDeliveryFee } from './pricing';

describe('calculateDeliveryFee', () => {
    it('should return 2.00 for a distance <= 3km and weight <= 5kg', () => {
        expect(calculateDeliveryFee(2, 1)).toBe(2.00);
    });
    it('should add 0.50€ per km for distance between 3km and 10km', () => {
        expect(calculateDeliveryFee(6, 2)).toBe(3.50);
    });
    it('should add 1.50€ supplement when weight is greater than 5kg', () => {
        expect(calculateDeliveryFee(5, 8)).toBe(4.50);
    });
    it('should return null if distance is greater than 10km', () => {
        expect(calculateDeliveryFee(15, 2)).toBeNull();
    });

    it('should throw error if distance or weight is negative', () => {
        expect(() => calculateDeliveryFee(-1, 5)).toThrow();
        expect(() => calculateDeliveryFee(5, -1)).toThrow();
    });
});