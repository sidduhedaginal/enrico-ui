import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterStaticFormComponent } from './master-static-form.component';

describe('MasterStaticFormComponent', () => {
  let component: MasterStaticFormComponent;
  let fixture: ComponentFixture<MasterStaticFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterStaticFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterStaticFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
