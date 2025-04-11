import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeriesDialogComponent } from './add-series-dialog.component';

describe('AddSeriesDialogComponent', () => {
  let component: AddSeriesDialogComponent;
  let fixture: ComponentFixture<AddSeriesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSeriesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSeriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
