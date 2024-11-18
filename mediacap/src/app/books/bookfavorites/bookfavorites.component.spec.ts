import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookfavoritesComponent } from './bookfavorites.component';

describe('BookfavoritesComponent', () => {
  let component: BookfavoritesComponent;
  let fixture: ComponentFixture<BookfavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookfavoritesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookfavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
