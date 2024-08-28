import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoViewOnlyComponent } from './po-view-only.component';

describe('PoViewOnlyComponent', () => {
  let component: PoViewOnlyComponent;
  let fixture: ComponentFixture<PoViewOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoViewOnlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoViewOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
