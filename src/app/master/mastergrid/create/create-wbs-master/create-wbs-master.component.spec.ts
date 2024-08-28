import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWbsMasterComponent } from './create-wbs-master.component';

describe('CreateWbsMasterComponent', () => {
  let component: CreateWbsMasterComponent;
  let fixture: ComponentFixture<CreateWbsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWbsMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateWbsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
