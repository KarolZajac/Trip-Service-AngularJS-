import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {TripsService} from '../services/trips.service';
import {Trip} from '../model/trip';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-trip-management',
  templateUrl: './trip-management.component.html',
  styleUrls: ['./trip-management.component.css']
})
export class TripManagementComponent implements OnInit {

  selectTrip: FormGroup;
  trips: Trip[];

  selectedTrip: Trip;
  tripForm: FormGroup;

  constructor(private tripProvider: TripsService) {
    this.trips = [];
    this.selectedTrip = null;

    this.selectTrip = new FormGroup({
      trip: new FormControl(0)
    });
    let temp: Trip;
    tripProvider.getData().snapshotChanges().pipe(
      map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
    ).subscribe(data => {
      data.forEach((trip) => {
        temp = trip;
        temp.id = trip.key;
        if (typeof temp.rate === 'undefined') {
          temp.rate = [];
        }
        this.trips.push(temp);
      });
    });

  }


  changedSelectTrip(): void {

    this.selectedTrip = this.trips[this.selectTrip.value.trip];
    this.tripForm = new FormGroup({
      name: new FormControl(this.selectedTrip.name),
      country: new FormControl(this.selectedTrip.country),
      startDate: new FormControl(this.getDate(this.selectedTrip.dateStart)),
      endDate: new FormControl(this.getDate(this.selectedTrip.dateEnd)),
      slots: new FormControl(this.selectedTrip.slots),
      price: new FormControl(this.selectedTrip.price),
      description: new FormControl(this.selectedTrip.description),
      imageURL: new FormControl(this.selectedTrip.image)
    });
  }


  getDate(trip): string {
    return `${trip[0]}.${trip[2]}.${trip[1]}`;
  }

  onSubmit(): void {
    const form = this.tripForm.value;
    const trip = new Trip();
    trip.id = this.selectedTrip.id;
    trip.name = form.name;
    trip.country = form.country;
    trip.dateStart = form.startDate.split('.');
    trip.dateEnd = form.endDate.split('.');
    trip.slots = parseInt(form.slots);
    trip.reserved = this.selectedTrip.reserved;
    trip.image = form.imageURL;
    trip.rate = this.selectedTrip.rate;
    trip.price = parseInt(form.price);
    trip.description = form.description;
    this.tripProvider.update(trip).then(() => {
      console.log('check');
    });
  }

  ngOnInit(): void {
    this.tripForm = new FormGroup({
      name: new FormControl('Wycieczka do...'),
      country: new FormControl('Kraj'),
      startDate: new FormControl('2020.12.05'),
      endDate: new FormControl('2020.13.05'),
      slots: new FormControl('Number of Slots'),
      price: new FormControl('Price'),
      description: new FormControl('Description'),
      imageURL: new FormControl('Trip Image (URL)')

    });

  }

}
