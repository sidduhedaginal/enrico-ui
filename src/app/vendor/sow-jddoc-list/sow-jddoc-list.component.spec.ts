import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowJDDocListComponent } from './sow-jddoc-list.component';

describe('SowJDDocListComponent', () => {
  let component: SowJDDocListComponent;
  let fixture: ComponentFixture<SowJDDocListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowJDDocListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowJDDocListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
