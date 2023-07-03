import { TestBed } from '@angular/core/testing';

import { ProviderSettingsService } from './provider-settings.service';

describe('ProviderSettingsService', () => {
  let service: ProviderSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProviderSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
