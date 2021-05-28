import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TripComponent } from './trip/trip.component';
import {CookieService} from 'ngx-cookie-service';
import { AddFormComponent } from './trip/add-form/add-form.component';
import { CartComponent } from './view/cart/cart.component';
import {environment} from '../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireModule} from '@angular/fire';
import {AppRoutingModule, routes} from './app-routing.module';
import {RouterModule} from '@angular/router';
import { TripDetailsComponent } from './trip/trip-details/trip-details.component';
import { HeaderComponent } from './static/header/header.component';
import { FooterComponent } from './static/footer/footer.component';
import { HomeComponent } from './view/home/home.component';
import { AddTripComponent } from './view/add-trip/add-trip.component';
import {ReactiveFormsModule} from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AuthServiceService} from './services/auth-service.service';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { ACPHomeComponent } from './acp/acphome/acphome.component';
import { TestComponent } from './test/test.component';
import { TripManagementComponent } from './trip-management/trip-management.component';
@NgModule({
  declarations: [
    AppComponent,
    TripComponent,
    AddFormComponent,
    CartComponent,
    TripDetailsComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AddTripComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    ProfileComponent,
    ACPHomeComponent,
    TestComponent,
    TripManagementComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
  ],
  providers: [CookieService, AuthServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
