import { Component, signal } from '@angular/core';
import { MainService } from '../services/main.service';
//import { NgClass } from "../../../node_modules/@angular/common/common_module.d";

@Component({
  selector: 'app-signup',
  imports: [/*NgClass*/],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  protected toyTypes = signal<string[]>([])

  constructor()
  {
    MainService.getToyTypes()
    .then( rsp =>this.toyTypes.set(rsp.data))
  }
}
