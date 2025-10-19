import { cartModel } from "../models/cart.model";
import { UserModel } from "../models/user.model";

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
          data: []
        }
      ]));
    }
    return JSON.parse(localStorage.getItem('users')!);
  }

  static signup(payload: UserModel) {
    const users: UserModel[] = this.getUsers();
    users.push(payload);
    localStorage.setItem('users', JSON.stringify(users));

    localStorage.setItem('activeUser', JSON.stringify(payload));
    localStorage.setItem('active', payload.email);
  }


  static login(email: string, password: string) {
    const user = this.findUserByEmail(email);
    if (user.password !== password) throw new Error('Loša lozinka ili email!');
    localStorage.setItem('activeUser', JSON.stringify(user));
    localStorage.setItem('active', user.email);
    localStorage.setItem('lastLoginTime', new Date().toISOString());
  }


  static logout() {
    localStorage.removeItem('active');
    localStorage.removeItem('activeUser');
  }


  static getActiveUser(): UserModel {
    const data = localStorage.getItem('activeUser');
    if (data) return JSON.parse(data);


    const active = localStorage.getItem('active');
    if (!active) throw new Error('Niste ulogovani!');
    return this.findUserByEmail(active);
  }

  static updateUser(updatedUser: UserModel) {
    const users = this.getUsers();
    const updatedUsers = users.map(u =>
      u.email === updatedUser.email ? updatedUser : u
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('activeUser', JSON.stringify(updatedUser));
  }


  static updateUserPassword(newPassword: string) {
    const user = this.getActiveUser();
    user.password = newPassword;
    this.updateUser(user);
  }


  static findUserByEmail(email: string) {
    const users: UserModel[] = this.getUsers();
    const exactUser = users.find(u => u.email === email);
    if (!exactUser) throw new Error('Korisnik nije pronađen!');
    return exactUser;
  }


  static addToCart(
    toyId: number,
    toyName: string,
    amount: number,
    price: number,
    status: 'paid' | 'waiting' | 'canceled'
  ) {
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

    const updated = updatedUsers.find(u => u.email === activeUser.email);
    if (updated) localStorage.setItem('activeUser', JSON.stringify(updated));
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
    const updated = updatedUsers.find(u => u.email === activeUser.email);
    if (updated) localStorage.setItem('activeUser', JSON.stringify(updated));
  }


  static clearCart() {
    this.updateCart([]);
  }

  static addReview(review: any) {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const activeUser = this.getActiveUser();

    // osiguraj da ima email
    review.userEmail = activeUser?.email;

    const index = allReviews.findIndex(
      (r: any) => r.toyId === review.toyId && r.userEmail === review.userEmail
    );

    if (index !== -1) {
      // UVEK ažuriraj, čak i ako je ista ocena
      allReviews[index] = { ...allReviews[index], ...review };
    } else {
      allReviews.push(review);
    }

    localStorage.setItem('reviews', JSON.stringify(allReviews));
  }

}