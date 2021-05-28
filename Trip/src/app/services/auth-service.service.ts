import {Injectable, NgZone} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  userData: any;
  session: number;

  constructor(
    private fs: AngularFirestore,
    private auth: AngularFireAuth,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.session = 0;
    this.fs.doc<any>(`settings/0`).get().toPromise().then((settings) => {
      this.session = parseInt(settings.data().session);
      this.auth.authState.subscribe(user => {
        if (this.session === 0) {
          if (user) {
            this.userData = user;
            localStorage.setItem('userData', JSON.stringify(this.userData));
          } else {
            localStorage.setItem('userData', null);
          }
        } else {
          if (user) {
            this.userData = user;
            sessionStorage.setItem('userData', JSON.stringify(this.userData));
          } else {
            sessionStorage.setItem('userData', null);
          }
        }
      });
    });
  }

  public user_getInformation(): Promise<User> {
    return new Promise<User>(response => {
      if (this.isLoggedIn) {
        let uid;
        if (this.session === 0) {
          uid = JSON.parse(localStorage.getItem('userData')).uid;
        } else {
          uid = JSON.parse(sessionStorage.getItem('userData')).uid;
        }
        this.fs.doc<User>(`users/${uid}`).get().toPromise().then((userData) => {
          if (userData.exists) {
            response(userData.data());
          }
        });
      } else {
        response(null);
      }
    });
  }

  public user_getInformationByUid(uid: string): Promise<User> {
    return new Promise<User>(response => {
      this.fs.doc<User>(`users/${uid}`).get().toPromise().then((userData) => {
        if (userData.exists) {
          response(userData.data());
        } else {
          console.log("test");
          response(null);
        }
      });
    });
  }

  get isLoggedIn(): boolean {
    let user = null;
    if (this.session === 0) {
      user = JSON.parse(localStorage.getItem('userData'));
    } else {
      user = JSON.parse(sessionStorage.getItem('userData'));
    }
    return user !== null;
  }

  public user_doLogin(email: string, password: string): any {
    return this.auth.signInWithEmailAndPassword(email, password).then(userData => {
      this.user_getInformationByUid(userData.user.uid).then(data => {
        this.user_load(data, data.name);
        
        this.ngZone.run(() => {
          this.router.navigate(['user/profile']);
        });
      });

    }).catch((err) => {
      window.alert(err.message);
    });
  }

  public user_doCreate(name: string, email: string, password: string): any {
    return this.auth.createUserWithEmailAndPassword(email, password).then(userData => {
      this.user_load(userData.user, name).then(() => {
        this.ngZone.run(() => {
          window.location.href = 'user/profile';
        });
      });
    }).catch((error) => {
      window.alert(error.message);
    });
  }

  public user_load(user: any, name: string): any {
    const userRef: AngularFirestoreDocument<any> = this.fs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      name,
      role: user.role
    };
    if (this.session === 0) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('userData', JSON.stringify(this.userData));
    }
    return userRef.set(userData, {
      merge: true
    });
  }

  public user_logout(): any {
    return this.auth.signOut().then(() => {
      if (this.session === 0) {
        localStorage.removeItem('userData');
      } else {
        sessionStorage.removeItem('userData');
      }
      window.location.href = '/user/login';
    });
  }

}
