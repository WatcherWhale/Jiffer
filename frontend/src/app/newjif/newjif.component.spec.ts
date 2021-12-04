import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewjifComponent } from './newjif.component';

describe('NewjifComponent', () => {
  let component: NewjifComponent;
  let fixture: ComponentFixture<NewjifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewjifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewjifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
