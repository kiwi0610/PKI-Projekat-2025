import { Component, signal } from '@angular/core';
import { ToyModel } from '../models/toy.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToysService } from '../services/toys.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-rezervisi',
  imports: [],
  templateUrl: './rezervisi.html',
  styleUrls: ['./rezervisi.css']
})
export class Rezervisi {

  protected toy = signal<ToyModel | null>(null);
  start: number = 1; // količina

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe((params: any) => {
      if (!localStorage.getItem('active')) {
        sessionStorage.setItem('ref', `/details/${params.id}/book`);
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
      alert('Morate biti ulogovani da biste dodali u korpu!');
      return;
    }

    try {
      // Samo ovo dodaje u cart
      UserService.addToCart(
        toyValue.toyId,
        toyValue.name,
        this.start,
        Number(toyValue.price),
        'waiting'
      );

      alert(`${toyValue.name} (${this.start} kom) dodat u korpu!`);
      this.router.navigateByUrl('/korpa');
    } catch (error: any) {
      console.error(error);
      alert('Greška prilikom dodavanja u korpu: ' + error.message);
    }
  }


}
