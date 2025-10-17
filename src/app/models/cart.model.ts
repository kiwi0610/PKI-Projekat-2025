export interface cartModel {
    userId: string;
    toyId: number;
    toyName: string;
    amount: number;  // količina
    price: number;   // cena po artiklu
    status: 'paid' | 'waiting' | 'canceled';
    ratingValue?: number;
    createdAt: Date;
    updatedAt: Date | null;
}
