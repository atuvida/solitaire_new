import { DeckTypes, RANK } from './enums/enums';
import { Card } from './card';

export class Deck {

  cards: Card[] = [];

  constructor(private _id: string, private _type: DeckTypes) {
  }

  addCard(card: Card): void {
    this.cards.push(card);
  }

  removeTop(): Card {
    return this.cards.pop();
  }

  isEmpty(): boolean {
    return this.cards.length == 0;
  }

  get size(): number {
    return this.cards.length;
  }

  get id(): string {
    return this._id;
  }

  get topCard(): Card {
    return this.cards[this.size-1];
  }

  flipTop(): void {
    this.topCard.flip();
  }

  get type(): number {
    return this._type;
  }

  get firstUpCard(): Card{
    for(let i = 0; i <this.size; i++){
      if(this.cards[i].flipped){
        return this.cards[i];
      }
    }
  }

  
  createSetFrom(card: Card): Card[] {
    let index = this.cards.indexOf(card);
    let cardSet = this.cards.splice(index, this.size - index);
    return cardSet;
  }

  addSet(cardset: Card[]): void {
    while(cardset.length > 0) {
      let card = cardset.splice(0, 1);
      if(this.type == DeckTypes.Waste){
        if(!card[0].flipped){
          card[0].flip();
        }
      }
      if(this.type == DeckTypes.Talon){
        if(card[0].flipped){
          card[0].flip();
        }
      }
      this.addCard(card[0]);
    }
  }

  contains(card: Card): boolean {
    return this.cardIndex(card) !== -1;
  }

  cardIndex(card: Card): number {
    return this.cards.indexOf(card);
  }
  deckOf(card: Card):boolean{
    return this.cards.indexOf(card)!==-1;
  }

  canAccept(card: Card): boolean{
    if(this.type == DeckTypes.Foundation){
      if(this.isEmpty() && card.rank == RANK.A){
        return true;
      }
      if(!this.isEmpty() && card.rank == this.topCard.rank+1 && card.suit == this.topCard.suit){
        return true;
      }
      return false;
    }

    if(this.type == DeckTypes.Maneuver){
      if(this.isEmpty() && card.rank == RANK.K){
        return true;
      }
      if(!this.isEmpty() && card.color !== this.topCard.color && card.rank == this.topCard.rank-1){
        return true;
      }
      return false;
    }
  }

  clear(){
    this.cards = [];
    while(!this.isEmpty()){
      this.removeTop();
    }
  }

  get nextTop(): Card{
    return this.cards[this.size-2];
  }

  get baseCard(): Card{
    return this.cards[0];
  }
}