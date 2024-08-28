import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestTableComponent } from './change-request-table.component';

describe('ChangeRequestTableComponent', () => {
  let component: ChangeRequestTableComponent;
  let fixture: ComponentFixture<ChangeRequestTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeRequestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
