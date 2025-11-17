import { Component } from '@angular/core';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent {
  city='TP.HCM';
  temp=35;
  condition='overcast clouds';
  humidity=70;
  windSpeed=10;
  cloudCover=50
}
