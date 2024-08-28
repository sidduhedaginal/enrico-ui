import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AopdetailsComponent } from './aopdetails.component';

describe('AopdetailsComponent', () => {
  let component: AopdetailsComponent;
  let fixture: ComponentFixture<AopdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AopdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AopdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
