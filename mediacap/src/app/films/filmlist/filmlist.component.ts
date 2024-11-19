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

@Component({
  selector: 'app-filmlist',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatCardModule, RouterModule, MatMenuModule],
  templateUrl: './filmlist.component.html',
  styleUrl: './filmlist.component.scss'
})
export class FilmlistComponent implements OnInit{

  film: Film = new Film();
  allFilms24: Film[] = [];
  currentYear!: number;
  currentMonth!: string;

  userId: string | null = null;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private firestore: Firestore) {}


  openDialog(){
    this.dialog.open(AddFilmDialogComponent, {
      data: {
        month: this.currentMonth,
        year: this.currentYear,
        userId: this.userId,
      },
    });
  }
  

  ngOnInit(){
    const currentDate = new Date(); 
    this.currentYear = currentDate.getFullYear(); 
    this.currentMonth = currentDate.toLocaleString('default', { month: 'long' });

    this.route.parent?.paramMap.subscribe(params => {
      this.userId = params.get('id'); 
    });
  }
}
