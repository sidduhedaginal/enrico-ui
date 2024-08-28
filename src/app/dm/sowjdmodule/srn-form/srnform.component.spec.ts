import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrnformComponent } from './srnform.component';

describe('SrnformComponent', () => {
  let component: SrnformComponent;
  let fixture: ComponentFixture<SrnformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrnformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrnformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
