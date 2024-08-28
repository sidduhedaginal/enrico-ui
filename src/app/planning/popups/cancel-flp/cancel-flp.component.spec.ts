import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelFlpComponent } from './cancel-flp.component';

describe('CancelFlpComponent', () => {
  let component: CancelFlpComponent;
  let fixture: ComponentFixture<CancelFlpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelFlpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelFlpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
