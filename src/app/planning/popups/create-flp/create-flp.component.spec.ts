import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFLPComponent } from './create-flp.component';

describe('CreateFLPComponent', () => {
  let component: CreateFLPComponent;
  let fixture: ComponentFixture<CreateFLPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFLPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFLPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
