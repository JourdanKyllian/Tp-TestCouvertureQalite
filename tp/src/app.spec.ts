import request from 'supertest';
import app, { resetOrders } from './app';

describe('API Integration Tests', () => {
    beforeEach(() => {
        resetOrders();
    });

    describe('POST /orders/simulate', () => {
        const validOrder = {
            items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
            distance: 5,
            weight: 1,
            promoCode: null,
            hour: 15,
            dayOfWeek: 'Mardi'
        };

        it('should return 200 and correct price details for a normal order', async () => {
            const response = await request(app)
                .post('/orders/simulate')
                .send(validOrder);

            expect(response.status).toBe(200);
            expect(response.body.total).toBe(28.00);
        });

        it('should return 400 if the cart is empty', async () => {
            const response = await request(app)
                .post('/orders/simulate')
                .send({ ...validOrder, items: [] });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Panier vide');
        });
    });
    
});

