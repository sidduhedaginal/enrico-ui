import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSkillSetMasterComponent } from './create-skill-set-master.component';

describe('CreateSkillSetMasterComponent', () => {
  let component: CreateSkillSetMasterComponent;
  let fixture: ComponentFixture<CreateSkillSetMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSkillSetMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSkillSetMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
