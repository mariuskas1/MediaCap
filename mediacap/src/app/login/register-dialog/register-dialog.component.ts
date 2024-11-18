import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, NgForm } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { User } from './../../models/user.class';


@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatProgressBarModule],
  templateUrl: './register-dialog.component.html',
  styleUrl: './register-dialog.component.scss'
})
export class RegisterDialogComponent {
  loading = false;
  user: User = new User();

  firestore: Firestore = inject(Firestore);

  constructor(public dialogRef:MatDialogRef<RegisterDialogComponent>){}


  closeDialog(){
    this.dialogRef.close()
  }

  async saveUser(ngForm: NgForm){
    if(ngForm.submitted && ngForm.valid){
      this.loading = true;

      try {
        const usersCollection = collection(this.firestore, 'users');
        await addDoc(usersCollection, { ...this.user});
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
        ngForm.resetForm();
        this.dialogRef.close();
      }
    }

  }
}
