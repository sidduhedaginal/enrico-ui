import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegateSecondlevelComponent } from './delegate-secondlevel.component';

describe('DelegateSecondlevelComponent', () => {
  let component: DelegateSecondlevelComponent;
  let fixture: ComponentFixture<DelegateSecondlevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegateSecondlevelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegateSecondlevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
