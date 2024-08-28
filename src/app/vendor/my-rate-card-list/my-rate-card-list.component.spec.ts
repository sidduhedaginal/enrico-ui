import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRateCardListComponent } from './my-rate-card-list.component';

describe('MyRateCardListComponent', () => {
  let component: MyRateCardListComponent;
  let fixture: ComponentFixture<MyRateCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRateCardListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRateCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
