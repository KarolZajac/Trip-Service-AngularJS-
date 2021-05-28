import { Component, OnInit } from '@angular/core';
import {AuthServiceService} from '../../services/auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authProvider: AuthServiceService) { }

  ngOnInit(): void {
  }

}
