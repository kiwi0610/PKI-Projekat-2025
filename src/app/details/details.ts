import { Component, signal } from '@angular/core';
import { ToyModel } from '../models/toy.model';
import { ActivatedRoute } from '@angular/router';
import { ToysService } from '../services/toys.service';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details {
  protected toy = signal<ToyModel | null>(null)

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params: any) => {
      console.log('PARAMS:', params); // ovo će sada biti {id: 5} npr.
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

}

