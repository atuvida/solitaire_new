import { maneuverAnimation, wasteAnimation, talonAnimation, foundationAnim} from './animations';
import { Subscription } from 'rxjs';
import { UtilityService } from './utility.service';
import { MODE, DeckTypes } from './enums/enums';
import { Card } from './card';
import { GameControlService } from './game-control.service';
import { DeckService } from './deck.service';
import { Deck } from './deck';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [maneuverAnimation, foundationAnim, wasteAnimation, talonAnimation]
})
export class AppComponent implements OnInit, OnDestroy {
  activeOverlay: boolean = true;
  subscription: Subscription;
  maneuvers: Deck[] = this.deckService.maneuvers;
  foundations: Deck[] = this.deckService.foundations;
  waste: Deck = this.deckService.waste;
  talon: Deck = this.deckService.talon;
  innerWidth: number = window.innerWidth;
  onMobileWindow: boolean = this.innerWidth <= 800;

  posX: number = 0;
  posY: number = 0;
  startPosX: number = 0;
  startPosY: number = 0;
  lastPosX: number = 0;
  lastPosY: number = 0;
  resetPos: boolean = true;
  gameMode: number = MODE.Hard;

  dragging: boolean = false;
  startDrag: boolean = false;
  fromDrag: boolean = false;

  cardOnPlay: Card;
  sourceDeckOnPlay: Deck;
  droppable: Element = null;

  selected: any;

  constructor(private deckService: DeckService,
    private gameControl: GameControlService,
    private utilityService: UtilityService) {
      this.subscription = this.utilityService.getStatus().subscribe(NEXT => {this.activeOverlay = NEXT});
  }

  ngOnInit() {
    this.gameControl.initializeGame();
    this.innerWidth = window.innerWidth;
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }
  @HostListener('window:resize', ['$event'])
  onresize(event) {
    this.innerWidth = window.innerWidth;
    this.onMobileWindow = this.innerWidth <= 800;
  }

  @HostListener('document: mousemove', ['$event']) onMouseMove(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.dragging || !this.cardPlayable()) {
      return;
    }
    this.onDrag(event);
  }
  @HostListener('document: mouseup', ['$event']) onMouseUp(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.dragging) {
      return;
    }
    this.onDragEnd(event);
  }

  addToWaste(event): void {
    event.preventDefault();
    event.stopPropagation();
    let startCard: Card = null;

    if (this.talon.isEmpty() && this.waste.isEmpty()) {
      return;
    }

    if (this.talon.isEmpty()) {
      this.recycleWaste(event);
      return;
    }

    if (this.talon.size >= this.gameMode) {
      startCard = this.talon.cards[this.talon.size - this.gameMode];
    } else {
      startCard = this.talon.cards[this.talon.size - 1];
    }
    this.deckService.transferCard(startCard, this.talon, this.waste);
      this.deckService.suggestNextMove();
  }

  recycleWaste(event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();

    if (this.talon.isEmpty() && !this.waste.isEmpty()) {
      this.deckService.transferCard(this.waste.baseCard, this.waste, this.talon);
      return;
    }
  }

  onDragStart(event, card: Card, deck: Deck) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();
    let clientX:number = (event.type == "touchstart") ? event.touches[0].clientX : event.clientX;
    let clientY:number = (event.type == "touchstart") ? event.touches[0].clientY : event.clientY;

    this.startPosX = clientX - this.posX;
    this.startPosY = clientY - this.posY;
    this.cardOnPlay = card;
    this.sourceDeckOnPlay = deck;
    this.selected = event.target;

    if (!this.cardPlayable()) {
      return;
    }
    
    this.dragging = true;

    let trigger = "dragstart";
    this.raiseTrigger = trigger;
    let selectedCard = event.target;

    selectedCard.style.transition = "none";
    this.raiseCardsFrom(selectedCard, trigger);

  }

  lastClientX: number = 0;
  lastClientY: number = 0;
  onDrag(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();

    if (!this.dragging) {
      return;
    }
    
    let clientX:number = (event.type == "touchmove") ? event.touches[0].clientX : event.clientX;
    let clientY:number = (event.type == "touchmove") ? event.touches[0].clientY : event.clientY;
    this.lastClientX = clientX;
    this.lastClientY = clientY;

    this.posX = clientX - this.startPosX;
    this.posY = clientY - this.startPosY;

    if((this.posX+this.posY) !== 0){
      this.fromDrag = true;
    }
    
    if (clientX == 0 && clientY == 0) {
      this.posX = this.lastPosX;
      this.posY = this.lastPosY;
    } else {
      this.lastPosX = this.posX;
      this.lastPosY = this.posY;
    }
    let trigger = "ondrag";
    this.moveTrigger = trigger;
    let selectedCard = this.selected;
    this.moveCardsFrom(selectedCard, trigger);
  }

  onDragEnd(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();

    if(!this.dragging){
      return;
    }
    
    this.resetDragValues();
    
    let clientX:number = (event.type == "touchend") ? this.lastClientX : event.clientX;
    let clientY:number = (event.type == "touchend") ? this.lastClientY : event.clientY;
    
    this.dragging = false;
    let selectedCard = this.selected;
    selectedCard.hidden = true;
    this.droppable = document.elementFromPoint(clientX,clientY);
    selectedCard.hidden = false;

    let trigger = "dragend";
    this.moveTrigger = trigger;

    let destDeck: Deck = null;
    if (this.droppable == null) {
      this.moveCardsFrom(selectedCard, trigger);
      return;
    }
    if (this.droppable.classList.contains("placeholders")
      && this.droppable !== selectedCard.parentElement) {
      destDeck = this.deckService.getDeckInstance(this.droppable.id);
    }
    if (this.droppable.classList.contains("playableCards")
      && !this.isSibling(selectedCard)) {
      destDeck = this.deckService.getDeckInstance(this.droppable.parentElement.id);
    }
     
    if (destDeck !== null && (destDeck.type == DeckTypes.Maneuver || destDeck.type == DeckTypes.Foundation)) {
      if (destDeck.canAccept(this.cardOnPlay)) {
        this.deckService.transferCard(this.cardOnPlay, this.sourceDeckOnPlay, destDeck);
        this.deckService.suggestNextMove();
        return;
      }
    }
    if(this.sourceDeckOnPlay.cards.indexOf(this.cardOnPlay) !== -1 && event.type == "touchend"){
      this.dragging = false;
      this.autoPlayCard(event, this.cardOnPlay, this.sourceDeckOnPlay);
    }
    if(this.sourceDeckOnPlay.cards.indexOf(this.cardOnPlay) == -1){
      return;
    }

    if (this.resetPos && !this.sourceDeckOnPlay.isEmpty()) {
      this.moveCardsFrom(selectedCard, trigger);
    }
    this.raiseTrigger = trigger;
    this.raiseCardsFrom(selectedCard, trigger);
  }

  resetDragValues() {
    this.startPosX = 0;
    this.startPosY = 0;
    this.lastPosX = 0;
    this.lastPosY = 0;
    this.posX = 0;
    this.posY = 0;
  }

  moveTrigger: string;
  raiseTrigger: string;
  moveCardsFrom(selectedCard: any, trigger: string) {
    let timeOutDuration = 50;
    let transitionStyle = "all 0.1s ease";
    if (!this.moveTrigger.match(trigger)) {
      trigger = this.moveTrigger;
      return;
    }
    if (trigger.match("ondrag")) {
      transitionStyle = "none";
      timeOutDuration = 0;
    }
    selectedCard.style.transition = transitionStyle;
    selectedCard.style.transform = "translate(" + this.posX + "px," + this.posY + "px)";
    if (selectedCard.nextSibling != null) {
      selectedCard = selectedCard.nextSibling;
      setTimeout(() => {
        this.moveCardsFrom(selectedCard, trigger);
      }, timeOutDuration);
    }
  }

  raiseCardsFrom(selectedCard, trigger: string) {

    if (!this.raiseTrigger.match(trigger) && this.raiseTrigger.match("dragstart")) {
      trigger = this.raiseTrigger;
      return;
    }

    if (trigger.match("dragstart")) {
      selectedCard.style.zIndex = this.deckService.zIndex;
      this.deckService.zIndex++;
      selectedCard = selectedCard.nextSibling;
      if (selectedCard !== null) {
        this.raiseCardsFrom(selectedCard, trigger);
      }
    }
    if (trigger.match("dragend")) {
      setTimeout(() => {
          selectedCard.style.zIndex = "auto";
          selectedCard.style.transition = "none";
          selectedCard = selectedCard.nextSibling;
          if (selectedCard !== null) {
            this.raiseCardsFrom(selectedCard, trigger);
          }
      }, 100);
    }
  }

  isSibling(selectedCard: any): boolean {
    let siblings: boolean = false;
    while (selectedCard.nextSibling != null) {
      selectedCard = selectedCard.nextSibling;
      if (!siblings) {
        siblings = this.droppable == selectedCard;
      }
    }
    return siblings;
  }

  cardPlayable(): boolean {
    if (!this.cardOnPlay.flipped
      || (this.sourceDeckOnPlay.type == DeckTypes.Waste
        && this.cardOnPlay !== this.waste.topCard)) {
      return false;
    }
    return true;
  }

  autoPlayCard(event, card: Card, sourceDeck: Deck) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (!card.flipped) {
      return;
    }

    if (this.fromDrag) {
      this.fromDrag = false;
      return;
    }
    if (((sourceDeck.type == DeckTypes.Waste || sourceDeck.type == DeckTypes.Foundation)
      && card !== sourceDeck.topCard)) {
      return;
    }
    this.deckService.autoPlayCard(card, sourceDeck);
    if(sourceDeck.cards.indexOf(card)!== -1){
      let trigger = "dragend";
      this.moveTrigger = trigger;
      this.raiseCardsFrom(this.selected, trigger);
    }
    if(this.dragging){
      this.dragging = false;
      return;
    }
  }
}