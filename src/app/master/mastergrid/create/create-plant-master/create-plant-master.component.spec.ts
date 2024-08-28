import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlantMasterComponent } from './create-plant-master.component';

describe('CreatePlantMasterComponent', () => {
  let component: CreatePlantMasterComponent;
  let fixture: ComponentFixture<CreatePlantMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePlantMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlantMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
