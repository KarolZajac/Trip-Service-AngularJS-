import {AfterViewInit, Component, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {AuthServiceService} from "../../services/auth-service.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  userInfo: User;

  constructor(private authService: AuthServiceService) {

  }

  ngOnInit(): void {

  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  ngAfterViewInit(): void {
    this.authService.user_getInformation().then(data => {
      this.userInfo = data;
    });
  }

}
