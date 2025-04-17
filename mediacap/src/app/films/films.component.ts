import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Film } from '../models/film.class';
import { Observable } from 'rxjs';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [MatCardModule, MatIcon, MatButtonModule, MatTooltipModule, MatListModule, FormsModule, MatInputModule, RouterModule],
  templateUrl: './films.component.html',
  styleUrl: './films.component.scss'
})
export class FilmsComponent {

  userId: string | null = null;
  currentYear?: number;
  currentMonth?: string;

  filmsWatchedYear?: number; 
  filmsWatchedMonth?: number; 
  filmHighlights?: number;
  filmGenresMap: { [genre: string]: Film[] } = {};
  favoriteFilmGenres: string[] = [];

  films$!: Observable<Film[]>;
  allUserFilms: Film[] = [];

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
    this.subscribeToUserFilmsCollection();
 
  }

  subscribeToUserFilmsCollection(){
    const userFilmsCollection = collection(this.firestore, `films/${this.userId}/userFilms`);
    this.films$ = collectionData(userFilmsCollection, { idField: 'id' }) as Observable<Film[]>;
  
    this.films$.subscribe((changes) => {
      this.getFilmStats(changes);
    })
  }

  getFilmStats(changes: Film[]){
    this.allUserFilms = Array.from(new Map(changes.map(film => [film.id, film])).values());
    const filmsWatchedThisMonthArray = this.allUserFilms.filter((film) => film.yearWatched === this.currentYear && film.monthWatched === this.currentMonth);
    this.filmsWatchedMonth = filmsWatchedThisMonthArray.length;
    const filmHighlightsArray = filmsWatchedThisMonthArray.filter((film) => film.favorite === true);
    this.filmHighlights = filmHighlightsArray.length;

    this.sortFilmsAfterGenres(filmsWatchedThisMonthArray);
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

  setCurrentDate(){
    const currentDate = new Date(); 
    this.currentYear = currentDate.getFullYear(); 
    this.currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  }
}
