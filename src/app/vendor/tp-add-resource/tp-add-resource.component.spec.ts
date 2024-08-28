import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpAddResourceComponent } from './tp-add-resource.component';

describe('TpAddResourceComponent', () => {
  let component: TpAddResourceComponent;
  let fixture: ComponentFixture<TpAddResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpAddResourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TpAddResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
