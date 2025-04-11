import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesplansComponent } from './seriesplans.component';

describe('SeriesplansComponent', () => {
  let component: SeriesplansComponent;
  let fixture: ComponentFixture<SeriesplansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesplansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeriesplansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
