import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { Book } from '../models/book.class';


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
    this.subscibeToUserBooksCollection();
    
    //subscribe to films and series collections
  }

  subscibeToUserBooksCollection(){
    const userBooksCollection = collection(this.firestore, `books/${this.userId}/userBooks`);
    this.books$ = collectionData(userBooksCollection, { idField: 'id' }) as Observable<Book[]>;
  
    this.books$.subscribe((changes) => {
      this.getBookStats(changes)
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


  setCurrentYear(){
    const currentDate = new Date(); 
    this.currentYear = currentDate.getFullYear(); 
  }
}
