import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfeComponent } from './tfe.component';

describe('TfeComponent', () => {
  let component: TfeComponent;
  let fixture: ComponentFixture<TfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TfeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
