import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonpopupComponent } from './editpopup.component';

describe('JsonpopupComponent', () => {
  let component: JsonpopupComponent;
  let fixture: ComponentFixture<JsonpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
