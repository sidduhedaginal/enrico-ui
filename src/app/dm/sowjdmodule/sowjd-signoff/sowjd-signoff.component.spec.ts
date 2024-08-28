import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdSignoffComponent } from './sowjd-signoff.component';

describe('SowjdSignoffComponent', () => {
  let component: SowjdSignoffComponent;
  let fixture: ComponentFixture<SowjdSignoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdSignoffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdSignoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
