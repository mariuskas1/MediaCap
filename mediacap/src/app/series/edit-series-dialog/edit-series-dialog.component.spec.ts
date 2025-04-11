import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSeriesDialogComponent } from './edit-series-dialog.component';

describe('EditSeriesDialogComponent', () => {
  let component: EditSeriesDialogComponent;
  let fixture: ComponentFixture<EditSeriesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSeriesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSeriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
