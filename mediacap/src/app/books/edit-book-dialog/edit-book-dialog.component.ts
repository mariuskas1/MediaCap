import { Component, Inject, inject} from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Book } from '../../models/book.class';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDoc, doc, updateDoc } from '@angular/fire/firestore';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSliderModule} from '@angular/material/slider';
import { MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule} from '@angular/material/checkbox';


@Component({
  selector: 'app-edit-book-dialog',
  standalone: true,
  imports: [MatCheckboxModule, MatIconModule, MatSelectModule, MatSliderModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatProgressBarModule],
  templateUrl: './edit-book-dialog.component.html',
  styleUrl: './edit-book-dialog.component.scss'
})
export class EditBookDialogComponent {

  book: Book = new Book();
  loading = false;

  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  years: number[] = [2025, 2024, 2023, 2022];
  userId: string | null = null;
  firestore: Firestore = inject(Firestore);
  bookId: string | null = null;

  bookGenres: string[] = [
    'Adventure', 'Autobiography', 'Biography', 'Classic', 'Comedy', 'Crime',
    'Drama', 'Fantasy', 'Graphic Novel', 'History', 'Horror', 'Indie',
    'Literary', 'Memoir', 'Mystery', 'Non-fiction', 'Poetry', 'Romance',
    'Sci-Fi', 'Sport', 'Suspense', 'Thriller', 'War', 'Western'
  ];

  constructor(public dialogRef: MatDialogRef<EditBookDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { bookId: string; userId: string}){ 
      this.userId = data.userId;
      this.bookId = data.bookId;
      this.getBookData();
  }

  async getBookData(){
    try {
      const bookDocRef = doc(this.firestore, `books/${this.userId}/userBooks/${this.bookId}`);
      const docSnapshot = await getDoc(bookDocRef);
      this.book = { ...this.book, ...docSnapshot.data() } as Book;
    } catch (err) {
      console.error('Failed to fetch book data:', err);
    }
  }


  async editBook(){
    this.loading = true;
    try {
      const bookDocRef = doc(this.firestore, `books/${this.userId}/userBooks/${this.bookId}`);
      await updateDoc(bookDocRef, { ...this.book });
      this.loading = false;
      this.dialogRef.close();
    } catch (err) {
      console.error('Failed to edit book:', err);
    }
  }


  closeDialog(){
    this.dialogRef.close()
  }


}
