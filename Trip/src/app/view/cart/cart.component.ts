import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Trip} from '../../model/trip';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: Trip[];

  constructor(private cookieService: CookieService) {
  }

  ngOnInit(): void {
    if (!this.cookieService.get('CART')) {
      this.cookieService.set('CART', JSON.stringify([]));
    }
    this.loadCart();

  }

  loadCart(): void {
    this.cart = JSON.parse(this.cookieService.get('CART'));
  }

}
