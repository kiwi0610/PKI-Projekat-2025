import { Routes } from '@angular/router';
import { Pocetna } from './pocetna/pocetna';
import { Igracke } from './igracke/igracke';

export const routes: Routes = [
    //{ path: 'login', component: Login },
    //{ path: 'signup', component: Signup },
    { path: '', title: 'Početna' ,component: Pocetna },                 // Za / se podrazumeva da se tu nalazi, zato je prazno
    { path: 'igracke', title: 'Ponuda igračaka',component: Igracke },   // Isto važi i za ovaj deo, bice na putanji /about
    //{ path: 'questions', component: Question},
    //{ path: 'profile', component: Profile},
    { path: '**', redirectTo: '' }        // Ovde za bilo koju pogresno unetu putanju vraća na početnu stranicu
];
