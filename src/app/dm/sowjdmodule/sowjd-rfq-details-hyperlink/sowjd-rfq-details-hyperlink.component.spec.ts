import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdRfqDetailsHyperlinkComponent } from './sowjd-rfq-details-hyperlink.component';

describe('SowjdRfqDetailsHyperlinkComponent', () => {
  let component: SowjdRfqDetailsHyperlinkComponent;
  let fixture: ComponentFixture<SowjdRfqDetailsHyperlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdRfqDetailsHyperlinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdRfqDetailsHyperlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
