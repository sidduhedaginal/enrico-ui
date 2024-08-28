import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoshowsubmitComponent } from './poshowsubmit.component';

describe('PoshowsubmitComponent', () => {
  let component: PoshowsubmitComponent;
  let fixture: ComponentFixture<PoshowsubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoshowsubmitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoshowsubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
