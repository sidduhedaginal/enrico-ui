import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhDetailComponent } from './dh-detail.component';

describe('DhDetailComponent', () => {
  let component: DhDetailComponent;
  let fixture: ComponentFixture<DhDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DhDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
