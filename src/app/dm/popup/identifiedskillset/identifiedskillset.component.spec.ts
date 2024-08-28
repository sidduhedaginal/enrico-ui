import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifiedskillsetComponent } from './identifiedskillset.component';

describe('IdentifiedskillsetComponent', () => {
  let component: IdentifiedskillsetComponent;
  let fixture: ComponentFixture<IdentifiedskillsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentifiedskillsetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentifiedskillsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
