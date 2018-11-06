import { COLOR, SUIT, RANK, SUITSYMBOLS } from './enums/enums';

export class Card {

  constructor(private _suit: number, private _rank: number) {
  }
  private _color:number = (this._suit == SUIT.DIAMONDS || this._suit == SUIT.HEARTS) ? COLOR.Red : COLOR.Black;
  private _id:string = this._suit + "_" + this._rank;
  private _zIndex:number;

  private _flipped: boolean = false;

  get suit() {
    return this._suit;
  }

  get rank() {
    return this._rank;
  }
  get color() {
    return this._color;
  }
  get id() {
    return this._id;
  }
  get zIndex(){
    return this._zIndex;
  }

  set zIndex(indexNum: number){
    this._zIndex = indexNum;
  }

  get flipped(): boolean {
    return this._flipped;
  }

  flip(): void {
    if (!this._flipped) {
      this._flipped = true;
      return;
    }
    this._flipped = false;
  }

  toString(): string {
    let rank = this.rank;
    let suit = this.suit;
    let rankSymbol: string = "";

    if(rank > RANK.Ten || rank < RANK.Two){
      rankSymbol = RANK[rank];
    }else{
      rankSymbol += rank+1;
    }

    return "  "+rankSymbol +SUITSYMBOLS[suit]+"  ";
  }
  toArray(): Card[]{
    let cardArray: Card[] = [this];
    return cardArray;
  }
}