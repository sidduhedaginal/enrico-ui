import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillmasterComponent } from './skillmaster.component';

describe('SkillmasterComponent', () => {
  let component: SkillmasterComponent;
  let fixture: ComponentFixture<SkillmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
