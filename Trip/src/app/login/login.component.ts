import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthServiceService} from "../services/auth-service.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  addForm: FormGroup;

  constructor(public authService: AuthServiceService) {
    this.addForm = new FormGroup({
      email: new FormControl('Adres email'),
      password: new FormControl('Twoje hasło')
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const form = this.addForm.value;
    this.authService.user_doLogin(form.email, form.password);
  }



}
