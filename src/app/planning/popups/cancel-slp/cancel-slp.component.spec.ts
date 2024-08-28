import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSLPComponent } from './cancel-slp.component';

describe('CancelSLPComponent', () => {
  let component: CancelSLPComponent;
  let fixture: ComponentFixture<CancelSLPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelSLPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelSLPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
