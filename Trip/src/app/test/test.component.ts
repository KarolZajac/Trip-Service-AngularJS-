import { Component, OnInit } from '@angular/core';
import {AuthServiceService} from '../services/auth-service.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(public authService: AuthServiceService) { }

  ngOnInit(): void {
    this.authService.user_logout();
  }

}
