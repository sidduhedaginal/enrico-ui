import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatsnakbarComponent } from './matsnakbar.component';

describe('MatsnakbarComponent', () => {
  let component: MatsnakbarComponent;
  let fixture: ComponentFixture<MatsnakbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatsnakbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatsnakbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
