import { Component, signal } from '@angular/core';
import { MainService } from '../services/main.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  protected form: FormGroup
  protected toyTypes = signal<string[]>([])

  constructor(private formBuilder: FormBuilder, protected router: Router) {
    MainService.getToyTypes()
      .then(rsp => this.toyTypes.set(rsp.data))

    this.form = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        password: ['', Validators.required],
        repeat: ['', Validators.required],
        toyType: ['', Validators.required]
      })
  }

  onSubmit() {
    if (!this.form.valid) {
      alert('Forma nije ispravno popunjena!');
      return;
    }
    if (this.form.value.password !== this.form.value.repeat) {
      alert('Šifre se ne poklapaju!');
      return;
    }

    try {
      const formValue: any = this.form.value
      delete formValue.repeat
      
      formValue.toyType = {
        typeId: this.toyTypes().indexOf(this.form.value.toyType) + 1,
        name: this.form.value.toyType,
        description: ''
      }
      
      UserService.signup(formValue);
      alert('Nalog je uspešno kreiran!');
      this.router.navigateByUrl('/login');
      
    } catch (e) {
     
    }
  }
}