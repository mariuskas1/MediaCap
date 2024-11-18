import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, docData } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  userId: string | null = null;

  constructor(private route: ActivatedRoute, private firestore: Firestore){}
  
  
  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
    })
  }

}
