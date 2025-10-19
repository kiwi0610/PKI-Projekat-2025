import { Component, signal } from '@angular/core';
import { ToyModel } from '../models/toy.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToysService } from '../services/toys.service';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rezervisi',
  imports: [CommonModule, FormsModule],
  templateUrl: './rezervisi.html',
  styleUrl: './rezervisi.css'
})
export class Rezervisi {
  protected toy = signal<ToyModel | null>(null);
  protected start: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((params: any) => {
      ToysService.getToysById(params.id)
        .then(rsp => this.toy.set(rsp.data))
        .catch(err => console.error(err));
    });
  }

  decreaseStart() {
    if (this.start > 1) this.start--;
  }

  increaseStart() {
    this.start++;
  }

  onSubmit() {
    try {
      UserService.addToCart(
        this.toy()?.toyId!,
        this.toy()?.name!,
        this.start,
        this.toy()?.price!,
        'waiting'
      );
      
      Swal.fire({
        icon: 'success',
        title: 'Uspešno!',
        html: `
          <strong>${this.toy()?.name}</strong> je uspešno dodat u korpu!<br>
          Količina: ${this.start}<br>
          Ukupno: ${(this.toy()?.price ?? 0) * this.start} RSD
        `,
        confirmButtonColor: '#28a745',
        showCancelButton: true,
        confirmButtonText: 'Idi u korpu',
        cancelButtonText: 'Nastavi kupovinu'
      }).then((result) => {
        this.router.navigateByUrl(result.isConfirmed ? '/korpa' : '/igracke');
      });
      
    } catch (error) {
      sessionStorage.setItem('redirectUrl', this.router.url);
      this.router.navigateByUrl('/login');
    }
  }

  getAverageRating(toyId: any): number {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const ratings = allReviews
      .filter((r: any) => r.toyId === toyId && r.ratingValue > 0)
      .map((r: any) => r.ratingValue);
    return ratings.length === 0 ? 0 : ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
  }
}