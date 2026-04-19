import express, { Request, Response } from 'express';
import { 
    calculateOrderTotal, 
    applyPromoCode, 
    PROMO_CODES, 
    OrderTotal, 
    OrderItem, 
    DayOfWeek 
} from './pricing';

const app = express();
app.use(express.json());

export interface Order extends OrderTotal {
    id: string;
    items: OrderItem[];
}

let orders: Order[] = [];

export const resetOrders = () => { orders = []; };

/**
 * ROUTE 1 : POST /orders/simulate
 * Calculer le prix total d'une commande
 */
app.post('/orders/simulate', (req: Request, res: Response) => {
    try {
        const { items, distance, weight, promoCode, hour, dayOfWeek } = req.body;
        const result = calculateOrderTotal(items, distance, weight, promoCode, hour, dayOfWeek);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default app;