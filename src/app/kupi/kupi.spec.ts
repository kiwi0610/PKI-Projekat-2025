import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kupi } from './kupi';

describe('Kupi', () => {
  let component: Kupi;
  let fixture: ComponentFixture<Kupi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kupi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kupi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
