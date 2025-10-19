import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToysService } from '../services/toys.service';
import { UserService } from '../services/user.service';
import { ToyModel } from '../models/toy.model';
import Swal from 'sweetalert2';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-rezervisi',
  imports: [DecimalPipe, CommonModule],
  templateUrl: './rezervisi.html',
  styleUrls: ['./rezervisi.css']
})
export class Rezervisi {

  protected toy = signal<ToyModel | null>(null);
  start: number = 1;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe((params: any) => {

      if (!localStorage.getItem('active')) {
        // Sačuvaj trenutnu lokaciju pre nego što preusmerimo na login
        const currentPath = `/detalji/${params.id}/rezervacija`;
        sessionStorage.setItem('redirectUrl', currentPath);
        router.navigateByUrl('/login');
        return;
      }

      ToysService.getToysById(params.id)
        .then(rsp => this.toy.set(rsp.data))
        .catch(err => console.error(err));
    });
  }

  increaseStart() {
    this.start++;
  }

  decreaseStart() {
    if (this.start > 1) this.start--;
  }

  onSubmit() {
    const toyValue = this.toy();

    if (!toyValue) {
      alert('Igračka nije učitana!');
      return;
    }

    if (!localStorage.getItem('active')) {
      const currentPath = this.router.url;
      sessionStorage.setItem('redirectUrl', currentPath);
      alert('Morate biti ulogovani da biste dodali u korpu!');
      this.router.navigateByUrl('/login');
      return;
    }

    try {
      UserService.addToCart(
        toyValue.toyId,
        toyValue.name,
        this.start,
        Number(toyValue.price),
        'waiting'
      );

      Swal.fire({
        title: `${toyValue.name} (${this.start} kom) dodat u korpu!`,
        text: 'Šta želite da uradite dalje?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Idi u korpu',
        cancelButtonText: 'Nastavi kupovinu',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('/korpa');
        } else {
          this.router.navigateByUrl('/igracke');
        }
      });

    } catch (error: any) {
      console.error(error);
      alert('Greška prilikom dodavanja u korpu: ' + error.message);
    }
  }

  getAverageRating(toyId: any): number {
    // Uzmi sve ocene iz localStorage
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const ratings = allReviews
      .filter((r: any) => r.toyId === toyId && r.ratingValue > 0)
      .map((r: any) => r.ratingValue);

    if (ratings.length === 0) return 0;
    return ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
  }
}