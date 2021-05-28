import {Injectable} from '@angular/core';
import {
  HttpClient, HttpEvent,
  HttpHeaderResponse,
  HttpHeaders,
  HttpProgressEvent,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Trip} from '../model/trip';
import {CookieService} from 'ngx-cookie-service';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TripsService {

  private static DB_PATH = '/trips';
  private httpOptions: any;

  private readonly tripDb: AngularFireList<Trip>;

  constructor(private db: AngularFireDatabase) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.tripDb = db.list(TripsService.DB_PATH);
  }

  public getData(): AngularFireList<Trip> {
    return this.tripDb;
  }

  public getTrip(id: string): Promise<Trip> {
    return new Promise<Trip>(resolve => {
      this.tripDb.snapshotChanges().pipe(
        map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
      ).subscribe(data => {
        data.forEach(trip => {
          trip.id = trip.key;
          if (trip.id === id) {
            resolve(trip);
          }
        });
      });
    });
  }

  public getKeyFromTrip(id: string): Promise<any> {
    return new Promise<any>(resolve => {
      this.tripDb.snapshotChanges().pipe(
        map(changes => changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
      ).subscribe(data => {
        data.forEach(trip => {
          trip.id = trip.key;
          if (trip.id === id) {
            resolve(trip.key);
          }
        });
      });
    });
  }

  public update(trip: Trip): Promise<boolean> {
    return new Promise(resolve => {
      console.log(trip.id);
      this.getKeyFromTrip(trip.id).then(key => {
        const daneRef = this.db.list(TripsService.DB_PATH);
        daneRef.update(key, trip).then(() => {
          resolve(true);
        }).catch(error => {
          console.error(error);
        });
      }).catch(error => {
        console.error(error);
      });
    });

  }

  public addTrip(trip: Trip): Promise<boolean> {
    return new Promise(resolve => {
      const daneRef = this.db.list(TripsService.DB_PATH);
      daneRef.push(trip);
      resolve(true);
    });
  }

  public deleteTrip(trip: Trip): Promise<boolean> {
    return new Promise(resolve => {
      this.getKeyFromTrip(trip.id).then(key => {
        const daneRef = this.db.list(TripsService.DB_PATH);
        daneRef.remove(key).then(r => {
          resolve(true);
        });
      });
    });
  }
}
