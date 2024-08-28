import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSLPComponent } from './create-slp.component';

describe('CreateSLPComponent', () => {
  let component: CreateSLPComponent;
  let fixture: ComponentFixture<CreateSLPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSLPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSLPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
