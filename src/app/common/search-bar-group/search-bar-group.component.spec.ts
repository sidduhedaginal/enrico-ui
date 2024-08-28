import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarGroupComponent } from './search-bar-group.component';

describe('SearchBarGroupComponent', () => {
  let component: SearchBarGroupComponent;
  let fixture: ComponentFixture<SearchBarGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchBarGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
