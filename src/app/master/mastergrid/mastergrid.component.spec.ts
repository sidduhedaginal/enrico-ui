import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MastergridComponent } from './mastergrid.component';

describe('MastergridComponent', () => {
  let component: MastergridComponent;
  let fixture: ComponentFixture<MastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MastergridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
