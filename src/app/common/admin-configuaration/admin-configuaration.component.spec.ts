import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConfiguarationComponent } from './admin-configuaration.component';

describe('AdminConfiguarationComponent', () => {
  let component: AdminConfiguarationComponent;
  let fixture: ComponentFixture<AdminConfiguarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminConfiguarationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminConfiguarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
