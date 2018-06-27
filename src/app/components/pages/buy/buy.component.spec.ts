import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatDividerModule, MatIconModule, MatListModule, MatDialogModule } from '@angular/material';

import { BuyComponent } from './buy.component';
import { PurchaseService } from '../../../services/purchase.service';
import { MockTranslatePipe, MockPurchaseService, MockTellerStatusPipe, MockDateTimePipe } from '../../../utils/test-mocks';

describe('BuyComponent', () => {
  let component: BuyComponent;
  let fixture: ComponentFixture<BuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BuyComponent,
        MockTellerStatusPipe,
        MockDateTimePipe,
        MockTranslatePipe
      ],
      imports: [
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatListModule,
        MatDialogModule
      ],
      providers: [
        { provide: PurchaseService, useClass: MockPurchaseService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
