import { Component, signal } from '@angular/core';
import { ToyModel } from '../models/toy.model';
import { ActivatedRoute } from '@angular/router';
import { ToysService } from '../services/toys.service';

@Component({
  selector: 'app-rezervisi',
  imports: [],
  templateUrl: './rezervisi.html',
  styleUrl: './rezervisi.css'
})
export class Rezervisi {

  protected toy = signal<ToyModel | null>(null)

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params: any) => {
      // console.log('PARAMS:', params); // ovo će sada biti {id: 5} npr.
      ToysService.getToysById(params.id)  // <-- koristimo "id", ne "toyId"
        .then(rsp => this.toy.set(rsp.data))
        .catch(err => console.error(err));
    });
  }


  convertToString() {
    return JSON.stringify(this.toy(), null, 2)
  }

  protected formatDate(iso: string) {
    return new Date(iso).toLocaleString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  start: number = 1;

increaseStart() {
  this.start++;
}

decreaseStart() {
  if (this.start > 1) {
    this.start--;
  }
}

// Ako u korpi već postoji item, samo povećaj količinu, nemoj da kopiraš dva puta

addToCart(toy: any) {
  const kolicina = toy.kolicina || 1;
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  const postoji = cart.find((item: any) => item.toyId === toy.toyId);

  if (postoji) {
    postoji.quantity += kolicina;
  } else {
    cart.push({
      toyId: toy.toyId,
      name: toy.name,
      price: toy.price,
      imageUrl: toy.imageUrl,
      quantity: kolicina
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${toy.name} (${kolicina} kom) dodat u korpu!`);
}


}

