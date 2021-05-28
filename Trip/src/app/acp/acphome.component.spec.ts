import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ACPHomeComponent } from './acphome.component';

describe('ACPHomeComponent', () => {
  let component: ACPHomeComponent;
  let fixture: ComponentFixture<ACPHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ACPHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ACPHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
