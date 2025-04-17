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
import { Film } from '../../models/film.class';
import { EditFilmDialogComponent } from '../edit-film-dialog/edit-film-dialog.component';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatSelectModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatCardModule, RouterModule, MatMenuModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {
  film: Film = new Film();
  allUserFilms: Film[] = [];
  favoriteFilms: Film[] = [];
  sortedFilms: { [key: string]: Film[] } = {};
  films$!: Observable<Film[]>;

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

  openEditFilmDialog(id:string | undefined){
      this.dialog.open(EditFilmDialogComponent, {
        data: {
          userId: this.userId,
          filmId: id,
        }
      });
    }
    
  
    ngOnInit(){
      this.setCurrentYearAndMonth();
      this.getUserId();
      this.initializeFilmArrays();
      this.getUserFilms();
    }

    initializeFilmArrays(){
      this.years.forEach(year => {
        this.months.forEach(month => {
          const key = `${month}_${year}`;
          this.sortedFilms[key] = []; 
        })
      })
    }

    getUserFilms(){
      const userFilmsCollection = collection(this.firestore, `films/${this.userId}/userFilms`);
      this.films$ = collectionData(userFilmsCollection, { idField: 'id' }) as Observable<Film[]>;
  
      this.films$.subscribe((changes) => {
        this.allUserFilms = Array.from(new Map(changes.map(film => [film.id, film])).values());
        this.populateFilmArrays();
        this.sortFavoriteFilms();
      })
    }

    populateFilmArrays(){
      this.favoriteFilms = this.allUserFilms.filter((film) => film.favorite);

      Object.keys(this.sortedFilms).forEach((key) => {
        this.sortedFilms[key] = []; 
      });
  
      this.favoriteFilms.forEach(film => {
        const month = film.monthWatched;
        const year = film.yearWatched;
  
        if (month && year) {
          const key = `${month}_${year}`;
          if (this.sortedFilms[key]) {
            this.sortedFilms[key].push(film);
          } else {
            console.error(`No array found for key: ${key}`);
          }

          const allKey = `all_${year}`;
          if (!this.sortedFilms[allKey]) {
            this.sortedFilms[allKey] = [];
          }
          this.sortedFilms[allKey].push(film);
        }
      });
    }

    sortFavoriteFilms(){
      Object.keys(this.sortedFilms).forEach((key) => {
        this.sortedFilms[key].sort((a, b) => {
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
  
    async deleteFilm(id:string | undefined){
      const filmDocRef = doc(this.firestore, `films/${this.userId}/userFilms/${id}`);
      await deleteDoc(filmDocRef).catch((err) => {
        console.error(err);
      });
    }

}
