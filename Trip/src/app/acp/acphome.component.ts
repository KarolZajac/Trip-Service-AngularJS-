import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from '../../model/user';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-acphome',
  templateUrl: './acphome.component.html',
  styleUrls: ['./acphome.component.css']
})
export class ACPHomeComponent implements OnInit {
  formSettings: FormGroup;
  formUser: FormGroup[];
  users: User[];

  constructor(private fs: AngularFirestore) {
    this.users = [];
    this.formUser = [];
    this.formSettings = new FormGroup({
      session: new FormControl(0)
    });

    this.loadUsers();
  }

  loadUsers(): void {
    let tmp;
    this.fs.collection('users').get().toPromise().then(data => {
      data.docs.map((doc) => {
        const db = doc.data();
        return {db};
      }).forEach((user: any) => {
        tmp = new User();
        tmp.role = user.db.role;
        tmp.name = user.db.name;
        tmp.email = user.db.email;
        tmp.uid = user.db.uid;
        this.formUser[user.db.uid] = new FormGroup({
          role: new FormControl(this.getRoleNumberFromText(user.db.role))
        });
        this.users.push(tmp);
      });
    });
  }

  userRoleChanged(user: User): void {
    console.log(this.getRoleTextFromNumber(this.formUser[user.uid].value.role));
    this.fs.doc(`users/${user.uid}`).set(
      {
        name: user.name,
        email: user.email,
        role: this.getRoleTextFromNumber(parseInt(this.formUser[user.uid].value.role)),
        uid: user.uid
      }).then(() => {
      console.log('USER SAVED');
    }).catch((err) => {
      window.alert(err.message);
    });
  }

  getRoleTextFromNumber(role: number): string {
    let roleName = 'reader';
    switch (role) {
      case 0:
        roleName = 'admin';
        break;
      case 1:
        roleName = 'employee';
        break;
      case 2:
        roleName = 'vip';
        break;
      case 3:
        roleName = 'reader';
        break;
    }
    return roleName;
  }

  getRoleNumberFromText(role: string): number {
    switch (role) {
      case 'admin':
        return 0;
      case 'employee':
        return 1;
      case 'vip':
        return 2;
      case 'reader':
        return 3;
    }
  }

  onSettingsSubmit(): void {
    this.fs.doc<any>(`settings/0`).set({session: this.formSettings.value.session}).then(() => {
      console.log(`SETTINGS SAVED!`);
    }).catch((error) => {
      window.alert(error.message);
    });
  }

  ngOnInit(): void {
  }

}
