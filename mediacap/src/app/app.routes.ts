import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { FilmsComponent } from './films/films.component';
import { FilmlistComponent } from './films/filmlist/filmlist.component';
import { PlansComponent } from './films/plans/plans.component';
import { FavoritesComponent } from './films/favorites/favorites.component';
import { BooksComponent } from './books/books.component';
import { BooklistComponent } from './books/booklist/booklist.component';
import { BookplansComponent } from './books/bookplans/bookplans.component';
import { BookfavoritesComponent } from './books/bookfavorites/bookfavorites.component';

export const routes: Routes = [
    { 
      path: '', 
      component: LoginLayoutComponent,
      children: [
        { path: '', component: LoginComponent },
      ],
    },
    { 
      path: 'main/:id', 
      component: MainLayoutComponent,
      children: [
        { path: '', component: DashboardComponent },
        { path: 'dashboard', component: DashboardComponent }, 
        { path: 'films', component: FilmsComponent }, 
        { path: 'films/list', component: FilmlistComponent }, 
        { path: 'films/plans', component: PlansComponent }, 
        { path: 'films/favorites', component: FavoritesComponent }, 
  
        { path: 'books', component: BooksComponent }, 
        { path: 'books/list', component: BooklistComponent }, 
        { path: 'books/plans', component: BookplansComponent }, 
        { path: 'books/favorites', component: BookfavoritesComponent },
      ],
    },
  ];
  