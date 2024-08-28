import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdRfqListComponent } from './sowjd-rfq-list.component';

describe('SowjdRfqListComponent', () => {
  let component: SowjdRfqListComponent;
  let fixture: ComponentFixture<SowjdRfqListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdRfqListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdRfqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
