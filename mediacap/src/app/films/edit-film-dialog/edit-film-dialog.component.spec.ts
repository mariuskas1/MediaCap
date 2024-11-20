import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFilmDialogComponent } from './edit-film-dialog.component';

describe('EditFilmDialogComponent', () => {
  let component: EditFilmDialogComponent;
  let fixture: ComponentFixture<EditFilmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFilmDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFilmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
