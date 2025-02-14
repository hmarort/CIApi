import { TestBed } from '@angular/core/testing';

import { TestsRequest } from './tests.request';

describe('TestsRequest', () => {
  let service: TestsRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestsRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
