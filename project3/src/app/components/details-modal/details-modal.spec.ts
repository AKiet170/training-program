import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsModal } from './details-modal';

describe('DetailsModal', () => {
  let component: DetailsModal;
  let fixture: ComponentFixture<DetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
