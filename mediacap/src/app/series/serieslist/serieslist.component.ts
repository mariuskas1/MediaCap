import { Component } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
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

}
