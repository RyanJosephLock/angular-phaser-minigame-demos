import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameXpComponent } from './game-xp.component';

describe('GameXpComponent', () => {
  let component: GameXpComponent;
  let fixture: ComponentFixture<GameXpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameXpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameXpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
