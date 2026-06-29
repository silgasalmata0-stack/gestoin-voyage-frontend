import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeCreate } from './demande-create';

describe('DemandeCreate', () => {
  let component: DemandeCreate;
  let fixture: ComponentFixture<DemandeCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(DemandeCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
