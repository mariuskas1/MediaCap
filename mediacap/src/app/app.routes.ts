import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

export const routes: Routes = [
    { path: '', component: LoginLayoutComponent,
        children: [
           { path: '', component: LoginComponent}
        ],    
    },
    { path: 'dashboard/:id', component: MainLayoutComponent,
        children: [
            { path: '', component: DashboardComponent }
        ]
     }
];
