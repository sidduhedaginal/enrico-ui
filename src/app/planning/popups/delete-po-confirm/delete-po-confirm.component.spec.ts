import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePoConfirmComponent } from './delete-po-confirm.component';

describe('DeletePoConfirmComponent', () => {
  let component: DeletePoConfirmComponent;
  let fixture: ComponentFixture<DeletePoConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePoConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePoConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
