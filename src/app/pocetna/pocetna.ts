import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-pocetna',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './pocetna.html',
  styleUrls: ['./pocetna.css']
})
export class Pocetna {
  pretraga: string = ''; 
}
