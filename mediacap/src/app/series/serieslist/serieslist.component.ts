import { Component } from '@angular/core';
import { MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { AddSeriesDialogComponent } from '../add-series-dialog/add-series-dialog.component';
import { EditSeriesDialogComponent } from '../edit-series-dialog/edit-series-dialog.component';
import { Series } from '../../models/series.class';


@Component({
  selector: 'app-serieslist',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatSelectModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatCardModule, RouterModule, MatMenuModule],
  templateUrl: './serieslist.component.html',
  styleUrl: './serieslist.component.scss'
})
export class SerieslistComponent {

  series: Series = new Series();
  allUserSeries: Series[] = [];
  sortedSeries: { [key: string]: Series[] } = {};
  series$!: Observable<Series[]>;
  
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
    this.dialog.open(AddSeriesDialogComponent, {
      data: {
        month: this.currentMonth,
        year: this.currentYear,
        userId: this.userId,
      }
    });
  }


  openEditSeriesDialog(id:string | undefined){
    this.dialog.open(EditSeriesDialogComponent, {
      data: {
        userId: this.userId,
        seriesId: id,
      }
    });
  }
  

  ngOnInit(){
    this.setCurrentYearAndMonth();
    this.getUserId();
    this.initializeSeriesArrays();
    this.getUserSeries();
  }


  initializeSeriesArrays(){
    this.years.forEach(year => {
      this.months.forEach(month => {
        const key = `${month}_${year}`;
        this.sortedSeries[key] = []; 
      })
    })
  }


  getUserSeries(){
    const userSeriesCollection = collection(this.firestore, `series/${this.userId}/userSeries`);
    this.series$ = collectionData(userSeriesCollection, { idField: 'id' }) as Observable<Series[]>;

    this.series$.subscribe((changes) => {
      this.allUserSeries = Array.from(new Map(changes.map(series => [series.id, series])).values());
      this.populateSeriesArrays();
      this.sortSeriesArrays();
    })
  }


  populateSeriesArrays(){
    Object.keys(this.sortedSeries).forEach((key) => {
      this.sortedSeries[key] = []; 
    });

    this.allUserSeries.forEach(series => {
      const month = series.monthWatched;
      const year = series.yearWatched;

      if (month && year) {
        const key = `${month}_${year}`;
        if (this.sortedSeries[key]) {
          this.sortedSeries[key].push(series);
        } else {
          console.error(`No array found for key: ${key}`);
        }
      }
    });
  }


  sortSeriesArrays(){
    Object.keys(this.sortedSeries).forEach((key) => {
      this.sortedSeries[key].sort((a, b) => {
        // Compare series timestamps
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampA - timestampB; // Ascending order
      });
    });
    console.log(this.sortedSeries)
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

  async deleteSeries(id:string | undefined){
    const seriesDocRef = doc(this.firestore, `series/${this.userId}/userSeries/${id}`);
    await deleteDoc(seriesDocRef).catch((err) => {
      console.error(err);
    });
  }

}
