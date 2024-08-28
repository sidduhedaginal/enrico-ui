import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdcMasterComponent } from './odc-master.component';

describe('OdcMasterComponent', () => {
  let component: OdcMasterComponent;
  let fixture: ComponentFixture<OdcMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdcMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdcMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
