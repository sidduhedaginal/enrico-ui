import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidthdrawComponent } from './widthdraw.component';

describe('WidthdrawComponent', () => {
  let component: WidthdrawComponent;
  let fixture: ComponentFixture<WidthdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidthdrawComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidthdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
