import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FormsModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Projekat-PKI-2025');
  pretraga: string = '';
  
  constructor (protected router:Router){}
  hasAuth()
  {
    if (localStorage.getItem('active'))
      return true
    return false
  }

  logoutNow()
  {
    if(!confirm(`Da li ste sigurni da želite da se izlogujete sada?`)) return
    UserService.logout()
    this.router.navigateByUrl('/login')
  }
}
