import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridHeaderSelectComponent } from './grid-header-select.component';

describe('GridHeaderSelectComponent', () => {
  let component: GridHeaderSelectComponent;
  let fixture: ComponentFixture<GridHeaderSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridHeaderSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridHeaderSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
