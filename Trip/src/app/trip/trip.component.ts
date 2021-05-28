import {Component, ViewChild} from '@angular/core';
import {TripsService} from '../services/trips.service';
import {Trip} from '../model/trip';
import {Observable} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {map} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';
import {AuthServiceService} from '../services/auth-service.service';
import {User} from "../model/user";

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css'],
  providers: [TripsService]
})
export class TripComponent {

  trips: Trip[];
  filteredTrips: Trip[];
  tripMin: Trip;
  tripMax: Trip;
  error: number;
  @ViewChild('stars', {static: false})
  stars: HTMLElement;

  userInfo: User;
  orderForm: FormGroup;

  constructor(
              private tripService: TripsService,
              private cookieService: CookieService,
              private authProvider: AuthServiceService) {
    this.orderForm = new FormGroup({
      orderby: new FormControl([]),
      filter: new FormControl(0),
      pricemin: new FormControl(0),
      pricemax: new FormControl(0),
      ratemin: new FormControl(0),
      ratemax: new FormControl(5),
      startDate: new FormControl('2020.12.09'),
      endDate: new FormControl('2020.12.15'),
    });
    this.error = 0;
    this.filteredTrips = [];
    this.loadTrips();
    authProvider.user_getInformation().then(user => {
      this.userInfo = user;
    });
  }

  private loadTrips(): Promise<any> {
    return new Promise(resolve => {
      this.authProvider.user_getInformation().then(userData => {
        let temp: Trip;
        this.tripService.getData().snapshotChanges().pipe(
          map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
        ).subscribe(data => {
          this.trips = [];
          if (data.length === 0) {

            this.error = 1;
            return;
          }
          data.forEach((trip) => {
            temp = trip;
            temp.id = trip.key;
            if (typeof temp.rate === 'undefined') {
              temp.rate = [];
            }
            let err = 0;

            if (userData === null || userData.role === 'reader') {
              if (temp.slots === temp.reserved) {
                err++;
              } else if (this.getDate(temp.dateStart).valueOf() < Date.now().valueOf()) {
                err++;
              }
            }
            if (err === 0) {
              this.trips.push(temp);
            }
          });
          this.filteredTrips = Object.assign([], this.trips);
          this.getMinMaxTrip();
          resolve(true);
        });

      });
    });
  }

  useFilter(): void {
    this.filteredTrips = Object.assign([], this.trips);
    this.orderForm.value.orderby.forEach(order => {
      if (order === '0') {
        this.filteredTrips = Object.assign([], this.trips);
      } else if (order === '1') {
        this.filteredTrips = this.filteredTrips.filter(element =>
          element.country === this.getUniqueCountries()[this.orderForm.value.filter]);
      } else if (order === '2') {
        this.filteredTrips = this.filteredTrips.filter(element =>
          element.price >= this.orderForm.value.pricemin && element.price <= this.orderForm.value.pricemax);
      } else if (order === '3') {
        this.filteredTrips = this.filteredTrips.filter(element => this.isTripInDateRange(element));
      } else if (order === '4') {
        this.filteredTrips = this.filteredTrips.filter(element => this.getRateOf(element.rate) >= this.orderForm.value.ratemin
          && this.getRateOf(element.rate) <= this.orderForm.value.ratemax);
      }
    });
  }

  isFilterSelected(selected: number): boolean {
    const obj = this.orderForm.value.orderby.find(x => x === selected.toString());
    if (typeof obj !== 'undefined') {
      return true;
    }
    return false;
  }

  private isTripInDateRange(element: Trip): boolean {
    const elementStart = this.getDate(element.dateStart).getTime();
    const elementEnd = this.getDate(element.dateEnd).getTime();

    let input = this.orderForm.value.startDate.split('.');
    const filterStart = this.getDate(input).getTime();

    input = this.orderForm.value.endDate.split('.');
    const filterEnd = this.getDate(input).getTime();

    return elementStart >= filterStart && elementEnd <= filterEnd;
  }

  getUniqueCountries(): string[] {
    const countries = new Array<string>();
    this.trips.forEach(trip => {
      if (countries.length > 0) {
        const object = countries.find(country => country === trip.country);
        if (typeof object === 'undefined') {
          countries.push(trip.country);
        }
      } else {
        countries.push(trip.country);
      }
    });
    return countries;
  }

  canClickButtonAdd(trip: Trip): boolean {
    return trip.slots - trip.reserved > 0;
  }

  canClickButtonRemove(trip: Trip): boolean {
    return trip.slots !== trip.reserved && this.hasReservation(trip) && trip.reserved > 0;
  }

  hasReservation(trip: Trip): boolean {
    let condition = false;
    const obj = this.hasReservationCookie(trip);
    if (typeof obj !== 'undefined') {
      condition = true;
    }
    return condition;
  }

  getDate(trip): Date {
    return new Date(trip[0], (trip[1] - 1), trip[2]);
  }

  private getMinMaxTrip(): void {
    const temp = Object.assign([], this.trips);
    if (temp.length < 2) {
      this.tripMin = temp[0];
      this.tripMax = temp[0];
    }
    temp.sort((a: Trip, b: Trip) => a.price - b.price);

    this.tripMin = temp[0];
    this.tripMax = temp[temp.length - 1];
    this.orderForm = new FormGroup({
      orderby: new FormControl([]),
      filter: new FormControl(0),
      pricemin: new FormControl(this.tripMin.price),
      pricemax: new FormControl(this.tripMax.price),
      ratemin: new FormControl(0),
      ratemax: new FormControl(5),
      startDate: new FormControl('2020.12.09'),
      endDate: new FormControl('2020.12.15'),
    });
  }

  public addReservation(trip: Trip): void {
    if (trip.reserved >= trip.slots) {
      return;
    }
    trip.reserved++;
    this.addReservationCookie(trip);
    this.tripService.update(trip).then((data) => {
      console.log('Zaktualizowano dane o wycieczce\n' + data);
    });
  }

  public removeReservation(trip: Trip): void {
    if (trip.reserved === trip.slots || trip.reserved <= 0) {
      return;
    }
    this.removeReservationCookie(trip);
    this.tripService.update(trip).then((data) => {
      console.log('Zaktualizowano dane o wycieczce\n' + data);
    });
  }

  deleteTrip(trip: Trip): void {
    this.tripService.deleteTrip(trip).then((data) => {
      this.trips = this.trips.filter(item => item !== trip);
      this.filteredTrips = Object.assign([], this.trips);
    });
  }

  voteTrip(trip: Trip, rate: number): void {
    if (!this.isTripInReservations(trip)) {
      return;
    }

    trip.rate.push(rate);
    this.tripService.update(trip).then();
  }

  private isTripInReservations(trip: Trip): boolean {
    let isExists = false;
    if (this.hasReservationCookie(trip) !== undefined) {
      isExists = true;
    }
    return isExists;
  }

  getRateOf(array: number[]): number {
    if (array.length === 0) {
      return 0;
    }
    let sum = 0;
    array.forEach(element => {
      sum += element;
    });

    /*return Math.round((sum / array.length + Number.EPSILON) * 100) / 100;*/
    return parseFloat((sum / array.length).toFixed(2));
  }

  isNotUndefined(element): boolean {
    return typeof element !== 'undefined';
  }


  private addReservationCookie(trip: Trip): void {
    if (!this.cookieService.get('CART')) {
      this.cookieService.set('CART', JSON.stringify([]));
    }
    const array = JSON.parse(this.cookieService.get('CART'));
    array.push(trip);
    this.cookieService.set('CART', JSON.stringify(array));
  }

  private removeReservationCookie(trip: Trip): void {
    if (!this.cookieService.get('CART')) {
      this.cookieService.set('CART', JSON.stringify([]));
    }
    const array = JSON.parse(this.cookieService.get('CART'));
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      if (trip.id === array[i].id) {
        trip.reserved--;
        array.splice(i, 1);
        this.cookieService.set('CART', JSON.stringify(array));
        return;
      }
    }
  }

  public havePowerToDelete(): boolean {
    return this.userInfo && this.userInfo.role === 'admin';
  }

  private hasReservationCookie(trip: Trip): Trip {
    if (!this.cookieService.get('CART')) {
      this.cookieService.set('CART', JSON.stringify([]));
    }
    const array = JSON.parse(this.cookieService.get('CART'));
    return array.find(x => x.id === trip.id);
  }
}
