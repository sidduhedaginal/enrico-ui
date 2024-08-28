import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCfMasterComponent } from './create-cf-master.component';

describe('CreateCfMasterComponent', () => {
  let component: CreateCfMasterComponent;
  let fixture: ComponentFixture<CreateCfMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCfMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCfMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
