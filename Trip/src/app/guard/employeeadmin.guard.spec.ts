import { TestBed } from '@angular/core/testing';

import { EmployeeAdminGuard } from './employee-admin-guard.service';

describe('EmployeeadminGuard', () => {
  let guard: EmployeeAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EmployeeAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
