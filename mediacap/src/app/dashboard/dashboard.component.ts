import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, addDoc, collection, collectionData, doc, docData, deleteDoc } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Book } from '../models/book.class';
import { Film } from '../models/film.class';
import { Series } from '../models/series.class';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatMenu, MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ MatCardModule, MatIcon, MatButtonModule, MatTooltipModule, MatListModule, FormsModule, MatInputModule, MatMenuModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @ViewChild('addBookInput') addBookInput!: ElementRef<HTMLInputElement>;
  selectedOptionsIndex: number | null = null;

  userId: string | null = null;
  currentYear?: number;
  currentMonth?: string;

  booksReadYear?: number; 
  bookHighlights?: number;
  bookGenresMap: { [genre: string]: Book[] } = {};
  favoriteBookGenres: string[] = [];

  filmsWatchedYear?: number; 
  filmHighlights?: number;
  filmGenresMap: { [genre: string]: Film[] } = {};
  favoriteFilmGenres: string[] = [];

  seriesWatchedYear?: number;
  seriesHighlights?: number;

  books$!: Observable<Book[]>;
  allUserBooks: Book[] = [];
  films$!: Observable<Film[]>;
  allUserFilms: Film[] = [];
  series$!: Observable<Series[]>;
  allUserSeries: Series[] = [];

  currentBooks$!: Observable<Book[]>;
  currentBooks: Book[] = [];
  newCurrentBook = new Book();
  showAddBookInput = false;


  constructor(private route: ActivatedRoute, private firestore: Firestore){}
  
  
  ngOnInit(){
    this.getUserId();
    this.getBoardData();
    this.setCurrentYear();
  }

  getUserId(){
    this.route.parent?.paramMap.subscribe(params => {
      this.userId = params.get('id'); 
    });
  }

  getBoardData(){
    this.subscribeToUserBooksCollection();
    this.subscribeToUserFilmsCollection();
    this.subscribeToUserSeriesCollection();
    this.subscribeToCurrentBooksCollection();
    this.subscribeToCurrentSeriesCollection();
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
    })
  }

  subscribeToCurrentSeriesCollection(){

  }

  subscribeToUserFilmsCollection(){
    const userFilmsCollection = collection(this.firestore, `films/${this.userId}/userFilms`);
    this.films$ = collectionData(userFilmsCollection, { idField: 'id' }) as Observable<Film[]>;
  
    this.films$.subscribe((changes) => {
      this.getFilmStats(changes);
    })
  }

  subscribeToUserSeriesCollection(){
    const userSeriesCollection = collection(this.firestore, `series/${this.userId}/userSeries`);
    this.series$ = collectionData(userSeriesCollection, { idField: 'id' }) as Observable<Series[]>;
  
    this.series$.subscribe((changes) => {
      this.getSeriesStats(changes);
    })
  }



  getBookStats(changes: Book[]){
    this.allUserBooks = Array.from(new Map(changes.map(book => [book.id, book])).values());
    const booksReadThisYearArray = this.allUserBooks.filter((book) => book.yearRead === this.currentYear);
    this.booksReadYear = booksReadThisYearArray.length;
    const bookHighlightsArray = booksReadThisYearArray.filter((book) => book.favorite === true);
    this.bookHighlights = bookHighlightsArray.length;

    this.sortBooksAfterGenres(booksReadThisYearArray);
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


  getFilmStats(changes: Film[]){
    this.allUserFilms = Array.from(new Map(changes.map(film => [film.id, film])).values());
    const filmsWatchedThisYearArray = this.allUserFilms.filter((film) => film.yearWatched === this.currentYear);
    this.filmsWatchedYear = filmsWatchedThisYearArray.length;
    const filmHighlightsArray = filmsWatchedThisYearArray.filter((film) => film.favorite === true);
    this.filmHighlights = filmHighlightsArray.length;

    this.sortFilmsAfterGenres(filmsWatchedThisYearArray);
  }

  sortFilmsAfterGenres(filmsWatchedThisYearArray: Film[]) {
    this.filmGenresMap = {};
  
    filmsWatchedThisYearArray.forEach(film => {
      if (Array.isArray(film.genres)) {
        film.genres.forEach(genre => {
          if (!this.filmGenresMap[genre]) {
            this.filmGenresMap[genre] = [];
          }
          this.filmGenresMap[genre].push(film);
        });
      }
    });
  
    this.determineFavoriteFilmGenres();
  }

  determineFavoriteFilmGenres() {
    const genreCounts = Object.entries(this.filmGenresMap).map(
      ([genre, films]) => ({ genre, count: films.length })
    );
  
    genreCounts.sort((a, b) => b.count - a.count);
    const topGenres = genreCounts.slice(0, 2).map(entry => entry.genre);
    this.favoriteFilmGenres = topGenres;
  
  }

  getSeriesStats(changes: Series[]){
    this.allUserSeries = Array.from(new Map(changes.map(series => [series.id, series])).values());
    const seriesWatchedThisYearArray = this.allUserSeries.filter((series) => series.yearWatched === this.currentYear);
    this.seriesWatchedYear = seriesWatchedThisYearArray.length;
  }


  setCurrentYear(){
    const currentDate = new Date(); 
    this.currentYear = currentDate.getFullYear(); 
    this.currentMonth = currentDate.toLocaleString('default', { month: 'long' });

  }

  async addBook(){
    if(this.newCurrentBook.title.length > 0){
      try{
        const currentBooksCollection = collection(this.firestore, `books/${this.userId}/currentBooks`);
        await addDoc(currentBooksCollection, { ...this.newCurrentBook});
        this.newCurrentBook = new Book();
      } catch (err){
        console.error(err);
      }
    }
    
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

  openAddBookDialog(){

  }

  editCurrentBook(){

  }


  async deleteCurrentBook(bookId: string){
    try {
      const bookDocRef = doc(this.firestore, `books/${this.userId}/currentBooks/${bookId}`);
      await deleteDoc(bookDocRef);
      this.selectedOptionsIndex = null;
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  }


  showOptions(index:number){
    if (this.selectedOptionsIndex === index) {
      this.selectedOptionsIndex = null;
    } else {
      this.selectedOptionsIndex = index;
    }
  }

  hideOptions(){
    this.selectedOptionsIndex = null;
  }
}
