export const BASE_FEE = 2.00;
export const MAX_DISTANCE = 10;

export function calculateDeliveryFee(distance: number, weight: number): number | null {
    let fee = 2.00;
    if (distance > 3) {
        fee += (distance - 3) * 0.50;
    }
    if (weight > 5) {
        fee += 1.50;
    }

    return fee;
}