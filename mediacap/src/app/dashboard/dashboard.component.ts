import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { Book } from '../models/book.class';
import { Film } from '../models/film.class';
import { Series } from '../models/series.class';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  userId: string | null = null;
  currentYear?: number;

  booksReadYear?: number; 
  bookHighlights?: number;
  bookGenres?: string[];
  filmsWatchedYear?: number; 
  filmHighlights?: number;
  filmGenres?: string[];

  books$!: Observable<Book[]>;
  allUserBooks: Book[] = [];
  films$!: Observable<Film[]>;
  allUserFilms: Film[] = [];
  series$!: Observable<Series[]>;
  allUserSeries: Series[] = [];



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
    
  }

  subscribeToUserBooksCollection(){
    const userBooksCollection = collection(this.firestore, `books/${this.userId}/userBooks`);
    this.books$ = collectionData(userBooksCollection, { idField: 'id' }) as Observable<Book[]>;
  
    this.books$.subscribe((changes) => {
      this.getBookStats(changes);
    })
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
    const bookHighlightsArray = this.allUserBooks.filter((book) => book.favorite === true);
    this.bookHighlights = bookHighlightsArray.length;

    //evaluate favorite genres
  }

  getFilmStats(changes: Film[]){
    this.allUserFilms
  }

  getSeriesStats(changes: Series[]){
    
  }


  setCurrentYear(){
    const currentDate = new Date(); 
    this.currentYear = currentDate.getFullYear(); 
  }
}
