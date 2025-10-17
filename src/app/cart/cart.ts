import { Component, signal } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [FormsModule, CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart {
  protected cartItems = signal<any[]>([]);

  constructor() {
    this.loadCart();
  }

  loadCart() {
    try {
      const items = UserService.getCartItems();
      // inicijalizuj ratingValue za sve paid ali neocenjene
      items.forEach(item => {
        if (item.status === 'paid' && item.ratingValue === undefined) {
          item.ratingValue = 0;
        }
      });
      this.cartItems.set(items || []);
    } catch {
      this.cartItems.set([]);
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'waiting': return 'status-waiting';
      case 'paid': return 'status-paid';
      case 'canceled': return 'status-canceled';
      case 'liked': return 'status-liked';
      case 'desliked': return 'status-disliked';
      default: return '';
    }
  }

  removeItem(index: number) {
    const items = [...this.cartItems()];
    const item = items[index];
    if (!item) return;

    if (item.amount > 1) {
      item.amount--;
    } else {
      items.splice(index, 1);
    }

    this.saveCart(items);
  }

  payItem(index: number) {
    const items = [...this.cartItems()];
    const item = items[index];
    if (!item || item.status === 'paid') return;

    item.status = 'paid';
    item.updatedAt = new Date();

    this.saveCart(items);
    alert(`${item.toyName} je uspešno plaćen!`);
  }

  payAll() {
    const items = this.cartItems().map(item => ({
      ...item,
      status: 'paid',
      updatedAt: new Date()
    }));
    this.saveCart(items);
    alert('Sve igračke su plaćene! Možete ih oceniti.');
  }

  clearCart() {
    this.saveCart([]);
  }

  rateItem(index: number, value: number) {
    const items = [...this.cartItems()];
    const item = items[index];
    if (!item || item.status !== 'paid') return;

    item.ratingValue = value;
    item.updatedAt = new Date();

    // save cart
    UserService.updateCart(items);
    this.cartItems.set(items);
  }

  getItemPrice(item: any) {
    return (item.amount ?? 1) * (item.price ?? 0);
  }

  getTotalPrice() {
    return this.cartItems().reduce((sum, item) => sum + this.getItemPrice(item), 0);
  }

  private saveCart(items: any[]) {
    const activeUser = UserService.getActiveUser();
    const users = UserService.getUsers();

    const updatedUsers = users.map(u => {
      if (u.email === activeUser.email) {
        u.data = items;
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    this.cartItems.set(items);
  }
}
