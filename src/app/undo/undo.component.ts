import { DeckService } from './../deck.service';
import { Card } from './../card';
import { Deck } from './../deck';
import { Subscription } from 'rxjs';
import { GameLog, UtilityService } from './../utility.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-undo',
  templateUrl: './undo.component.html',
  styleUrls: ['./undo.component.scss']
})
export class UndoComponent implements OnInit {
  
  gameLogs: GameLog[]=[];

  constructor(private utilityService: UtilityService, private deckService: DeckService) {
    this.gameLogs = this.utilityService.gameLogs;
  }

  ngOnInit() {
  }

  gameStat():boolean{
  
    return this.deckService.maneuversCleared() ? true : this.gameLogs.length == 1;
  }
  undoLastMove(){
    if(this.utilityService.gameLogs.length <= 1){
      return;
    }
    let lastLog: GameLog = this.utilityService.getLog();
    let destDeck: Deck = lastLog.SourceDeck;
    let sourceDeck: Deck = lastLog.DestDeck;
    let card: Card = lastLog.Card;
    let cardSet = lastLog.CardSet;

    if(!sourceDeck.contains(card)){
      return;
    }else{
      this.deckService.transferCard(card, sourceDeck, destDeck,false, cardSet);
    }
  }
}
