import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveaopComponent } from './approveaop.component';

describe('ApproveaopComponent', () => {
  let component: ApproveaopComponent;
  let fixture: ComponentFixture<ApproveaopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveaopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveaopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
