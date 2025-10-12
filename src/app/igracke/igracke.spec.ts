import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Igracke } from './igracke';

describe('Igracke', () => {
  let component: Igracke;
  let fixture: ComponentFixture<Igracke>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Igracke]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Igracke);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
