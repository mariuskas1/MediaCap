import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Book } from '../models/book.class';
import { Observable } from 'rxjs';
import { Film } from '../models/film.class';
import { Series } from '../models/series.class';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { collection, collectionData, doc, Firestore, updateDoc, deleteDoc, addDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { AddBookDialogComponent } from './add-book-dialog/add-book-dialog.component';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-books',
  standalone: true,
  imports: [ MatCardModule, MatIcon, MatButtonModule,  MatTooltipModule, FormsModule, MatMenuModule, RouterModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent {
  @ViewChild('addBookInput') addBookInput!: ElementRef<HTMLInputElement>;
  @ViewChildren('bookInput') bookInputs!: QueryList<ElementRef<HTMLInputElement>>;

  selectedBookOptionsIndex: number | null = null;
  editCurrentBookIndex: number | null = null;

  booksReadYear?: number; 
  booksReadMonth?: number; 
  bookHighlights?: number;
  bookGenresMap: { [genre: string]: Book[] } = {};
  favoriteBookGenres: string[] = [];

  books$!: Observable<Book[]>;
  allUserBooks: Book[] = [];

  currentBooks$!: Observable<Book[]>;
  currentBooks: Book[] = [];
  newCurrentBook = new Book();
  showAddBookInput = false;

  userId: string | null = null;
  currentYear?: number;
  currentMonth?: string;


  constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog){}


  ngOnInit(){
    this.getUserId();
    this.getBoardData();
    this.setCurrentDate();
  }

  getUserId(){
    this.route.parent?.paramMap.subscribe(params => {
      this.userId = params.get('id'); 
    });
  }

  getBoardData(){
    this.subscribeToUserBooksCollection();
    this.subscribeToCurrentBooksCollection();
  }

   subscribeToUserBooksCollection(){
    const userBooksCollection = collection(this.firestore, `books/${this.userId}/userBooks`);
    this.books$ = collectionData(userBooksCollection, { idField: 'id' }) as Observable<Book[]>;
  
    this.books$.subscribe((changes) => {
      this.getBookStats(changes);
    })
  }

  subscribeToCurrentBooksCollection(){
    const currentBooksCollection = collection(this.firestore, `books/${this.userId}/currentBooks`);
    this.currentBooks$ = collectionData(currentBooksCollection, { idField: 'id' }) as Observable<Book[]>;
  
    this.currentBooks$.subscribe((changes) => {
      this.currentBooks = Array.from(new Map(changes.map(book => [book.id, book])).values());
      this.currentBooks.sort((a, b) => a.timestamp - b.timestamp);
    })
  }

  getBookStats(changes: Book[]){
    this.allUserBooks = Array.from(new Map(changes.map(book => [book.id, book])).values());
    const booksReadThisMonthArray = this.allUserBooks.filter((book) => book.yearRead === this.currentYear && book.monthRead === this.currentMonth);
    this.booksReadMonth = booksReadThisMonthArray.length;
    const bookHighlightsArray = booksReadThisMonthArray.filter((book) => book.favorite === true);
    this.bookHighlights = bookHighlightsArray.length;

    this.sortBooksAfterGenres(booksReadThisMonthArray);
  }

  sortBooksAfterGenres(booksReadThisYearArray: Book[]){
    this.bookGenresMap = {};

    booksReadThisYearArray.forEach(book => {
      if (Array.isArray(book.genres)) {
        book.genres.forEach(genre => {
          if (!this.bookGenresMap[genre]) {
            this.bookGenresMap[genre] = [];
          }
          this.bookGenresMap[genre].push(book);
        });
      }
    });

    this.determineFavoriteBookGenres();
  }

  determineFavoriteBookGenres(){
    const genreCounts = Object.entries(this.bookGenresMap).map(
      ([genre, books]) => ({ genre, count: books.length })
    );

    genreCounts.sort((a, b) => b.count - a.count);
    const topGenres = genreCounts.slice(0, 2).map(entry => entry.genre);
    this.favoriteBookGenres = topGenres;
  }

  showAddBookInputDiv(){
    this.showAddBookInput = true;
    setTimeout(() => {
      this.addBookInput?.nativeElement?.focus();
    }, 50);
  }

  hideAddBookInputDiv(){
    this.showAddBookInput = false;
    this.newCurrentBook.title = '';
  }

  showBookOptions(index: number){
    if (this.selectedBookOptionsIndex === index) {
      this.selectedBookOptionsIndex = null;
    } else {
      this.selectedBookOptionsIndex = index;
    }
  }

  hideBookOptions(){
    this.selectedBookOptionsIndex = null;
  }


  async editCurrentBook(book: Book, index: number){
    this.editCurrentBookIndex = null;

    try {
      const bookDocRef = doc(this.firestore, `books/${this.userId}/currentBooks/${book.id}`);
      await updateDoc(bookDocRef, {
        title: book.title,
      });
    } catch (error) {
      console.error(error);
    }
  }

  setEditCurrentBookIndex(index: number){
    this.editCurrentBookIndex = index;

    setTimeout(() => {
      const input = this.bookInputs.toArray()[index];
      input?.nativeElement.focus();
    }, 50);
  }

  async deleteCurrentBook(bookId: string){
      try {
        const bookDocRef = doc(this.firestore, `books/${this.userId}/currentBooks/${bookId}`);
        await deleteDoc(bookDocRef);
        this.selectedBookOptionsIndex = null;
      } catch (error) {
        console.error('Error deleting book:', error);
      }
  }

  async setCurrentBookFinished(book: Book){
    await this.deleteCurrentBook(book.id!);
    this.openAddBookDialog(book);
  }

  openAddBookDialog(book: Book){
    this.dialog.open(AddBookDialogComponent, {
        data: {
          month: this.currentMonth,
          year: this.currentYear,
          userId: this.userId,
          title: book.title
        }
    });
  }

    async addBook(){
    if(this.newCurrentBook.title.length > 0){
      this.newCurrentBook.timestamp = Date.now();

      try{
        const currentBooksCollection = collection(this.firestore, `books/${this.userId}/currentBooks`);
        await addDoc(currentBooksCollection, { ...this.newCurrentBook});
        this.newCurrentBook = new Book();
      } catch (err){
        console.error(err);
      }
    }
  }

  setCurrentDate(){
    const currentDate = new Date(); 
    this.currentYear = currentDate.getFullYear(); 
    this.currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  }
}
