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

  cancelItem(index: number) {
    const items = this.cartItems();
    items[index].status = 'cancelled';
    this.cartItems.set([...items]);
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

  // Ovo je za dugme plati sve i ukloni sve
  // Dugmad "Plati sve" i "Ukloni sve" će biti disabled ako je korpa prazna
  // ili ako su svi artikli plaćeni
  isAllPaid(): boolean {
    const items = this.cartItems();
    return items.length === 0 || items.every(item => item.status === 'paid');
  }

  clearCart() {
    this.saveCart([]);
  }

  rateItem(index: number, value: number) {
    const items = [...this.cartItems()];
    const item = items[index];
    if (!item || item.status !== 'paid') return;

    // postavi ocenu
    item.ratingValue = value;
    item.updatedAt = new Date();

    // ukloni proizvod iz korpe
    const filteredItems = items.filter((_, i) => i !== index);
    this.saveCart(filteredItems); // čuva novu listu korpe
    UserService.addReview(item); // dodaje u recenzije

    this.cartItems.set(filteredItems);

    alert(`${item.toyName} je ocenjen sa ${value} ⭐ i prebačen u recenzije.`);
  }





  // računa prosečnu ocenu za dati proizvod
  getAverageRating(toyId: any): number {
    const users = UserService.getUsers(); // svi korisnici
    const allItems = users.flatMap(u => u.data || []);
    const ratings = allItems
      .filter(item => item.toyId === toyId && item.ratingValue !== undefined && item.ratingValue > 0)
      .map(item => item.ratingValue!); // ! govori TS da nije undefined

    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return sum / ratings.length;
  }

  // pomoćna funkcija za proveru boje zvezdica
  isStarFilled(item: any, star: number) {
    return item.ratingValue && star <= item.ratingValue;
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
