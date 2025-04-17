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

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [MatCardModule, MatIcon, MatButtonModule, MatTooltipModule, MatListModule, FormsModule, MatInputModule,],
  templateUrl: './films.component.html',
  styleUrl: './films.component.scss'
})
export class FilmsComponent {

  userId: string | null = null;
  currentYear?: number;
  currentMonth?: string;

  filmsWatchedYear?: number; 
  filmHighlights?: number;
  filmGenresMap: { [genre: string]: Film[] } = {};
  favoriteFilmGenres: string[] = [];

  films$!: Observable<Film[]>;
  allUserFilms: Film[] = [];

}
