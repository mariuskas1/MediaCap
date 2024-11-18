import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookplansComponent } from './bookplans.component';

describe('BookplansComponent', () => {
  let component: BookplansComponent;
  let fixture: ComponentFixture<BookplansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookplansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookplansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
