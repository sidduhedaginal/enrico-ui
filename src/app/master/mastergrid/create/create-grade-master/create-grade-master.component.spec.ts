import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGradeMasterComponent } from './create-grade-master.component';

describe('CreateGradeMasterComponent', () => {
  let component: CreateGradeMasterComponent;
  let fixture: ComponentFixture<CreateGradeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGradeMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGradeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
