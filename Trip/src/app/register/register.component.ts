import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthServiceService} from '../services/auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  addForm: FormGroup;

  constructor(public authService: AuthServiceService) {
    this.addForm = new FormGroup({
      name: new FormControl('Nazwa użytkownika'),
      email: new FormControl('Adres email'),
      password: new FormControl('Twoje hasło')
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const form = this.addForm.value;
    this.authService.user_doCreate(form.name, form.email, form.password);
  }
}
