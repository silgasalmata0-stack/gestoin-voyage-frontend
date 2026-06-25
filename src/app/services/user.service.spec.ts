import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service'; // Importe la classe UserService

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient() // Indispensable pour injecter HttpClient dans le service
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});