import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAOPpopupComponent } from './create-aoppopup.component';

describe('CreateAOPpopupComponent', () => {
  let component: CreateAOPpopupComponent;
  let fixture: ComponentFixture<CreateAOPpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAOPpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAOPpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
