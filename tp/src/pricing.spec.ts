import { calculateDeliveryFee } from './pricing';

describe('calculateDeliveryFee', () => {
    it('should return 2.00 for a distance <= 3km and weight <= 5kg', () => {
        expect(calculateDeliveryFee(2, 1)).toBe(2.00);
    });
    it('should add 0.50€ per km for distance between 3km and 10km', () => {
        expect(calculateDeliveryFee(6, 2)).toBe(3.50);
    });
});