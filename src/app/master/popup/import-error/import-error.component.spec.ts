import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportErrorComponent } from './import-error.component';

describe('ImportErrorComponent', () => {
  let component: ImportErrorComponent;
  let fixture: ComponentFixture<ImportErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
