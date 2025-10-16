export interface cartModel
{
    userId : string
    toyId: number,
    toyName: string,
    amount : number,
    status : 'paid' | 'waiting' | 'canceled'| 'liked' | 'desliked'
    createdAt : Date
    updatedAt : Date | null
    
}