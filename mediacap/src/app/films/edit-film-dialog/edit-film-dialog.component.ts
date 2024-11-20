import { Component, Inject, inject} from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Film } from './../../models/film.class';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDoc, doc, updateDoc } from '@angular/fire/firestore';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSliderModule} from '@angular/material/slider';
import { MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-edit-film-dialog',
  standalone: true,
  imports: [MatCheckboxModule, MatIconModule, MatSelectModule, MatSliderModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatProgressBarModule],
  templateUrl: './edit-film-dialog.component.html',
  styleUrl: './edit-film-dialog.component.scss'
})
export class EditFilmDialogComponent {
  film: Film = new Film();
  loading = false;

  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  years: number[] = [2025, 2024, 2023, 2022];
  userId: string | null = null;
  firestore: Firestore = inject(Firestore);
  filmId: string | null = null;

  filmGenres: string[] = [
    'Action', 'Adventure', 'Arthouse',  'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 
    'Drama', 'Family', 'Fantasy',  'Film-Noir', 'History', 'Indie', 'Horror', 'Musical', 'Mystery', 
    'Romance', 'Sci-Fi', 'Sport', 'Suspense', 'Thriller', 'War',  'Western'
  ];

  constructor(public dialogRef: MatDialogRef<EditFilmDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { filmId: string; userId: string}){ 
      this.userId = data.userId;
      this.filmId = data.filmId;
      this.getFilmData();
  }

  async getFilmData(){
    try {
      const filmDocRef = doc(this.firestore, `films/${this.userId}/userFilms/${this.filmId}`);
      const docSnapshot = await getDoc(filmDocRef);
      this.film = { ...this.film, ...docSnapshot.data() } as Film;
    } catch (err) {
      console.error('Failed to fetch film data:', err);
    }
  }


  async editFilm(){
    this.loading = true;
    try {
      const filmDocRef = doc(this.firestore, `films/${this.userId}/userFilms/${this.filmId}`);
      await updateDoc(filmDocRef, { ...this.film });
      this.loading = false;
      this.dialogRef.close();
    } catch (err) {
      console.error('Failed to edit film:', err);
    }
  }


  closeDialog(){
    this.dialogRef.close()
  }


}
