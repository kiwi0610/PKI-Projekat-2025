import { cartModel } from "../models/cart.model"
import { UserModel } from "../models/user.model"

export class UserService {

    static getUsers(): UserModel[] {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([
                {
                    firstName: 'example',
                    lastName: 'user',
                    email: 'user@example.com',
                    phone: '+38163123123',
                    password: 'user123',
                    toyTypes: 'plisana igracka',
                    data: [] // ovde ce biti sacuvane igracke (cart podaci)
                }
            ]))
        }
        return JSON.parse(localStorage.getItem('users')!)
    }

    static findUserByEmail(email: string) {
        const users: UserModel[] = this.getUsers()
        const exactUser = users.find(u => u.email === email)

        if (!exactUser)
            throw new Error('Korisnik nije pronađen!')
        return exactUser
    }

    static login(email: string, password: string) {
        const user = this.findUserByEmail(email)

        if (user.password !== password) {
            throw new Error('Loša lozinka ili email!')
        }

        // Sigurno postavljanje aktivnog korisnika
        localStorage.setItem('active', user.email)
        localStorage.setItem('lastLoginTime', new Date().toISOString()) // opciono, samo info
    }

    static signup(payload: UserModel) {
        const users: UserModel[] = this.getUsers()
        users.push(payload)
        localStorage.setItem('users', JSON.stringify(users))
    }

    static getActiveUser(): UserModel {
        const active = localStorage.getItem('active')
        if (!active)
            throw Error('Niste ulogovani!')

        return this.findUserByEmail(active)
    }

    static addToCart(toyId: number, toyName: string, amount: number, price: number, status: 'paid' | 'waiting' | 'canceled') {
        const activeUser = this.getActiveUser();
        const users = this.getUsers();

        const updatedUsers = users.map(u => {
            if (u.email === activeUser.email) {
                u.data.push({
                    userId: u.email,
                    toyId,
                    toyName,
                    amount,
                    price,
                    status,
                    createdAt: new Date(),
                    updatedAt: null
                });
            }
            return u;
        });

        localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    static updateCart(newCart: cartModel[]) {
        const activeUser = this.getActiveUser();
        const users = this.getUsers();
        const updatedUsers = users.map(u => {
            if (u.email === activeUser.email) {
                u.data = newCart;
            }
            return u;
        });
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    static clearCart() {
        this.updateCart([]);
    }

    static addReview(item: any) {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');

        // proveri da li korisnik već ima recenziju za ovaj toyId
        const existingIndex = reviews.findIndex((r: any) => r.toyId === item.toyId && r.userEmail === this.getActiveUser().email);

        if (existingIndex !== -1) {
            reviews[existingIndex] = item; // update postojeće
        } else {
            reviews.push({ ...item, userEmail: this.getActiveUser().email });
        }

        localStorage.setItem('reviews', JSON.stringify(reviews));
    }

    static getCartItems() {
        const activeUser = this.getActiveUser()
        return activeUser.data
    }

    static logout() {
        localStorage.removeItem('active')
    }
}
