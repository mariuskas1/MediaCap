import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFilmDialogComponent } from './add-film-dialog.component';

describe('AddFilmDialogComponent', () => {
  let component: AddFilmDialogComponent;
  let fixture: ComponentFixture<AddFilmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFilmDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFilmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
