import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceLoaderUiComponent } from './resource-loader-ui.component';

describe('ResourceLoaderUiComponent', () => {
  let component: ResourceLoaderUiComponent;
  let fixture: ComponentFixture<ResourceLoaderUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceLoaderUiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceLoaderUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
