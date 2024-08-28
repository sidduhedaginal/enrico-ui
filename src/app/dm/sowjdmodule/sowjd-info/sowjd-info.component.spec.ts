import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdInfoComponent } from './sowjd-info.component';

describe('SowjdInfoComponent', () => {
  let component: SowjdInfoComponent;
  let fixture: ComponentFixture<SowjdInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
