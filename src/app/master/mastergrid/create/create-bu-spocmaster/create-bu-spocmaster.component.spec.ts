import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBuSPOCMasterComponent } from './create-bu-spocmaster.component';

describe('CreateBuSPOCMasterComponent', () => {
  let component: CreateBuSPOCMasterComponent;
  let fixture: ComponentFixture<CreateBuSPOCMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBuSPOCMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBuSPOCMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
