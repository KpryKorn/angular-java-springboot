import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { taskExistsGuard } from './task-exists.guard';

describe('taskExistsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => taskExistsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
