import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedNTIDComponent } from './imported-ntid.component';

describe('ImportedNTIDComponent', () => {
  let component: ImportedNTIDComponent;
  let fixture: ComponentFixture<ImportedNTIDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportedNTIDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportedNTIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
