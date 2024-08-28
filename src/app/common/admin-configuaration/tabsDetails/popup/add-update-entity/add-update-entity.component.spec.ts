import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateEntityComponent } from './add-update-entity.component';

describe('AddUpdateEntityComponent', () => {
  let component: AddUpdateEntityComponent;
  let fixture: ComponentFixture<AddUpdateEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateEntityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
