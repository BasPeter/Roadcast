import { TestBed } from '@angular/core/testing';

import { SinglePostPageResolverService } from './single-post-page-resolver.service';

describe('SinglePostPageResolverService', () => {
  let service: SinglePostPageResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SinglePostPageResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
