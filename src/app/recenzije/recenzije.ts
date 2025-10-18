import { Component, signal } from '@angular/core';
import { UserService } from '../services/user.service';
import { Details } from "../details/details";

@Component({
  selector: 'app-recenzije',
  imports: [Details],
  templateUrl: './recenzije.html',
  styleUrl: './recenzije.css'
})
export class Recenzije {

  protected reviews = signal<any[]>([]);

  loadReviews() {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const activeUser = UserService.getActiveUser();
    this.reviews.set(allReviews.filter((r: any) => r.userEmail === activeUser.email));
  }

  // prosečna ocena za sve korisnike
  // getAverageRating(toyId: any): number {
  //  const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
   // const ratings = allReviews
    //  .filter((r: any) => r.toyId === toyId && r.ratingValue > 0)
     // .map((r: any) => r.ratingValue);

    //if (ratings.length === 0) return 0;
   // return ratings.reduce((a, b) => a + b, 0) / ratings.length;
  //}


}

