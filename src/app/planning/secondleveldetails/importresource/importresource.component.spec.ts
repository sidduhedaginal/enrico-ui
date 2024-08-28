import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportresourceComponent } from './importresource.component';

describe('ImportresourceComponent', () => {
  let component: ImportresourceComponent;
  let fixture: ComponentFixture<ImportresourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportresourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportresourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
