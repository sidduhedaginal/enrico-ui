import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdSrnListComponent } from './sowjd-srn-list.component';

describe('SowjdSrnListComponent', () => {
  let component: SowjdSrnListComponent;
  let fixture: ComponentFixture<SowjdSrnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdSrnListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdSrnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
