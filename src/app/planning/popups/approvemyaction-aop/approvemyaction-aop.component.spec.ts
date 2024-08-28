import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovemyactionAOPComponent } from './approvemyaction-aop.component';

describe('ApprovemyactionAOPComponent', () => {
  let component: ApprovemyactionAOPComponent;
  let fixture: ComponentFixture<ApprovemyactionAOPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovemyactionAOPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovemyactionAOPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
