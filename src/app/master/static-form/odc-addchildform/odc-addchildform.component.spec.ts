import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdcAddchildformComponent } from './odc-addchildform.component';

describe('OdcAddchildformComponent', () => {
  let component: OdcAddchildformComponent;
  let fixture: ComponentFixture<OdcAddchildformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdcAddchildformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdcAddchildformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
