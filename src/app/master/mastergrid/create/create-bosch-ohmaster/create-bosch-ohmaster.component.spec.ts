import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBoschOHMasterComponent } from './create-bosch-ohmaster.component';

describe('CreateBoschOHMasterComponent', () => {
  let component: CreateBoschOHMasterComponent;
  let fixture: ComponentFixture<CreateBoschOHMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBoschOHMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBoschOHMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
