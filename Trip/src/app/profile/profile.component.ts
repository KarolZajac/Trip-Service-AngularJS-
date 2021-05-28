import { Component, OnInit } from '@angular/core';
import {User} from "../model/user";
import {AuthServiceService} from "../services/auth-service.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private authService: AuthServiceService) { }
  userInfo: User;
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.authService.user_getInformation().then(data => {
      this.userInfo = data;
    });
  }

}
