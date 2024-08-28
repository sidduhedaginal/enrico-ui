import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqformComponent } from './rfqform.component';

describe('RfqformComponent', () => {
  let component: RfqformComponent;
  let fixture: ComponentFixture<RfqformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
