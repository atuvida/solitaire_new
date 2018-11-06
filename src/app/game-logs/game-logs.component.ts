import { COLOR } from './../enums/enums';
import { DeckService } from './../deck.service';
import { Subscription } from 'rxjs';
import { GameLog } from './../utility.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterContentChecked } from '@angular/core';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'game-logs',
  templateUrl: './game-logs.component.html',
  styleUrls: ['./game-logs.component.scss']
})
export class GameLogsComponent implements OnInit, OnDestroy, AfterContentChecked{
  color = COLOR;

  activeLogs: boolean;
  activeHints: boolean;
  logSubscription: Subscription;
  hintSubscription: Subscription;

  gameLogs: GameLog[];
  gameHints: GameLog[];
  log: any[] = (this.activeHints) ? this.gameHints : this.gameLogs;

  @ViewChild('logsBox') logsCont: ElementRef;
  scrolltop: number = null;

  constructor(private utilityService: UtilityService, private deckService: DeckService) {
    this.gameLogs = this.utilityService.gameLogs;
    this.gameHints = this.utilityService.gameHints;
    this.logSubscription = this.utilityService.getLogStatus().subscribe(NEXT => {this.activeLogs = NEXT});
    this.hintSubscription = this.utilityService.getHintStatus().subscribe(NEXT => {this.activeHints = NEXT});
  }

  ngOnInit() {
  }

  ngAfterContentChecked(){
    this.scrolltop = this.logsCont.nativeElement.scrollHeight;
  }

  ngOnDestroy(): void{
    this.logSubscription.unsubscribe();
    this.hintSubscription.unsubscribe();
  }   
}
