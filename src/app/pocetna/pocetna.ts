import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router"; 

@Component({
  selector: 'app-pocetna',
  standalone: true,
  imports: [FormsModule, RouterLink], 
  templateUrl: './pocetna.html',
  styleUrls: ['./pocetna.css']
})
export class Pocetna {
  pretraga: string = ''; 
}
