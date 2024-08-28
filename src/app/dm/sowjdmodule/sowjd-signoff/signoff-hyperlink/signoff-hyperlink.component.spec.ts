import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignoffHyperlinkComponent } from './signoff-hyperlink.component';

describe('SignoffHyperlinkComponent', () => {
  let component: SignoffHyperlinkComponent;
  let fixture: ComponentFixture<SignoffHyperlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignoffHyperlinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignoffHyperlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
