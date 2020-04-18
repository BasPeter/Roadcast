import { TestBed } from '@angular/core/testing';

import { OverviewPageResolverService } from './overview-page-resolver.service';

describe('OverviewPageResolverService', () => {
  let service: OverviewPageResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverviewPageResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
