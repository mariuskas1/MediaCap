import { Component, Inject, inject} from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Series } from '../../models/series.class';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSliderModule} from '@angular/material/slider';
import { MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-add-series-dialog',
  standalone: true,
  imports: [MatCheckboxModule, MatIconModule, MatSelectModule, MatSliderModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatProgressBarModule],
  templateUrl: './add-series-dialog.component.html',
  styleUrl: './add-series-dialog.component.scss'
})
export class AddSeriesDialogComponent {

    series: Series = new Series();
    loading = false;
  
    months: string[] = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    years: number[] = [2025, 2024, 2023, 2022];
    userId: string | null = null;
    firestore: Firestore = inject(Firestore);
  
    seriesGenres: string[] = [
      'Action', 'Adventure', 'Arthouse',  'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 
      'Drama', 'Family', 'Fantasy',  'Film-Noir', 'History', 'Indie', 'Horror', 'Musical', 'Mystery', 
      'Romance', 'Sci-Fi', 'Sport', 'Suspense', 'Thriller', 'War',  'Western'
    ];
  
    constructor(public dialogRef: MatDialogRef<AddSeriesDialogComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: { month: string; year: number; userId: string}){
        this.series.yearWatched = data.year;
        this.series.monthWatched = data.month;
        this.userId = data.userId;
      }
  
    async addSeries(){
      this.loading = true;
      this.series.timestamp = Date.now();
  
      try{
        const seriesCollection = collection(this.firestore, `series/${this.userId}/userSeries` );
        await addDoc(seriesCollection, { ...this.series});
        this.loading = false;
        this.series = new Series();
        this.dialogRef.close();
      } catch (err){
        console.error(err);
      }
    }
  
  
    closeDialog(){
      this.dialogRef.close()
    }

}
