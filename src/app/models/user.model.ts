export interface UserModel {
    firstName: string,
    lastName: string
    email: string,
    phone: string,
    password: string,
    toyType: {
        typeId: number;
        name: string;
        description: string;
    };
    data: any[]
}