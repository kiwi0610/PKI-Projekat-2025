import { cartModel } from "../models/cart.model";
import { UserModel } from "../models/user.model";
import Swal from 'sweetalert2';

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
          toyType: {
            typeId: 1,
            name: 'plisana igracka',
            description: ''
          },
          data: []
        }
      ]));
    }
    
    const users = JSON.parse(localStorage.getItem('users')!);
    return users.map((user: any) => ({
      ...user,
      data: user.data || []
    }));
  }

  static signup(payload: UserModel) {
    const users: UserModel[] = this.getUsers();
    
    const existingUser = users.find(u => u.email === payload.email);
    if (existingUser) {
      Swal.fire({
        icon: 'error',
        title: 'Greška',
        text: 'Korisnik sa ovom email adresom već postoji!',
        confirmButtonColor: '#386fa4'
      });
      throw new Error('Korisnik već postoji');
    }
    
    payload.data = payload.data || [];
    users.push(payload);
    
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('activeUser', JSON.stringify(payload));
    localStorage.setItem('active', payload.email);
  }

  static login(email: string, password: string) {
    const user = this.findUserByEmail(email);
    if (user.password !== password) {
      Swal.fire({
        icon: 'error',
        title: 'Greška',
        text: 'Pogrešna lozinka ili email!',
        confirmButtonColor: '#386fa4'
      });
      throw new Error('Loša lozinka ili email!');
    }
    
    localStorage.setItem('activeUser', JSON.stringify(user));
    localStorage.setItem('active', user.email);
  }

  static logout() {
    localStorage.removeItem('active');
    localStorage.removeItem('activeUser');
    window.location.href = '/login';
  }

  static getActiveUser(): UserModel {
    const data = localStorage.getItem('activeUser');
    if (data) return JSON.parse(data);

    const active = localStorage.getItem('active');
    if (!active) {
      sessionStorage.setItem('redirectUrl', window.location.pathname + window.location.search);
      throw new Error('Niste ulogovani!');
    }
    return this.findUserByEmail(active);
  }

  static updateUser(updatedUser: UserModel) {
    const users = this.getUsers();
    const updatedUsers = users.map(u =>
      u.email === updatedUser.email ? updatedUser : u
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('activeUser', JSON.stringify(updatedUser));
    
    Swal.fire({
      icon: 'success',
      title: 'Uspešno!',
      text: 'Podaci su uspešno ažurirani!',
      confirmButtonColor: '#28a745',
      timer: 2000,
      showConfirmButton: false
    });
  }

  static updateUserPassword(newPassword: string) {
    const user = this.getActiveUser();
    user.password = newPassword;
    this.updateUser(user); 
    
    Swal.fire({
      icon: 'success',
      title: 'Lozinka promenjena!',
      text: 'Lozinka je uspešno promenjena. Bićete izlogovani za nekoliko sekundi.',
      confirmButtonColor: '#28a745',
      timer: 3000,
      showConfirmButton: false
    }).then(() => {
      this.logout();
    });
  }

  static findUserByEmail(email: string) {
    const users: UserModel[] = this.getUsers();
    const exactUser = users.find(u => u.email === email);
    if (!exactUser) {
      Swal.fire({
        icon: 'error',
        title: 'Greška',
        text: 'Korisnik sa ovom email adresom ne postoji!',
        confirmButtonColor: '#386fa4'
      });
      throw new Error('Korisnik nije pronađen!');
    }
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
        u.data = u.data || [];
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

    this.saveUsers(updatedUsers, activeUser.email);
  }

  static updateCart(newCart: cartModel[]) {
    const activeUser = this.getActiveUser();
    const users = this.getUsers();

    const updatedUsers = users.map(u => {
      if (u.email === activeUser.email) {
        u.data = newCart || [];
      }
      return u;
    });

    this.saveUsers(updatedUsers, activeUser.email);
  }

  private static saveUsers(users: UserModel[], activeEmail: string) {
    localStorage.setItem('users', JSON.stringify(users));
    const updated = users.find(u => u.email === activeEmail);
    if (updated) localStorage.setItem('activeUser', JSON.stringify(updated));
  }

  static clearCart() {
    Swal.fire({
      title: 'Da li ste sigurni?',
      text: "Želite da ispraznite celu korpu?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Da, isprazni korpu!',
      cancelButtonText: 'Otkaži'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateCart([]);
        Swal.fire({
          icon: 'success',
          title: 'Korpa je ispražnjena!',
          text: 'Sve stavke su uklonjene iz korpe.',
          confirmButtonColor: '#28a745',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  static addReview(review: any) {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const activeUser = this.getActiveUser();

    review.userEmail = activeUser?.email;

    const index = allReviews.findIndex(
      (r: any) => r.toyId === review.toyId && r.userEmail === review.userEmail
    );

    if (index !== -1) {
      allReviews[index] = { ...allReviews[index], ...review };
    } else {
      allReviews.push(review);
    }

    localStorage.setItem('reviews', JSON.stringify(allReviews));
  }
}