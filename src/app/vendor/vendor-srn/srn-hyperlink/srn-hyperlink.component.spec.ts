import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrnHyperlinkComponent } from './srn-hyperlink.component';

describe('SrnHyperlinkComponent', () => {
  let component: SrnHyperlinkComponent;
  let fixture: ComponentFixture<SrnHyperlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrnHyperlinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrnHyperlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
