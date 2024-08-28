import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendlastdateComponent } from './extendlastdate.component';

describe('ExtendlastdateComponent', () => {
  let component: ExtendlastdateComponent;
  let fixture: ComponentFixture<ExtendlastdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendlastdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendlastdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
