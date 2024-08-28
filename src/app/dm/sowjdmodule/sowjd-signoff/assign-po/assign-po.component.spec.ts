import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPOComponent } from './assign-po.component';

describe('AssignPOComponent', () => {
  let component: AssignPOComponent;
  let fixture: ComponentFixture<AssignPOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignPOComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
