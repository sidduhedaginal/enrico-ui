import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBuHOTComponent } from './create-bu-hot.component';

describe('CreateBuHOTComponent', () => {
  let component: CreateBuHOTComponent;
  let fixture: ComponentFixture<CreateBuHOTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBuHOTComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBuHOTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
