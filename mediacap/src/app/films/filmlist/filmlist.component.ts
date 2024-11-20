import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Film } from './../../models/film.class';
import { AddFilmDialogComponent } from '../add-film-dialog/add-film-dialog.component';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import {MatMenuModule} from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';


@Component({
  selector: 'app-filmlist',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatSelectModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatCardModule, RouterModule, MatMenuModule],
  templateUrl: './filmlist.component.html',
  styleUrl: './filmlist.component.scss'
})
export class FilmlistComponent implements OnInit{

  film: Film = new Film();
  allUserFilms: Film[] = [];
  sortedFilms: { [key: string]: Film[] } = {};
  films$!: Observable<Film[]>;

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
    this.dialog.open(AddFilmDialogComponent, {
      data: {
        month: this.currentMonth,
        year: this.currentYear,
        userId: this.userId,
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
      this.sortFilmArrays();
    })
  }


  populateFilmArrays(){
    Object.keys(this.sortedFilms).forEach((key) => {
      this.sortedFilms[key] = []; 
    });

    this.allUserFilms.forEach(film => {
      const month = film.monthWatched;
      const year = film.yearWatched;

      if (month && year) {
        const key = `${month}_${year}`;
        if (this.sortedFilms[key]) {
          this.sortedFilms[key].push(film);
        } else {
          console.error(`No array found for key: ${key}`);
        }
      }
    });
  }


  sortFilmArrays(){
    Object.keys(this.sortedFilms).forEach((key) => {
      this.sortedFilms[key].sort((a, b) => {
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

  async deleteFilm(id:string | undefined){
    const filmDocRef = doc(this.firestore, `films/${this.userId}/userFilms/${id}`);
    await deleteDoc(filmDocRef).catch((err) => {
      console.error(err);
    });
  }

}
