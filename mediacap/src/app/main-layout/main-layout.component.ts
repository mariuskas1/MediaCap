import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {ChangeDetectionStrategy, signal} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';




@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatMenuModule, RouterModule, MatToolbarModule,MatExpansionModule, MatButtonModule, MatIconModule, MatSidenavModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  userId: string | null = null;

  readonly panelOpenState = signal(false);

  constructor(private route: ActivatedRoute){}
  
  
  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
    })
    console.log(this.userId);
  }
}
