import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdTabComponent } from './sowjd-tab.component';

describe('SowjdTabComponent', () => {
  let component: SowjdTabComponent;
  let fixture: ComponentFixture<SowjdTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
