import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateEmailComponent } from './add-update-email.component';

describe('AddUpdateEmailComponent', () => {
  let component: AddUpdateEmailComponent;
  let fixture: ComponentFixture<AddUpdateEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
