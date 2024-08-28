import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportNTIDComponent } from './import-ntid.component';

describe('ImportNTIDComponent', () => {
  let component: ImportNTIDComponent;
  let fixture: ComponentFixture<ImportNTIDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportNTIDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportNTIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
