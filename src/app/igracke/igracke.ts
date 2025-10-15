import { Component, signal, OnInit } from '@angular/core';
import { ToysService } from '../services/toys.service';
import { RouterLink } from '@angular/router';
import { ToyModel } from '../models/toy.model';

@Component({
  selector: 'app-igracke',
  standalone: true,
  imports: [RouterLink],
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
      })
      .catch(err => console.error('Greška pri učitavanju igračaka:', err));
  }
  
}
