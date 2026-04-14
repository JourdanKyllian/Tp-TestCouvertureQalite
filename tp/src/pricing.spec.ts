import { calculateDeliveryFee } from './pricing';

describe('calculateDeliveryFee', () => {
    it('should return 2.00 for a distance <= 3km and weight <= 5kg', () => {
        expect(calculateDeliveryFee(2, 1)).toBe(2.00);
    });
});