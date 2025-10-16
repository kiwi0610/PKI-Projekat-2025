import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { UserService } from '../services/user.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  protected form: FormGroup

  constructor(private formBuilder: FormBuilder, protected router: Router) {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
      })
  }
  onSubmit() {
    if (!this.form.valid) {
      alert('Forma nije ispravna!')
      return
    }
    try {
      UserService.login(this.form.value.email, this.form.value.password)
      const url = sessionStorage.getItem(`ref`) ?? `profile`
      sessionStorage.removeItem(`ref`)
      this.router.navigateByUrl(url)

    } catch (e) {
      alert('Proverite Vaše parametre za prijavljivanje!')
    }
  }
}
