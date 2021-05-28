import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes} from '@angular/router';
import {TripDetailsComponent} from './trip/trip-details/trip-details.component';
import {AddTripComponent} from './view/add-trip/add-trip.component';
import {HomeComponent} from './view/home/home.component';
import {CartComponent} from './view/cart/cart.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './guard/auth.guard';
import {LogoutComponent} from './logout/logout.component';
import {NotauthGuard} from './guard/notauth.guard';
import {ProfileComponent} from './profile/profile.component';
import {ACPHomeComponent} from './acp/acphome/acphome.component';
import {AdminGuardGuard} from './guard/admin-guard.guard';
import {TestComponent} from './test/test.component';
import {EmployeeAdminGuard} from './guard/employee-admin-guard.service';
import {TripManagementComponent} from "./trip-management/trip-management.component";

export const routes: Routes = [


  {path: 'home', component: HomeComponent},
  {path: 'addNewTrip', component: AddTripComponent, canActivate: [EmployeeAdminGuard]},
  {path: 'tripManagement', component: TripManagementComponent, canActivate: [EmployeeAdminGuard]},
  {path: 'cart', component: CartComponent},
  {path: 'trip/:id', component: TripDetailsComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'user/register', component: RegisterComponent, canActivate: [NotauthGuard]},
  {path: 'user/login', component: LoginComponent, canActivate: [NotauthGuard]},
  {path: 'user/logout', component: LogoutComponent, canActivate: [AuthGuard]},
  {path: 'user/profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'acp', component: ACPHomeComponent, canActivate: [AdminGuardGuard]},
  {path: 'test', component: TestComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AppRoutingModule {
}
