import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifiedskillgridComponent } from './identifiedskillgrid.component';

describe('IdentifiedskillgridComponent', () => {
  let component: IdentifiedskillgridComponent;
  let fixture: ComponentFixture<IdentifiedskillgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentifiedskillgridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentifiedskillgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
