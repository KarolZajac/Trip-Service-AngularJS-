import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Trip} from '../../model/trip';
import {TripsService} from '../../services/trips.service';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})
export class AddFormComponent implements OnInit {

  addForm: FormGroup;

  constructor(private tripService: TripsService) {
  }

  ngOnInit(): void {
    this.addForm = new FormGroup({
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

  onSubmit(): void {

    const form = this.addForm.value;
    const trip = new Trip();
    trip.name = form.name;
    trip.country = form.country;
    trip.dateStart = form.startDate.split('.');
    trip.dateEnd = form.endDate.split('.');
    trip.slots = parseInt(form.slots);
    trip.reserved = 0;
    trip.image = form.imageURL;
    trip.rate = [];
    trip.price = parseInt(form.price);
    trip.description = form.description;
    this.tripService.addTrip(trip).then(() => {
      window.location.reload();
    });
  }
}
