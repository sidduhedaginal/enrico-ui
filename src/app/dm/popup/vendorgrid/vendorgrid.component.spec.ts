import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorgridComponent } from './vendorgrid.component';

describe('VendorgridComponent', () => {
  let component: VendorgridComponent;
  let fixture: ComponentFixture<VendorgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorgridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
