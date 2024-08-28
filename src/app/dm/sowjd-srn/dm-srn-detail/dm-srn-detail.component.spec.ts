import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmSrnDetailComponent } from './dm-srn-detail.component';

describe('DmSrnDetailComponent', () => {
  let component: DmSrnDetailComponent;
  let fixture: ComponentFixture<DmSrnDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmSrnDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmSrnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
