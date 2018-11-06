import { UtilityService } from './utility.service';
import { DeckService } from './deck.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameControlService {

  constructor(private deckService: DeckService, private utilityService: UtilityService) { }

  initializeGame(){
      this.deckService.generateMainDeck();
      this.deckService.shuffleDeckCards();
      this.deckService.mainDeckCopy.clear();
      this.deckService.copyDeck(this.deckService.mainDeckCopy,this.deckService.mainDeck);
      this.deckService.createGameDecks();
      this.deckService.distributeCards();
  }

  restartGame(){
    this.clearHintsLogs();
    this.deckService.clearDecks();
    this.deckService.copyDeck(this.deckService.mainDeck,this.deckService.mainDeckCopy);
    setTimeout(() => {
      this.deckService.distributeCards();
    }, 400);
  }

  newGame(){
    this.clearHintsLogs();
    this.deckService.clearDecks();     
    this.deckService.generateMainDeck();
    this.deckService.mainDeckCopy.clear();
    this.deckService.shuffleDeckCards();
    this.deckService.copyDeck(this.deckService.mainDeckCopy,this.deckService.mainDeck);
    setTimeout(() => {
      this.deckService.distributeCards();
    }, 400);
  }

  clearHintsLogs(){
    this.utilityService.clearHints();
    this.utilityService.clearLogs();
    this.utilityService.setHintStatus(false);
    this.utilityService.setLogStatus(false);
  }

}
