import { Component, signal, OnInit } from '@angular/core';
import { ToysService } from '../services/toys.service';
import { RouterLink } from '@angular/router';
import { ToyModel } from '../models/toy.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-igracke',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './igracke.html',
  styleUrls: ['./igracke.css']
})
export class Igracke implements OnInit {

  protected toys = signal<ToyModel[]>([]);

  ngOnInit() {
    ToysService.getToys()
      .then(rsp => {
        console.log('Igračke:', rsp.data);
        this.toys.set(rsp.data);
        this.filteredToys.set(rsp.data)
      })
      .catch(err => console.error('Greška pri učitavanju igračaka:', err));
  }

  pretraga: string = '';

  protected search: string = ''; // vezano za input
  protected filteredToys = signal<ToyModel[]>([]); // ovo će prikazivati filtrirane igračke

  filterToys() {
    const slovo = this.search.toLowerCase(); // mala slova da pretraga bude case-insensitive
    if (!slovo) {
      this.filteredToys.set(this.toys()); // ako je prazno, prikazi sve
      return;
    }

    const filtered = this.toys().filter(toy =>
      toy.name.toLowerCase().includes(slovo) ||
      toy.description.toLowerCase().includes(slovo) ||
      toy.type.name.toLowerCase().includes(slovo)
    );

    this.filteredToys.set(filtered);
  }



}
