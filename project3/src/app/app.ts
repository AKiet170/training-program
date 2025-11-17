import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Welcome } from './pages/welcome/welcome';
import { Favorite } from './pages/favorite/favorite';
import { NavBar } from './components/nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NzLayoutModule, NzMenuModule, Welcome, Favorite, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
