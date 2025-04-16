import { Component, Inject, inject} from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Book } from '../../models/book.class';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSliderModule} from '@angular/material/slider';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Film } from '../../models/film.class';

@Component({
  selector: 'app-add-book-dialog',
  standalone: true,
  imports: [MatCheckboxModule, MatIconModule, MatSelectModule, MatSliderModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatProgressBarModule],
  templateUrl: './add-book-dialog.component.html',
  styleUrl: './add-book-dialog.component.scss'
})
export class AddBookDialogComponent {

  book: Book = new Book();
  loading = false;
  
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
    years: number[] = [2025, 2024, 2023, 2022];
    userId: string | null = null;
    firestore: Firestore = inject(Firestore);
  
    bookGenres: string[] = [
      'Action', 'Adventure', 'Arthouse',  'Animation', 'Biography', 'Classic','Comedy', 'Crime', 'Documentary', 
      'Drama', 'Family', 'Fantasy', 'History', 'Indie', 'Horror', 'Mystery', 
      'Romance', 'Sci-Fi', 'Sport', 'Suspense', 'Thriller', 'War',  'Western'
    ];


    constructor(public dialogRef: MatDialogRef<AddBookDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data: { month: string; year: number; userId: string; title: string}){
          this.book.yearRead = data.year;
          this.book.monthRead = data.month;
          this.userId = data.userId;
          this.book.title = data.title;
    }

  async addBook(){
    this.loading = true;
    this.book.timestamp = Date.now();

    try{
      const booksCollection = collection(this.firestore, `books/${this.userId}/userBooks` );
      await addDoc(booksCollection, { ...this.book});
      this.loading = false;
      this.book = new Book();
      this.dialogRef.close();
    } catch (err){
      console.error(err);
    }
  }


  closeDialog(){
    this.dialogRef.close()
  }
}
