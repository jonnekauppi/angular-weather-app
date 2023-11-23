import { Component, OnInit, Input } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { Subscription } from 'rxjs';
import { UnitType } from 'src/app/data-models/search/search.type';

interface UnitsByType {
  [key: string]: Units;
}

interface Units {
  temp: string;
  speed: string;
}

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})
export class WeatherDisplayComponent implements OnInit {
  weatherData: any;
  isLoading = false;
  error: string = '';
  selectedUnit: UnitType = UnitType.METRIC;
  subs: Subscription[] = [];

  unitsByType: UnitsByType = {
    'metric': {
      temp: '°C',
      speed: 'm/s',
    },
    'imperial': {
      temp: '°F',
      speed: 'mph',
    }
  }

  currentUnitTypes: Units = this.unitsByType[this.selectedUnit];

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.subs.push(this.weatherService.selectedUnitType$.subscribe((selectedUnit) => {
      this.selectedUnit = selectedUnit;
    }));

    this.subs.push(this.weatherService.currentWeatherData$.subscribe((weatherData) => {
      this.isLoading = true;
      this.currentUnitTypes = this.unitsByType[this.selectedUnit];
      this.weatherData = weatherData;
      this.isLoading = false;
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
