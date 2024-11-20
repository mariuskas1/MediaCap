import { Component, Inject, inject} from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Film } from './../../models/film.class';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSliderModule} from '@angular/material/slider';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';





@Component({
  selector: 'app-add-film-dialog',
  standalone: true,
  imports: [MatCheckboxModule, MatIconModule, MatSelectModule, MatSliderModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatProgressBarModule],
  templateUrl: './add-film-dialog.component.html',
  styleUrl: './add-film-dialog.component.scss'
})
export class AddFilmDialogComponent {
  film: Film = new Film();
  loading = false;

  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  years: number[] = [2025, 2024, 2023, 2022];
  userId: string | null = null;
  firestore: Firestore = inject(Firestore);


  constructor(public dialogRef: MatDialogRef<AddFilmDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { month: string; year: number; userId: string}){
      this.film.yearWatched = data.year;
      this.film.monthWatched = data.month;
      this.userId = data.userId;
    }

  async addFilm(){
    this.loading = true;
    this.film.timestamp = Date.now();

    try{
      const filmsCollection = collection(this.firestore, `films/${this.userId}/userFilms` );
      await addDoc(filmsCollection, { ...this.film});
      this.loading = false;
      this.film = new Film();
      this.dialogRef.close();
    } catch (err){
      console.error(err);
    }
  }


  closeDialog(){
    this.dialogRef.close()
  }


  

 
}
