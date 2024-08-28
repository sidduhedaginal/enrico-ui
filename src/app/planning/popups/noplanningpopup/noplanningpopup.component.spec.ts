import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoplanningpopupComponent } from './noplanningpopup.component';

describe('NoplanningpopupComponent', () => {
  let component: NoplanningpopupComponent;
  let fixture: ComponentFixture<NoplanningpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoplanningpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoplanningpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
