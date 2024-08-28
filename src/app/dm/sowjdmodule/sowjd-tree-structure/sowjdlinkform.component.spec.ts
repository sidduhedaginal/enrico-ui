import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowjdlinkformComponent } from './sowjdlinkform.component';


describe('SowjdlinkformComponent', () => {
  let component: SowjdlinkformComponent;
  let fixture: ComponentFixture<SowjdlinkformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SowjdlinkformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowjdlinkformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
