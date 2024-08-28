import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdSrnComponent } from './sowjd-srn.component';

describe('SowjdSrnComponent', () => {
  let component: SowjdSrnComponent;
  let fixture: ComponentFixture<SowjdSrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdSrnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdSrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
