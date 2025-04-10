import { Component } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Book } from '../../models/book.class';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { AddBookDialogComponent } from '../add-book-dialog/add-book-dialog.component';
import { EditBookDialogComponent } from '../edit-book-dialog/edit-book-dialog.component';



@Component({
  selector: 'app-booklist',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatSelectModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatCardModule, RouterModule, MatMenuModule],
  templateUrl: './booklist.component.html',
  styleUrl: './booklist.component.scss'
})
export class BooklistComponent {

  book: Book = new Book();
  allUserBooks: Book[] = [];
  sortedBooks: { [key: string]: Book[] } = {};
  books$!: Observable<Book[]>;

  currentYear!: number;
  currentMonth!: string;
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: number[] = [2025, 2024, 2023, 2022];

  userId: string | null = null;

  sortBy: string = 'default';
  searchQuery?:string;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private firestore: Firestore) {}

  openDialog(){
      this.dialog.open(AddBookDialogComponent, {
        data: {
          month: this.currentMonth,
          year: this.currentYear,
          userId: this.userId,
        }
      });
    }
  
  
    openEditBookDialog(id:string | undefined){
      // this.dialog.open(EditFilmDialogComponent, {
      //   data: {
      //     userId: this.userId,
      //     filmId: id,
      //   }
      // });
    }
    
  
    ngOnInit(){
      this.setCurrentYearAndMonth();
      this.getUserId();
      this.initializeFilmArrays();
      this.getUserbooks();
    }
  
  
    initializeFilmArrays(){
      this.years.forEach(year => {
        this.months.forEach(month => {
          const key = `${month}_${year}`;
          this.sortedBooks[key] = []; 
        })
      })
    }
  
  
    getUserbooks(){
      const userbooksCollection = collection(this.firestore, `books/${this.userId}/userbooks`);
      this.books$ = collectionData(userbooksCollection, { idField: 'id' }) as Observable<Book[]>;
  
      this.books$.subscribe((changes) => {
        this.allUserBooks = Array.from(new Map(changes.map(film => [film.id, film])).values());
        this.populateFilmArrays();
        this.sortFilmArrays();
      })
    }
  
  
    populateFilmArrays(){
      Object.keys(this.sortedBooks).forEach((key) => {
        this.sortedBooks[key] = []; 
      });
  
      this.allUserBooks.forEach(book => {
        const month = book.monthRead;
        const year = book.yearRead;
  
        if (month && year) {
          const key = `${month}_${year}`;
          if (this.sortedBooks[key]) {
            this.sortedBooks[key].push(book);
          } else {
            console.error(`No array found for key: ${key}`);
          }
        }
      });
    }
  
  
    sortFilmArrays(){
      Object.keys(this.sortedBooks).forEach((key) => {
        this.sortedBooks[key].sort((a, b) => {
          // Compare film timestamps
          const timestampA = new Date(a.timestamp).getTime();
          const timestampB = new Date(b.timestamp).getTime();
          return timestampA - timestampB; // Ascending order
        });
      });
    }
  
  
    setCurrentYearAndMonth(){
      const currentDate = new Date(); 
      this.currentYear = currentDate.getFullYear(); 
      this.currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    }
  
  
    getUserId(){
      this.route.parent?.paramMap.subscribe(params => {
        this.userId = params.get('id'); 
      });
    }
  
    onSearch(searchQuery:string | undefined){
      console.log(searchQuery);
    }
  
    async deleteBook(id:string | undefined){
      const filmDocRef = doc(this.firestore, `books/${this.userId}/userbooks/${id}`);
      await deleteDoc(filmDocRef).catch((err) => {
        console.error(err);
      });
    }


}
