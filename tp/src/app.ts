import crypto from 'crypto';
import express, { Request, Response } from 'express';
import {
  calculateOrderTotal,
  applyPromoCode,
  PROMO_CODES,
  OrderTotal,
  OrderItem,
  DayOfWeek,
} from './pricing';

const app = express();
app.use(express.json());

export interface Order extends OrderTotal {
  id: string;
  items: OrderItem[];
}

export let orders: Order[] = [];

export const resetOrders = () => {
  orders = [];
};

/**
 * POST /orders/simulate
 * Calculer le prix total d'une commande
 */
app.post('/orders/simulate', (req: Request, res: Response) => {
  try {
    const { items, distance, weight, promoCode, hour, dayOfWeek } =
      req.body as {
        items: OrderItem[];
        distance: number;
        weight: number;
        promoCode: string | null;
        hour: number;
        dayOfWeek: DayOfWeek;
      };
    const result = calculateOrderTotal(
      items,
      distance,
      weight,
      promoCode,
      hour,
      dayOfWeek,
    );
    res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(400).json({ error: message });
  }
});

/**
 * POST /orders
 * Enregistrer une commande en mémoire
 */
app.post('/orders', (req: Request, res: Response) => {
  try {
    const { items, distance, weight, promoCode, hour, dayOfWeek } =
      req.body as {
        items: OrderItem[];
        distance: number;
        weight: number;
        promoCode: string | null;
        hour: number;
        dayOfWeek: DayOfWeek;
      };
    const pricing = calculateOrderTotal(
      items,
      distance,
      weight,
      promoCode,
      hour,
      dayOfWeek,
    );
    const newOrder: Order = {
      id: crypto.randomUUID(),
      items,
      ...pricing,
    };

    orders.push(newOrder);

    res.status(201).json(newOrder);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(400).json({ error: message });
  }
});

/**
 * GET /orders/:id
 * Récupérer une commande par son ID
 */
app.get('/orders/:id', (req: Request, res: Response) => {
  const order = orders.find((o) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Commande introuvable' });
  }

  res.json(order);
});

/**
 * POST /promo/validate
 * Vérifier la validité d'un code sans passer de commande
 */
app.post('/promo/validate', (req: Request, res: Response) => {
  try {
    const { promoCode, subtotal } = req.body as {
      promoCode: string;
      subtotal: number;
    };

    if (!promoCode) {
      return res.status(400).json({ error: 'Code manquant' });
    }

    const newPrice = applyPromoCode(subtotal, promoCode, PROMO_CODES);

    res.json({
      isValid: true,
      newPrice: newPrice,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';

    if (message === 'Code inconnu') {
      return res.status(404).json({ error: message });
    }

    res.status(400).json({ error: message });
  }
});

export default app;
