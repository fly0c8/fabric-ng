import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricViewComponent } from './fabric-view.component';

describe('FabricViewComponent', () => {
  let component: FabricViewComponent;
  let fixture: ComponentFixture<FabricViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
