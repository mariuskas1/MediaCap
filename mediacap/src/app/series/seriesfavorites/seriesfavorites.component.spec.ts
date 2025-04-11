import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesfavoritesComponent } from './seriesfavorites.component';

describe('SeriesfavoritesComponent', () => {
  let component: SeriesfavoritesComponent;
  let fixture: ComponentFixture<SeriesfavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesfavoritesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeriesfavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
