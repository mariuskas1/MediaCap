import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';


@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [RouterModule, RouterOutlet, MatToolbarModule],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.scss'
})
export class LoginLayoutComponent {
  showLogo = true;
  users: any[] = [];
  rememberedUser = false;
  rememberedUserId = '';

  ngOnInit(){
    this.subscribeToUsersCollection();

    setTimeout(() => {
      if(this.rememberedUser){
        this.router.navigate([`/main/${this.rememberedUserId}`]); 
      } else{
        this.showLogo = false;
      }
    }, 2000)
  }

  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog, private router: Router){}


  subscribeToUsersCollection(){
    const usersCollection = collection(this.firestore, 'users');
    collectionData(usersCollection, { idField: 'id' }).subscribe((data) => {
      this.users = data;
      this.checkForRememberedUser();
    });
  }

  checkForRememberedUser(): void {  
    const rememberedUser = localStorage.getItem('rememberedUser');
      if (rememberedUser) {
        const rememberedEmail = JSON.parse(rememberedUser).email;
        const rememberedUserDoc = this.users.find((user) => user.email === rememberedEmail);
      
        if (rememberedUserDoc) {
          this.rememberedUser = true;
          this.rememberedUserId = rememberedUserDoc.id;
        } else {
          this.rememberedUser = false;
        }
      }
  }
  
}
