import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedfileComponent } from './importedfile.component';

describe('ImportedfileComponent', () => {
  let component: ImportedfileComponent;
  let fixture: ComponentFixture<ImportedfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportedfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportedfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
