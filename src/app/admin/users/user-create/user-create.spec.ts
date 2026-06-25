import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCreate } from './user-create';
import { UserService } from '../../../services/user.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest'; // Import essentiel pour Vitest

describe('UserCreate', () => {
  let component: UserCreate;
  let fixture: ComponentFixture<UserCreate>;

  beforeEach(async () => {
    // Avec Vitest, on utilise 'vi.fn()' pour créer un espion (mock)
    const userServiceMock = {
      creerUtilisateur: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [UserCreate],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});