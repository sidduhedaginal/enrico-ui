import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdDocumentsComponent } from './sowjd-documents.component';

describe('SowjdDocumentsComponent', () => {
  let component: SowjdDocumentsComponent;
  let fixture: ComponentFixture<SowjdDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
