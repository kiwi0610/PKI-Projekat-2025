export interface cartModel {
    userId: string;
    toyId: number;
    toyName: string;
    amount: number;
    price: number;
    status: 'paid' | 'waiting' | 'canceled';
    ratingValue?: number;
    createdAt: Date;
    updatedAt: Date | null;
}
