import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdSignoffListComponent } from './sowjd-signoff-list.component';

describe('SowjdSignoffListComponent', () => {
  let component: SowjdSignoffListComponent;
  let fixture: ComponentFixture<SowjdSignoffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdSignoffListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdSignoffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
