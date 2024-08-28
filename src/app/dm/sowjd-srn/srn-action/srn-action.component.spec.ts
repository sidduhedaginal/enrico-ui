import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrnActionComponent } from './srn-action.component';

describe('SrnActionComponent', () => {
  let component: SrnActionComponent;
  let fixture: ComponentFixture<SrnActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrnActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrnActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
