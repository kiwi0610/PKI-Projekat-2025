import { Component, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  protected profileForm: FormGroup;
  protected passwordForm: FormGroup;
  protected currentUser = signal<UserModel | null>(null);
  protected toyTypes = signal<string[]>([]);
  protected editing = signal<boolean>(false); 

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      toyType: ['', Validators.required]
    });

    this.passwordForm = this.formBuilder.group({
      current: ['', Validators.required],
      new: ['', Validators.required],
      repeat: ['', Validators.required]
    });
  }

  async ngOnInit() {
    try {
      const user = UserService.getActiveUser();
      this.currentUser.set(user);

      const rsp = await MainService.getToyTypes();
      this.toyTypes.set(rsp.data);

 
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        toyType: user.toyType.name
      });

 
      this.profileForm.disable();
    } catch {
      this.router.navigate(['/login']);
    }
  }

  protected onEditClick() {
    this.editing.set(true);
    this.profileForm.enable();
  }


  protected onProfileSubmit() {
    if (!this.profileForm.valid) {
      alert('Forma nije ispravna!');
      return;
    }

    const user = this.currentUser()!;
    const updated: UserModel = {
      ...user,
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      phone: this.profileForm.value.phone,
      toyType: {
        typeId: this.toyTypes().indexOf(this.profileForm.value.toyType),
        name: this.profileForm.value.toyType,
        description: ''
      }
    };

    UserService.updateUser(updated);
    this.currentUser.set(updated);
    this.editing.set(false);
    this.profileForm.disable();
    alert('Podaci su uspešno sačuvani!');
  }


  protected onPasswordSubmit() {
    if (!this.passwordForm.valid) {
      alert('Popunite sva polja!');
      return;
    }

    const { current, new: newPass, repeat } = this.passwordForm.value;
    const user = this.currentUser()!;

    if (current !== user.password) {
      alert('Trenutna lozinka nije ispravna!');
      return;
    }
    if (newPass !== repeat) {
      alert('Nove lozinke se ne poklapaju!');
      return;
    }

   
    user.password = newPass;
    UserService.updateUser(user);
    this.currentUser.set(user);

    alert('Lozinka je uspešno promenjena! Bićete preusmereni na login.');
    UserService.logout();
    this.router.navigateByUrl('/login');
  }
}
