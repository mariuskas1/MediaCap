import { Component } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Book } from '../../models/book.class';
import { EditBookDialogComponent } from '../edit-book-dialog/edit-book-dialog.component';

@Component({
  selector: 'app-bookfavorites',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatSelectModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatCardModule, RouterModule, MatMenuModule],
  templateUrl: './bookfavorites.component.html',
  styleUrl: './bookfavorites.component.scss'
})
export class BookfavoritesComponent {
  book: Book = new Book();
  allUserBooks: Book[] = [];
  favoriteBooks: Book[] = [];
  sortedBooks: { [key: string]: Book[] } = {};
  books$!: Observable<Book[]>;

  currentYear!: number;
  currentMonth!: string;
  selectedMonth: string = 'all';
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: number[] = [2025, 2024, 2023, 2022];

  userId: string | null = null;

  sortBy: string = 'default';
  searchQuery?:string;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private firestore: Firestore) {}

  openEditBookDialog(id:string | undefined){
      this.dialog.open(EditBookDialogComponent, {
        data: {
          userId: this.userId,
          bookId: id,
        }
      });
    }
    
  
    ngOnInit(){
      this.setCurrentYearAndMonth();
      this.getUserId();
      this.initializeBookArrays();
      this.getUserBooks();
    }

    initializeBookArrays(){
      this.years.forEach(year => {
        this.months.forEach(month => {
          const key = `${month}_${year}`;
          this.sortedBooks[key] = []; 
        })
      })
    }

    getUserBooks(){
      const userbooksCollection = collection(this.firestore, `books/${this.userId}/userBooks`);
      this.books$ = collectionData(userbooksCollection, { idField: 'id' }) as Observable<Book[]>;
  
      this.books$.subscribe((changes) => {
        this.allUserBooks = Array.from(new Map(changes.map(book => [book.id, book])).values());
        this.populateBookArrays();
        this.sortFavoriteBooks();
      })
    }

    populateBookArrays(){
      this.favoriteBooks = this.allUserBooks.filter((book) => book.favorite);

      Object.keys(this.sortedBooks).forEach((key) => {
        this.sortedBooks[key] = []; 
      });
  
      this.favoriteBooks.forEach(book => {
        const month = book.monthRead;
        const year = book.yearRead;
  
        if (month && year) {
          const key = `${month}_${year}`;
          if (this.sortedBooks[key]) {
            this.sortedBooks[key].push(book);
          } else {
            console.error(`No array found for key: ${key}`);
          }

          const allKey = `all_${year}`;
          if (!this.sortedBooks[allKey]) {
            this.sortedBooks[allKey] = [];
          }
          this.sortedBooks[allKey].push(book);
        }
      });
    }

    sortFavoriteBooks(){
      Object.keys(this.sortedBooks).forEach((key) => {
        this.sortedBooks[key].sort((a, b) => {
          const timestampA = new Date(a.timestamp).getTime();
          const timestampB = new Date(b.timestamp).getTime();
          return timestampA - timestampB;
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
  
    async deleteBook(id:string | undefined){
      const bookDocRef = doc(this.firestore, `books/${this.userId}/userbooks/${id}`);
      await deleteDoc(bookDocRef).catch((err) => {
        console.error(err);
      });
    }
}
