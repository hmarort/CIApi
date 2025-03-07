import { TestBed } from '@angular/core/testing';

import { TestsFacade } from './tests.facade';

describe('TestsFacade', () => {
  let service: TestsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestsFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
