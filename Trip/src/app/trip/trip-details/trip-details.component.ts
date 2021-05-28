import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Trip} from '../../model/trip';
import {TripsService} from '../../services/trips.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.css'],
  providers: [TripsService]
})
export class TripDetailsComponent implements OnInit {
  id: string;
  trip: Trip;

  constructor(
    private route: ActivatedRoute,
    private tripsService: TripsService,
    private cookieService: CookieService
  ) {
    this.trip = null;
  }

  ngOnInit(): void {
    this.loadTrip();
  }

  private loadTrip(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id.length <= 0) {
      console.error('BAD ID OF TRIP');
      return;
    }
    this.tripsService.getTrip(this.id).then(trip => {
      this.trip = trip;
    });
  }

  voteTrip(trip: Trip, rate: number): void {
    /*if (!this.isTripInReservations(trip)) {
      return;
    }*/

    trip.rate.push(rate);
    this.tripsService.update(trip).then();
  }

  getDate(trip): Date {
    return new Date(trip[0], (trip[1] - 1), trip[2]);
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

  public addReservation(trip: Trip): void {
    if (trip.reserved >= trip.slots) {
      return;
    }
    trip.reserved++;
    this.addReservationCookie(trip);
    this.tripsService.update(trip).then((data) => {
      console.log('Zaktualizowano dane o wycieczce\n' + data);
    });
  }

  public removeReservation(trip: Trip): void {
    if (trip.reserved === trip.slots || trip.reserved <= 0) {
      return;
    }
    this.removeReservationCookie(trip);
    this.tripsService.update(trip).then((data) => {
      console.log('Zaktualizowano dane o wycieczce\n' + data);
    });
  }

  private isTripInReservations(trip: Trip): boolean {
    let isExists = false;
    if (this.hasReservationCookie(trip) !== undefined) {
      isExists = true;
    }
    return isExists;
  }

  hasReservation(trip: Trip): boolean {
    let condition = false;
    const obj = this.hasReservationCookie(trip);
    if (typeof obj !== 'undefined') {
      condition = true;
    }
    return condition;
  }

  canClickButtonAdd(trip: Trip): boolean {
    return trip.slots - trip.reserved > 0;
  }

  canClickButtonRemove(trip: Trip): boolean {
    return trip.slots !== trip.reserved && this.hasReservation(trip) && trip.reserved > 0;
  }

  private addReservationCookie(trip: Trip): void {
    if (!this.cookieService.get('CART')) {
      this.cookieService.set('CART', JSON.stringify([]), 60, '/');
    }
    const array = JSON.parse(this.cookieService.get('CART'));
    array.push(trip);
    this.cookieService.set('CART', JSON.stringify(array), 60, '/');
  }

  private removeReservationCookie(trip: Trip): void {
    if (!this.cookieService.get('CART')) {
      this.cookieService.set('CART', JSON.stringify([]), 60, '/');
    }
    const array = JSON.parse(this.cookieService.get('CART'));
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      if (trip.id === array[i].id) {
        trip.reserved--;
        array.splice(i, 1);
        this.cookieService.set('CART', JSON.stringify(array), 60, '/');
        return;
      }
    }
  }

  private hasReservationCookie(trip: Trip): Trip {
    if (!this.cookieService.get('CART')) {
      this.cookieService.set('CART', JSON.stringify([]), 60, '/');
    }
    const array = JSON.parse(this.cookieService.get('CART'));
    return array.find(x => x.id === trip.id);
  }
}
