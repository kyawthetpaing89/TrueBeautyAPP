import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeepositionlistComponent } from './employeepositionlist.component';

describe('EmployeepositionlistComponent', () => {
  let component: EmployeepositionlistComponent;
  let fixture: ComponentFixture<EmployeepositionlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeepositionlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeepositionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
