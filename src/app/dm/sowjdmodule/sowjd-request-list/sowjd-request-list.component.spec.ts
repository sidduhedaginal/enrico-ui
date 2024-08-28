import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdRequestListComponent } from './sowjd-request-list.component';

describe('SowjdRequestListComponent', () => {
  let component: SowjdRequestListComponent;
  let fixture: ComponentFixture<SowjdRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdRequestListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
