import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdRfqDetailComponent } from './sowjd-rfq-detail.component';

describe('SowjdRfqDetailComponent', () => {
  let component: SowjdRfqDetailComponent;
  let fixture: ComponentFixture<SowjdRfqDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdRfqDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdRfqDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
