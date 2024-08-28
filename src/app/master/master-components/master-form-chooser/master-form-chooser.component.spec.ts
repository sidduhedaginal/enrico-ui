import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterFormChooserComponent } from './master-form-chooser.component';

describe('MasterFormChooserComponent', () => {
  let component: MasterFormChooserComponent;
  let fixture: ComponentFixture<MasterFormChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterFormChooserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterFormChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
