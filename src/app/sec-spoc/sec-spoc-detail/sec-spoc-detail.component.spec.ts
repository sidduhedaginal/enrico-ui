import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecSpocDetailComponent } from './sec-spoc-detail.component';

describe('SecSpocDetailComponent', () => {
  let component: SecSpocDetailComponent;
  let fixture: ComponentFixture<SecSpocDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecSpocDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecSpocDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
