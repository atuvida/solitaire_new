import { DeckTypes, COLOR } from './enums/enums';
import { GameLog } from './utility.service';
import { Card } from './card';
import { Deck } from './deck';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface GameLog {
  DestDeck?: Deck;
  Card?: Card;
  CardSet?: Card[];
  SourceDeck?: Deck;
  Detail1?: string;
  toString();
}

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  overlayText: string[] = ['Your Game Is Ready'];
  winGameTexts: string[] = ['You\'re Awesome!', 'You Won!', 'Congratulations!', 'Good Job!', 'Excellent', 'Fantastic!', 'Well Done!'];
  currentWinText: string = '';
  gameHints: GameLog[] = [];
  initLog: GameLog = { toString: () => { return "GAME HAS STARTED"; } };
  gameLogs: GameLog[] = [this.initLog];
  gameOptions: string[] = ['START'];


  constructor() { }

  private statusSubject = new Subject<boolean>();
  private logStatus = new Subject<boolean>();
  private hintStatus = new Subject<boolean>();

  createLog(source: Deck, target: Deck, card: Card, cardset: Card[]) {
    let cardSetCopy: Card[] = cardset.slice();

    let log: GameLog = {
      SourceDeck: source, DestDeck: target,
      Card: card, Detail1: "", CardSet: cardSetCopy
    };

    let cardsToStrings = "";

    for(let i: number = 0; i < log.CardSet.length; i++){
      cardsToStrings += log.CardSet[i].toString()+" ";
    }
    log.Detail1 = cardsToStrings;
    log.toString = () => {
      return log.SourceDeck.id + " to " + log.DestDeck.id;
    }
    this.gameLogs.push(log);
  }

  clearLogs() {
    while (this.gameLogs.length > 0) {
      this.gameLogs.pop();
    }
    this.gameLogs.push(this.initLog);
  }

  getLog(): GameLog {
    return this.gameLogs.pop();
  }

  setStatus(status: boolean) {
    this.statusSubject.next(status);
  }

  getStatus(): Observable<any> {
    return this.statusSubject.asObservable();
  }

  getLogStatus(): Observable<any> {
    return this.logStatus.asObservable();
  }

  setLogStatus(status: boolean) {
    this.logStatus.next(status);
  }

  getHintStatus(): Observable<any> {
    return this.hintStatus.asObservable();
  }

  setHintStatus(status: boolean) {
    this.hintStatus.next(status);
  }

  createHint(source: Deck, card: Card, target: Deck) {

    let hint: GameLog = {
      SourceDeck: source, DestDeck: target,
      Card: card
    };
    let cardset = '';
    
    for(let i=source.cardIndex(card); i<source.size; i++){
      cardset += source.cards[i].toString()+" ";
    }
    hint.Detail1 = cardset;
    hint.toString = () => {
      return hint.SourceDeck.id + " to " + hint.DestDeck.id;
    }
    this.gameHints.push(hint);
  }

  clearHints() {
    while (this.gameHints.length > 0) {
      this.gameHints.pop();
    }
  }

  updateWinTexts(): void {
    this.currentWinText = this.winGameTexts[Math.floor(Math.random() * this.winGameTexts.length)];
  }

  gameWon(): void {
    this.updateWinTexts();
    this.setHintStatus(false);
    this.setLogStatus(false);
    this.setStatus(true);
    this.setOverLayText('win');
  }

  setOverLayText(state: string) {
    if (state == 'win') {
      this.overlayText.pop();
      this.overlayText.push(this.currentWinText);
      this.setGameOptions(['RESTART', 'NEW GAME']);
    } else {
      this.overlayText.pop();
      this.overlayText.push('Your Game Is Ready');
      this.setGameOptions(['START']);
    }
  }

  setGameOptions(options: string[]) {

    while (this.gameOptions.length > 0) {
      this.gameOptions.pop();
    }

    while (options.length > 0) {
      this.gameOptions.push(options.pop());
    }
  }

  noSuggestedMove() {
    this.gameHints.push({ toString: () => { return "NO SUGGESTED MOVE"; } });
  }
}