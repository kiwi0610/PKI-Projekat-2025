import { Component, signal } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [FormsModule, CommonModule, DecimalPipe],
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
      const activeUser = UserService.getActiveUser();
      const items = activeUser.data || [];
      items.forEach(item => {
        if (item.status === 'paid' && item.ratingValue === undefined) {
          item.ratingValue = 0;
        }
      });
      this.cartItems.set(items);
    } catch {
      this.cartItems.set([]);
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'waiting': return 'status-waiting';
      case 'paid': return 'status-paid';
      case 'canceled': return 'status-canceled';
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

    // Ažuriraj localStorage i aktivnog korisnika
    this.saveCart(items);
  }

  private saveCart(items: any[]) {
    const activeUser = UserService.getActiveUser();
    const users = UserService.getUsers();

    // update svih korisnika
    const updatedUsers = users.map(u => {
      if (u.email === activeUser.email) {
        u.data = items;
      }
      return u;
    });

    // čuvaj sve korisnike
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // update aktivnog korisnika odmah
    const updatedActiveUser = { ...activeUser, data: items };
    localStorage.setItem('activeUser', JSON.stringify(updatedActiveUser));


    this.cartItems.set(items);
  }


  cancelItem(index: number) {
    const items = [...this.cartItems()];
    items[index].status = 'cancelled';
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


  isAllPaid(): boolean {
    const items = this.cartItems();
    return items.length === 0 || items.every(item => item.status === 'paid');
  }

  canClearCart(): boolean {
    return this.cartItems().length > 0;
  }

  rateItem(index: number, value: number) {
    const items = [...this.cartItems()];
    const item = items[index];
    if (!item || item.status !== 'paid') return;

    item.ratingValue = value;
    item.updatedAt = new Date();

    UserService.addReview(item);

    const filteredItems = items.filter((_, i) => i !== index);
    this.saveCart(filteredItems);
    this.cartItems.set(filteredItems);

    alert(`${item.toyName} je ocenjen sa ${value} ⭐ i prebačen u recenzije.`);
  }

  getAverageRating(toyId: any): number {
    const users = UserService.getUsers();
    const allItems = users.flatMap(u => u.data || []);
    const ratings = allItems
      .filter(item => item.toyId === toyId && item.ratingValue !== undefined && item.ratingValue > 0)
      .map(item => item.ratingValue!);
    if (ratings.length === 0) return 0;
    return ratings.reduce((a, b) => a + b, 0) / ratings.length;
  }

  isStarFilled(item: any, star: number) {
    return item.ratingValue && star <= item.ratingValue;
  }

  getItemPrice(item: any) {
    return (item.amount ?? 1) * (item.price ?? 0);
  }

  getTotalPrice() {
    return this.cartItems().reduce((sum, item) => sum + this.getItemPrice(item), 0);
  }

}
