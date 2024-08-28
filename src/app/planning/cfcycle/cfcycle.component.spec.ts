import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfcycleComponent } from './cfcycle.component';

describe('CfcycleComponent', () => {
  let component: CfcycleComponent;
  let fixture: ComponentFixture<CfcycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfcycleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfcycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
