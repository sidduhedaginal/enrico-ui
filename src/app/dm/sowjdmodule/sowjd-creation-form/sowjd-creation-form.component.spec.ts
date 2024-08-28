import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdCreationFormComponent } from './sowjd-creation-form.component';

describe('SowjdCreationFormComponent', () => {
  let component: SowjdCreationFormComponent;
  let fixture: ComponentFixture<SowjdCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SowjdCreationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SowjdCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// comment
