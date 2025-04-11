import { Component, Inject, inject} from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Series } from '../../models/series.class';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDoc, doc, updateDoc } from '@angular/fire/firestore';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSliderModule} from '@angular/material/slider';
import { MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-edit-series-dialog',
  standalone: true,
  imports: [MatCheckboxModule, MatIconModule, MatSelectModule, MatSliderModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatProgressBarModule],
  templateUrl: './edit-series-dialog.component.html',
  styleUrl: './edit-series-dialog.component.scss'
})
export class EditSeriesDialogComponent {
    series: Series = new Series();
    loading = false;
  
    months: string[] = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    years: number[] = [2025, 2024, 2023, 2022];
    userId: string | null = null;
    firestore: Firestore = inject(Firestore);
    seriesId: string | null = null;
  
    seriesGenres: string[] = [
      'Action', 'Adventure', 'Arthouse',  'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 
      'Drama', 'Family', 'Fantasy',  'Film-Noir', 'History', 'Indie', 'Horror', 'Musical', 'Mystery', 
      'Romance', 'Sci-Fi', 'Sport', 'Suspense', 'Thriller', 'War',  'Western'
    ];
  
    constructor(public dialogRef: MatDialogRef<EditSeriesDialogComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: { seriesId: string; userId: string}){ 
        this.userId = data.userId;
        this.seriesId = data.seriesId;
        this.getSeriesData();
    }
  
    async getSeriesData(){
      try {
        const seriesDocRef = doc(this.firestore, `series/${this.userId}/userSeries/${this.seriesId}`);
        const docSnapshot = await getDoc(seriesDocRef);
        this.series = { ...this.series, ...docSnapshot.data() } as Series;
      } catch (err) {
        console.error('Failed to fetch series data:', err);
      }
    }
  
  
    async editSeries(){
      this.loading = true;
      try {
        const seriesDocRef = doc(this.firestore, `series/${this.userId}/userSeries/${this.seriesId}`);
        await updateDoc(seriesDocRef, { ...this.series });
        this.loading = false;
        this.dialogRef.close();
      } catch (err) {
        console.error('Failed to edit series:', err);
      }
    }
  
  
    closeDialog(){
      this.dialogRef.close()
    }
  

}
