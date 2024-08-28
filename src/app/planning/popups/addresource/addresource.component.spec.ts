import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddresourceComponent } from './addresource.component';

describe('AddresourceComponent', () => {
  let component: AddresourceComponent;
  let fixture: ComponentFixture<AddresourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddresourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddresourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
