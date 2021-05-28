import { TestBed } from '@angular/core/testing';

import { AddTripGuard } from './add-trip.guard';

describe('AddTripGuard', () => {
  let guard: AddTripGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AddTripGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
