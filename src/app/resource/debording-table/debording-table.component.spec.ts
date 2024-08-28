import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebordingTableComponent } from './debording-table.component';

describe('DebordingTableComponent', () => {
  let component: DebordingTableComponent;
  let fixture: ComponentFixture<DebordingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebordingTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebordingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
