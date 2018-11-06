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

  undoLastMove(){
    if(this.gameLogs.length <= 1){
      return;
    }
    let lastLog: GameLog = this.gameLogs.pop();
    let sourceDeck: Deck = lastLog.SourceDeck;
    let destDeck: Deck = lastLog.DestDeck;
    let card: Card = lastLog.Card;
    this.deckService.transferCard(card, destDeck, sourceDeck,false);
  }
}
