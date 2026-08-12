import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AddressApiService } from './address-api.service';
import type { Address, AddressInput } from '../types/address.interface';

const serverAddress: Address = {
  id: 'addr-1',
  userId: 'u-1',
  label: 'Casa',
  street: 'Calle 1',
  city: 'Santo Domingo',
  state: 'Distrito Nacional',
  zipCode: '10101',
  country: 'República Dominicana',
  isDefault: true,
};

describe('AddressApiService', () => {
  let service: AddressApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(AddressApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('list GETs /api/addresses and unwraps the envelope', () => {
    let result: unknown;
    service.list().subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/addresses');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [serverAddress] });
    expect(result).toEqual([serverAddress]);
  });

  it('getById GETs /api/addresses/:id', () => {
    service.getById('addr-1').subscribe();
    const req = httpTesting.expectOne('/api/addresses/addr-1');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: serverAddress });
  });

  it('create POSTs the input to /api/addresses', () => {
    const input: AddressInput = {
      label: 'Oficina',
      street: 'Av. 2',
      city: 'Santiago',
      state: 'Santiago',
      zipCode: '51000',
      country: 'República Dominicana',
    };
    let result: unknown;
    service.create(input).subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/addresses');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush({ success: true, data: { ...serverAddress, label: 'Oficina' } });
    expect((result as Address).label).toBe('Oficina');
  });

  it('update PATCHes /api/addresses/:id with partial input', () => {
    let result: unknown;
    service.update('addr-1', { city: 'La Vega' }).subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/addresses/addr-1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ city: 'La Vega' });
    req.flush({ success: true, data: { ...serverAddress, city: 'La Vega' } });
    expect((result as Address).city).toBe('La Vega');
  });

  it('delete DELETEs /api/addresses/:id', () => {
    let completed = false;
    service.delete('addr-1').subscribe({ complete: () => (completed = true) });
    const req = httpTesting.expectOne('/api/addresses/addr-1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true, data: null });
    expect(completed).toBe(true);
  });

  it('reports 400 as an HttpErrorResponse with the backend envelope', () => {
    let caught: HttpErrorResponse | undefined;
    service.create({} as AddressInput).subscribe({ error: (e: HttpErrorResponse) => (caught = e) });

    const req = httpTesting.expectOne('/api/addresses');
    req.flush(
      { success: false, message: 'Invalid request', statusCode: 400, code: 'VALIDATION_ERROR' },
      { status: 400, statusText: 'Bad Request' }
    );
    expect(caught?.status).toBe(400);
  });

  it('reports 401 for an unauthenticated request', () => {
    let caught: HttpErrorResponse | undefined;
    service.list().subscribe({ error: (e: HttpErrorResponse) => (caught = e) });

    const req = httpTesting.expectOne('/api/addresses');
    req.flush(
      { success: false, message: 'Unauthorized', statusCode: 401, code: 'UNAUTHORIZED' },
      { status: 401, statusText: 'Unauthorized' }
    );
    expect(caught?.status).toBe(401);
  });

  it('reports 404 when the address does not exist', () => {
    let caught: HttpErrorResponse | undefined;
    service.update('missing', { city: 'X' }).subscribe({ error: (e: HttpErrorResponse) => (caught = e) });

    const req = httpTesting.expectOne('/api/addresses/missing');
    req.flush(
      { success: false, message: 'Address not found', statusCode: 404, code: 'NOT_FOUND' },
      { status: 404, statusText: 'Not Found' }
    );
    expect(caught?.status).toBe(404);
  });
});
