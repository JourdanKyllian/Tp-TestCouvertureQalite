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
 * POST /orders/simulate
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

/**
 * POST /orders
 * Enregistrer une commande en mémoire
 */
app.post('/orders', (req: Request, res: Response) => {
    try {
        const { items, distance, weight, promoCode, hour, dayOfWeek } = req.body;
        
        const pricing = calculateOrderTotal(items, distance, weight, promoCode, hour, dayOfWeek);
        
        const newOrder: Order = {
            id: crypto.randomUUID(),
            items,
            ...pricing
        };
        
        orders.push(newOrder);
        
        res.status(201).json(newOrder);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * GET /orders/:id
 * Récupérer une commande par son ID
 */
app.get('/orders/:id', (req: Request, res: Response) => {
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
        return res.status(404).json({ error: 'Commande introuvable' });
    }
    
    res.json(order);
});

export default app;