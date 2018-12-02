import { DeckTypes, RANK, SUIT, FLIPS } from './enums/enums';
import { UtilityService } from './utility.service';
import { Deck } from './deck';
import { Card } from './card';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  constructor(private utilityService: UtilityService) { }

  mainDeck: Deck;
  mainDeckCopy: Deck = new Deck('deckCopy', DeckTypes.Main);
  talon: Deck = new Deck('TALON', DeckTypes.Talon);
  waste: Deck = new Deck('WASTE', DeckTypes.Waste);
  maneuvers: Deck[] = new Array<Deck>(7);
  foundations: Deck[] = new Array<Deck>(4);
  hintsCheck: boolean = false;
  zIndex: number = 100;
  playableDecks: Deck[][] = [this.maneuvers, this.foundations, [this.waste], [this.talon]];
  flipCount: number = FLIPS.HARDMODE;
  gameWon: boolean = false;

  generateMainDeck(): void {

    let maxRank = Object.keys(RANK).length / 2.
    let maxSuit = Object.keys(SUIT).length / 2.

    this.mainDeck = new Deck('Main', DeckTypes.Main);

    for (let rank = 0; rank < maxRank; rank++) {
      for (let suit = 0; suit < maxSuit; suit++) {
        let card = new Card(suit, rank);
        this.mainDeck.addCard(card);
      }
    }
  }

  createGameDecks() {
    for (let i = 0; i < this.maneuvers.length; i++) {
      let maneuver = new Deck('MANEUVER' + (i + 1), DeckTypes.Maneuver);
      this.maneuvers[i] = maneuver;
    }

    for (let i = 0; i < this.foundations.length; i++) {
      let foundation = new Deck('FOUNDATION' + (i + 1), DeckTypes.Foundation);
      this.foundations[i] = foundation;
    }
  }

  shuffleDeckCards(): void {
    for (let i = this.mainDeck.size - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.mainDeck.cards[i];
      this.mainDeck.cards[i] = this.mainDeck.cards[j];
      this.mainDeck.cards[j] = temp;
    }
  }

  distributeCards() {
    for (let i = 0; i < this.maneuvers.length; i++) {
      for (let j = i; j < this.maneuvers.length; j++) {
        let topCard = this.mainDeck.removeTop();
        let maneuver = this.maneuvers[j];
        maneuver.addCard(topCard);
      }
      this.maneuvers[i].flipTop();
    }

    while (!this.mainDeck.isEmpty()) {
      let topCard = this.mainDeck.removeTop();
      this.talon.addCard(topCard);
    }
  }

  autoPlayCard(card: Card, sourceDeck: Deck): void {
    let DeckAreas = [this.foundations, this.maneuvers];
    for (let i = 0; i < DeckAreas.length; i++) {
      for (let j = 0; j < DeckAreas[i].length; j++) {
        let deck = DeckAreas[i][j];
        if (deck.canAccept(card)) {
          if (deck.type == DeckTypes.Foundation && card !== sourceDeck.topCard) {
            return;
          }
          if (this.hintsCheck) {
            this.utilityService.createHint(sourceDeck, card, deck);
            return;
          }

          this.transferCard(card, sourceDeck, deck, true);

          if (this.allCardsFlipped()) {
            if(!this.gameWon){
              this.gameWon = true;
              this.clearManeuvers();
              this.utilityService.gameWon();
            }
            return;
          }
          this.suggestNextMove();
          return;
        }
      }
    }
  }

  index = 0;
  clearManeuvers() {
    let cardsToClear = 0;

    for (let i = 0; i < this.maneuvers.length; i++) {
      cardsToClear += this.maneuvers[i].size;
    }

    if (cardsToClear > 0) {
      let deck = this.maneuvers[this.index];
      if (this.index < 6) {
        this.index++;
      } else {
        this.index = 0;
      }
      if (!deck.isEmpty()) {
        this.autoPlayCard(deck.topCard, deck);
        setTimeout(() => {
          this.clearManeuvers();
        }, 300);
      } else {
          this.clearManeuvers();
      }
    }
  }

  suggestNextMove() {
    this.utilityService.clearHints();
    for (let i = 0; i < this.maneuvers.length; i++) {
      if (!this.maneuvers[i].isEmpty()) {
        let card = this.maneuvers[i].topCard;
        this.hintsCheck = true;
        this.autoPlayCard(card, this.maneuvers[i]);
      }
    }
    for (let i = 0; i < this.maneuvers.length; i++) {
      if (!this.maneuvers[i].isEmpty()) {
        let card = this.maneuvers[i].firstUpCard;
        if (card !== undefined) {
          if (card !== this.maneuvers[i].topCard) {
            this.hintsCheck = true;
            this.autoPlayCard(card, this.maneuvers[i]);
          }
        }
      }
    }

    if (!this.waste.isEmpty()) {
      let card = this.waste.topCard;
      this.hintsCheck = true;
      this.autoPlayCard(card, this.waste);
    }
    if (this.utilityService.gameHints.length == 0) {
      this.utilityService.noSuggestedMove();
    }

    this.hintsCheck = false;
  }

  maneuversCleared(): boolean {
    for (let i = 0; i < this.maneuvers.length; i++) {
      if (!this.maneuvers[i].isEmpty()) {
        return false;
      }
    }
    return true;
  }

  foundationsComplete(): boolean {
    for (let i = 0; i < this.foundations.length; i++) {
      if (this.foundations[i].size < 13) {
        return false;
      }
    }
    return true;
  }

  allCardsFlipped(): boolean {
    if (!this.talon.isEmpty() || !this.waste.isEmpty()) {
      return false;
    }

    for (let i = 0; i < this.maneuvers.length; i++) {
      if (!this.maneuvers[i].isEmpty()) {
        if (!this.maneuvers[i].baseCard.flipped) {
          return false;
        }
      }
    }
    return true;
  }

  clearDecks() {
    let decks = this.playableDecks;
    for (let i = 0; i < decks.length; i++) {
      for (let j = 0; j < decks[i].length; j++) {
        decks[i][j].clear();
      }
    }
    this.mainDeck.clear();
  }

  copyDeck(targetDeck: Deck, deckSource: Deck) {
    let index = 0;
    while (index < deckSource.size) {
      if (deckSource.cards[index].flipped) {
        deckSource.cards[index].flip();
      }
      targetDeck.addCard(deckSource.cards[index]);
      index++;
    }
  }

  getDeck(DeckId: String): Deck {
    let decks = this.playableDecks;
    let deck: Deck;
    for (let i = 0; i < decks.length; i++) {
      for (let j = 0; j < decks[i].length; j++) {
        deck = decks[i][j];
        if (deck.id == DeckId) {
          return deck;
        }
      }
    }
  }
  getCardInstance(id: string): Card {
    let info = id.split('_');
    let suit = +info[0];
    let rank = +info[1];
    let card = new Card(suit, rank);
    card.flip();
    return card;
  }

  transferCard(card: Card, sourceDeck: Deck, destDeck: Deck, toLog: boolean, CardSet?: Card[]) {

    let cardset: Card[] = [];

    if (!toLog) {
      if (destDeck.type == DeckTypes.Maneuver) {
        if (!destDeck.isEmpty()) {
          if (destDeck.size == 1) {
            if (destDeck.topCard.flipped) {
              destDeck.flipTop();
            }
          }
          if (destDeck.size > 1) {
            if (destDeck.topCard.flipped && !destDeck.nextTop.flipped) {
              destDeck.flipTop();
            }
          }
        }
        cardset = sourceDeck.createSetFrom(card);
      }

      if (sourceDeck.type == DeckTypes.Waste && destDeck.type == DeckTypes.Talon) {
        cardset = sourceDeck.createSetFrom(sourceDeck.cards[sourceDeck.size - CardSet.length]).reverse();
        sourceDeck.flipFromFirstDownCards(cardset.length);
      }
      if (sourceDeck.type == DeckTypes.Talon) {
        cardset = sourceDeck.cards.reverse();
      }
      if (destDeck.type == DeckTypes.Waste && sourceDeck.type !== DeckTypes.Talon
        || destDeck.type == DeckTypes.Foundation) {
        cardset = sourceDeck.createSetFrom(card)
      }
      if (sourceDeck.type == DeckTypes.Maneuver && !sourceDeck.isEmpty()) {
        if (!sourceDeck.topCard.flipped) {
          sourceDeck.topCard.flip();
        }
      }
      if (destDeck.type == DeckTypes.Waste && (sourceDeck.type == DeckTypes.Maneuver || sourceDeck.type == DeckTypes.Foundation)) {
        destDeck.flipFromFirstUpCards(1);
      }
      destDeck.addSet(cardset);
      return;
    }
    cardset = sourceDeck.createSetFrom(card);
    this.utilityService.createLog(sourceDeck, destDeck, card, cardset);


    if (sourceDeck.type == DeckTypes.Talon || sourceDeck.type == DeckTypes.Waste) {
      cardset.reverse();
      if (sourceDeck.type == DeckTypes.Waste) {
        sourceDeck.flipFromFirstDownCards(cardset.length);
      }
      destDeck.addSet(cardset);
      return;
    }

    destDeck.addSet(cardset);

    if (!sourceDeck.isEmpty()) {
      if (!sourceDeck.topCard.flipped
        && (sourceDeck.type !== DeckTypes.Talon && sourceDeck.type !== DeckTypes.Waste)) {
        sourceDeck.flipTop();
      }
    }
  }
}