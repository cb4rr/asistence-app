/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PdfGeneratorService } from './pdf-generator.service';

describe('Service: PdfGenerator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PdfGeneratorService]
    });
  });

  it('should ...', inject([PdfGeneratorService], (service: PdfGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
