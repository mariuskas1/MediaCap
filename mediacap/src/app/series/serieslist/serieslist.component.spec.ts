import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieslistComponent } from './serieslist.component';

describe('SerieslistComponent', () => {
  let component: SerieslistComponent;
  let fixture: ComponentFixture<SerieslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerieslistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SerieslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
