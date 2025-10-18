import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recenzije',
  imports: [CommonModule],
  templateUrl: './recenzije.html',
  styleUrls: ['./recenzije.css']
})
export class Recenzije implements OnInit {

  protected reviews = signal<any[]>([]);

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const activeUser = UserService.getActiveUser();
    const userReviews = allReviews.filter((r: any) => r.userEmail === activeUser.email);
    this.reviews.set(userReviews);
  }

  getItemPrice(item: any) {
    return (item.amount ?? 1) * (item.price ?? 0);
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'paid': return 'status-paid';
      case 'cancelled': return 'status-canceled';
      default: return '';
    }
  }

  getAverageRating(toyId: any): number {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const ratings = allReviews
      .filter((r: any) => r.toyId === toyId && r.ratingValue > 0)
      .map((r: any) => r.ratingValue);
    if (ratings.length === 0) return 0;
    return ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
  }

  updateRating(item: any, newValue: number) {
    item.ratingValue = newValue;
    item.updatedAt = new Date();
    UserService.addReview(item); // ažurira u localStorage
    alert(`Promenili ste ocenu za ${item.toyName} na ${newValue} ⭐`);
  }

}
