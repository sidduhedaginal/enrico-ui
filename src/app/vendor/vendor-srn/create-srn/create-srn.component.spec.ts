import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSrnComponent } from './create-srn.component';

describe('CreateSrnComponent', () => {
  let component: CreateSrnComponent;
  let fixture: ComponentFixture<CreateSrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSrnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
