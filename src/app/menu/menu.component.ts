import { DeckService } from './../deck.service';
import { Subscription } from 'rxjs';
import { GameControlService } from './../game-control.service';
import { menuAnimation } from './../animations';
import { Component, OnInit, HostListener } from '@angular/core';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [ menuAnimation ]
})
export class MenuComponent implements OnInit {
  menuItems: string[] = ['Logs', 'Hints', 'Restart', 'New'];
  menu: string[] = [];
  toggleActivationCnt: number = 0;
  logSubscription: Subscription;
  hintSubscription: Subscription;
  logActive: boolean;
  hintsActive: boolean;
  innerWidth: number = window.innerWidth;
  onMobileWindow: boolean = this.innerWidth <= 800;

  constructor(private gameControl: GameControlService, 
    private utilityService: UtilityService, private deckService: DeckService) {
    this.logSubscription = this.utilityService.getLogStatus().subscribe(NEXT => {this.logActive = NEXT});
    this.hintSubscription = this.utilityService.getHintStatus().subscribe(NEXT => {this.hintsActive = NEXT});
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onresize(event) {
    this.innerWidth = window.innerWidth;
    this.onMobileWindow = this.innerWidth <= 800;
  }
  toggleMenu(event: Event){
    event.stopPropagation();
    event.preventDefault();
    this.toggleActivationCnt++;
    if(this.toggleActivationCnt > 1){
      this.menu.length = 0;
    }
    if(this.menu.length == 0){
      this.loadMenu();
      this.toggleActivationCnt = 0;
      return;
    }
    if(this.menu.length == 4){
      this.clearMenu();
      this.toggleActivationCnt = 0;
      return;
    }
  }

  clearMenu(){
    if(this.menu.length>0){
      setTimeout(() => {
        this.menuItems.push(this.menu.pop());
        this.clearMenu();
      }, 50);
    }
  }

  loadMenu(){
    if(this.menu.length < 4){
      setTimeout(() => {
        this.menu.push(this.menuItems[this.menu.length]);
        this.loadMenu();
      }, 50);
    }
  }

  selected(event:Event, menuOption: string){
    event.stopPropagation();
    event.preventDefault();
    if(menuOption == 'Restart'){
      this.restart();
    }
    if(menuOption == 'New'){
      this.newGame();
    }
    if(menuOption == 'Hints'){
      this.toggleHints();
    }
    if(menuOption == 'Logs'){
      this.toggleLogs();
    }
  }

  restart(): void{
    this.clearMenu();
    this.gameControl.restartGame();
    setTimeout(() => {
      this.loadMenu();
    }, 1000);
  }

  newGame(): void{
    this.utilityService.setOverLayText('new');
    this.utilityService.setStatus(true);
    this.gameControl.newGame();
  }
  
  
  toggleLogs(){
    if(this.logActive){
      this.utilityService.setLogStatus(false);
      return;
    }
    this.utilityService.setHintStatus(false);
    this.utilityService.setLogStatus(true);
  }

  
  toggleHints(){
    if(this.hintsActive){
      this.utilityService.setHintStatus(false);
      return;
    }
    this.utilityService.setLogStatus(false);
    this.utilityService.setHintStatus(true);
    this.deckService.suggestNextMove();
  }

  ngOnDestroy(): void{
    this.logSubscription.unsubscribe();
    this.hintSubscription.unsubscribe();
  }

}