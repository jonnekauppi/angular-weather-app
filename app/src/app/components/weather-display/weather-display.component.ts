import { Component, OnInit, Input } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { Subscription, combineLatest } from 'rxjs';
import { UnitType } from 'src/app/data-models/search/search.type';
import { TabSelection } from 'src/app/data-models/tab-view/tab-view.type';
import { CityWeather } from 'src/app/data-models/weather/weather.type';
import * as dayjs from 'dayjs';

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
  currentCityWeather: CityWeather | null = null;
  fiveDayCityWeather: CityWeather[] = [];
  isLoading = false;
  error: string = '';
  selectedUnit: UnitType = UnitType.METRIC;
  subs: Subscription[] = [];
  currentTab: TabSelection = TabSelection.CURRENT;

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

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit(): void {
    this.subs.push(this.weatherService.selectedUnitType$.subscribe((selectedUnit) => {
      this.selectedUnit = selectedUnit;
    }));

    this.subs.push(
      combineLatest([this.weatherService.currentCityWeather$, this.weatherService.fiveDayCityWeather$])
        .subscribe(([currentCityWeather, fiveDayCityWeather]) => {
          this.isLoading = true;
          this.currentUnitTypes = this.unitsByType[this.selectedUnit];
          this.currentCityWeather = currentCityWeather;
          this.fiveDayCityWeather = fiveDayCityWeather || [];
          this.isLoading = false;
        })
    );

    this.subs.push(this.weatherService.selectedTab$.subscribe((tab) => {
      this.currentTab = tab;
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  formatDate(timestamp: number): string {
    return dayjs.unix(timestamp).format('dddd, DD.MM.YYYY HH:mm');
  }
}
