import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCFCycleMasterComponent } from './create-cfcycle-master.component';

describe('CreateCFCycleMasterComponent', () => {
  let component: CreateCFCycleMasterComponent;
  let fixture: ComponentFixture<CreateCFCycleMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCFCycleMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCFCycleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
