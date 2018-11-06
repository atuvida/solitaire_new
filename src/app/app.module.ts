import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UndoComponent } from './undo/undo.component';
import { OverlayComponent } from './overlay/overlay.component';
import { GameLogsComponent } from './game-logs/game-logs.component';
import { MenuComponent } from './menu/menu.component';
import { UtilityService } from './utility.service';
import { GameControlService } from './game-control.service';
import { DeckService } from './deck.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    GameLogsComponent,
    OverlayComponent,
    UndoComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule
  ],
  providers: [DeckService, GameControlService, UtilityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
