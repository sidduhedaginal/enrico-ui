import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTargetSavingsMasterComponent } from './create-target-savings-master.component';

describe('CreateTargetSavingsMasterComponent', () => {
  let component: CreateTargetSavingsMasterComponent;
  let fixture: ComponentFixture<CreateTargetSavingsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTargetSavingsMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTargetSavingsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
