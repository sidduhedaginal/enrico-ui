import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondlevelplanningComponent } from './secondlevelplanning.component';

describe('SecondlevelplanningComponent', () => {
  let component: SecondlevelplanningComponent;
  let fixture: ComponentFixture<SecondlevelplanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondlevelplanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondlevelplanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
