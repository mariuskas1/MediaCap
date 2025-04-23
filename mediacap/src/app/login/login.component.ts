import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegisterDialogComponent } from './register-dialog/register-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, MatDialogModule, MatCheckboxModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  rememberUser = false;
  logInEmail: string = '';
  logInPassword: string = '';
  users: any[] = [];
  logInFailed = false;

  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog, private router: Router){}


  openRegisterDialog(){
    this.dialog.open(RegisterDialogComponent);
  }

  ngOnInit(){
    this.subscribeToUsersCollection();
  }

  subscribeToUsersCollection(){
    const usersCollection = collection(this.firestore, 'users');
    collectionData(usersCollection, { idField: 'id' }).subscribe((data) => {
      this.users = data;
    });
  }

 

  logIn(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.valid) {
      const user = this.users.find(
        (user) => user.email === this.logInEmail && user.password === this.logInPassword
      );
  
      if (user && this.rememberUser) {
          this.logInFailed = false;
          localStorage.setItem('rememberedUser', JSON.stringify({ email: this.logInEmail }));
          this.router.navigate([`/main/${user.id}`]); 
      } else if (user && !this.rememberUser){
        console.log(user);
        this.logInFailed = false;
        this.router.navigate([`/main/${user.id}`]); 
      } else if (!user){
        this.logInFailed = true;
      }
    }
  }


  
  

}
