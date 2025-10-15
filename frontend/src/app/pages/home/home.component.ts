import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  styleUrls: ['./home.component.scss'],
  template: `
    <div
      class='home-container'
    >
      <h1>Bem vindo ao Forte Asset Manager!</h1>
    </div>
  `
})
export class HomeComponent {}
