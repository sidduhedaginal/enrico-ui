import { ComponentFixture, TestBed } from '@angular/core/testing';

import { popupMessageComponent } from './popup-message.component';

describe('popupMessageComponent', () => {
  let component: popupMessageComponent;
  let fixture: ComponentFixture<popupMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [popupMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(popupMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
