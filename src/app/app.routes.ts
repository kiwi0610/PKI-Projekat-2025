import { Routes } from '@angular/router';
import { Pocetna } from './pocetna/pocetna';
import { Igracke } from './igracke/igracke';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import {Profile} from './profile/profile';
import { Rezervisi } from './rezervisi/rezervisi';
import { Details } from './details/details';
import { Cart } from './cart/cart';


export const routes: Routes = [
    { path: 'login', title: 'Login', component: Login },
    { path: 'signup', title: 'Signup', component: Signup },
    { path: '', title: 'Početna' ,component: Pocetna },                 // Za / se podrazumeva da se tu nalazi, zato je prazno
    { path: 'igracke', title: 'Ponuda igračaka',component: Igracke },   // Isto važi i za ovaj deo, bice na putanji /about
    { path: 'profile', title: 'Profil', component: Profile},
    { path: 'detalji/:id/rezervacija', title: 'Rezervacija', component: Rezervisi},
    { path: 'detalji/:id', title: 'Detalji' , component: Details },
    { path: 'korpa', title: 'Korpa rezervacija' , component: Cart},
    { path: '**', redirectTo: '' }        // Ovde za bilo koju pogresno unetu putanju vraća na početnu stranicu
];
