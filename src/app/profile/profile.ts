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
    try {
      const user = UserService.getActiveUser();
      this.currentUser.set(user);
    } catch {
      // Ako nema aktivnog korisnika → preusmeri na login
      this.router.navigate(['/login']);
    }
  }
}
