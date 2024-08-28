import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdDmComponent } from './sowjd-dm.component';

describe('SowjdDmComponent', () => {
  let component: SowjdDmComponent;
  let fixture: ComponentFixture<SowjdDmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdDmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdDmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
