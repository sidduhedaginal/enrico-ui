import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGbBusinessAreaMasterComponent } from './create-gb-business-area-master.component';

describe('CreateGbBusinessAreaMasterComponent', () => {
  let component: CreateGbBusinessAreaMasterComponent;
  let fixture: ComponentFixture<CreateGbBusinessAreaMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGbBusinessAreaMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGbBusinessAreaMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
