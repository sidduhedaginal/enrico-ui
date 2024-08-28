import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompanyMasterComponent } from './create-company-master.component';

describe('CreateCompanyMasterComponent', () => {
  let component: CreateCompanyMasterComponent;
  let fixture: ComponentFixture<CreateCompanyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCompanyMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCompanyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
