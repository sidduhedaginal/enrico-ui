import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdSignoffDetailComponent } from './sowjd-signoff-detail.component';

describe('SowjdSignoffDetailComponent', () => {
  let component: SowjdSignoffDetailComponent;
  let fixture: ComponentFixture<SowjdSignoffDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdSignoffDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdSignoffDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
