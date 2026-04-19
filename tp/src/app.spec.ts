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
        it('should apply 20% discount with a valid promo code', async () => {
            const response = await request(app)
                .post('/orders/simulate')
                .send({ 
                    items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
                    distance: 5,
                    weight: 1,
                    promoCode: 'BIENVENUE20',
                    hour: 15,
                    dayOfWeek: 'Mardi'
                });

            expect(response.status).toBe(200);
            expect(response.body.subtotal).toBe(25.00);
            expect(response.body.discount).toBe(5.00);
            expect(response.body.total).toBe(23.00);
        });
        it('should apply weekend surge (1.8x) on Friday 20h', async () => {
            const response = await request(app)
                .post('/orders/simulate')
                .send({ 
                    items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
                    distance: 5,
                    weight: 1,
                    promoCode: null,
                    hour: 20,
                    dayOfWeek: 'Vendredi'
                });

            expect(response.status).toBe(200);
            expect(response.body.deliveryFee).toBe(3.00);
            expect(response.body.surge).toBe(1.8);
            expect(response.body.total).toBe(30.40);
        });
    });

    describe('POST /orders', () => {
        const validOrder = {
            items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
            distance: 5,
            weight: 1,
            promoCode: null,
            hour: 15,
            dayOfWeek: 'Mardi'
        };

        it('should create an order and return 201 with a unique ID', async () => {
            const response = await request(app)
                .post('/orders')
                .send(validOrder);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.total).toBe(28.00);
            // On vérifie que l'ID est bien une chaîne non vide
            expect(typeof response.body.id).toBe('string');
            expect(response.body.id.length).toBeGreaterThan(0);
        });
        it('should generate different IDs for two consecutive orders', async () => {
            const res1 = await request(app).post('/orders').send(validOrder);
            const res2 = await request(app).post('/orders').send(validOrder);

            expect(res1.status).toBe(201);
            expect(res2.status).toBe(201);
            expect(res1.body.id).not.toBe(res2.body.id);
        });
    });
});

