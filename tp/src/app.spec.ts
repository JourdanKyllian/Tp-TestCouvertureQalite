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
        it('should return 400 for an expired promo code', async () => {
            const response = await request(app)
                .post('/orders/simulate')
                .send({ 
                    items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
                    distance: 5,
                    weight: 1,
                    promoCode: 'EXPIRE', // Ce code doit être dans ta liste mais expiré
                    hour: 15,
                    dayOfWeek: 'Mardi'
                }); 

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Promo expirée');
        });
        it('should return 400 for out of bounds distance (15km)', async () => {
            const response = await request(app)
                .post('/orders/simulate')
                .send({ 
                    items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
                    distance: 15, // Supérieur au MAX_DISTANCE (10)
                    weight: 1,
                    promoCode: null,
                    hour: 15,
                    dayOfWeek: 'Mardi'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Hors zone de livraison');
        });
        it('should return 400 if the shop is closed (23h)', async () => {
            const response = await request(app)
                .post('/orders/simulate')
                .send({ 
                    items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
                    distance: 5,
                    weight: 1,
                    promoCode: null,
                    hour: 23, // La boutique ferme à 22h
                    dayOfWeek: 'Lundi'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Boutique fermée');
        });
    });
});

