import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelformComponent } from './cancelform.component';

describe('CancelformComponent', () => {
  let component: CancelformComponent;
  let fixture: ComponentFixture<CancelformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
