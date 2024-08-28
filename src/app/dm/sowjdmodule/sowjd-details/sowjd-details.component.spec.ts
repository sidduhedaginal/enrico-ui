import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdDetailsComponent } from './sowjd-details.component';

describe('SowjdDetailsComponent', () => {
  let component: SowjdDetailsComponent;
  let fixture: ComponentFixture<SowjdDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
