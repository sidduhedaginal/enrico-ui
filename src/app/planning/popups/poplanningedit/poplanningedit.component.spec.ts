import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoplanningeditComponent } from './poplanningedit.component';

describe('PoplanningeditComponent', () => {
  let component: PoplanningeditComponent;
  let fixture: ComponentFixture<PoplanningeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoplanningeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoplanningeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
