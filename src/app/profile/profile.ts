import { Component, signal, OnDestroy, OnInit } from '@angular/core';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit, OnDestroy {

  protected currentUser = signal<UserModel | null>(null);
  private routerSub!: Subscription;

  constructor(private router: Router) { }

  ngOnInit() {
    // Prvi load
    this.loadUser();

    // Subscribe na svaku navigaciju da osveži profil
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadUser();
      }
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  private loadUser() {
    const active = localStorage.getItem('active');

    if (!active) {
      this.router.navigate(['/login']);
      return;
    }

    const users = UserService.getUsers();
    const found = users.find(u => u.email === active);

    if (!found) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser.set(found);
  }
}
