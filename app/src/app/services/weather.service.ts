import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { UnitType } from '../data-models/search/search.type';
import { CityWeather, WeatherApiResponse } from '../data-models/weather/weather.type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  public currentWeatherData$: BehaviorSubject<CityWeather | null> = new BehaviorSubject<CityWeather | null>(null);
  public selectedUnitType$: BehaviorSubject<UnitType> = new BehaviorSubject<UnitType>(UnitType.METRIC);
  protected weatherDataByNameUrl: string = 'https://api.openweathermap.org/data/2.5/find?q=';
  protected weatherDataByIdUrl: string = 'https://api.openweathermap.org/data/2.5/weather?id=';

  constructor(
    private http: HttpClient,
  ) { }

  public getWeatherForLocationsByName(location: string, currentUnitType: UnitType): Promise<WeatherApiResponse> {
    this.selectedUnitType$.next(currentUnitType);
    return firstValueFrom(this.http.get(`${this.weatherDataByNameUrl}${location}&units=${currentUnitType}&appid=${environment.openWeatherApiKey}`)) as Promise<WeatherApiResponse>;
  }

  public getWeatherForLocationsById(locationId: string, currentUnitType: UnitType): Promise<CityWeather> {
    this.selectedUnitType$.next(currentUnitType);
    return firstValueFrom(this.http.get(`${this.weatherDataByIdUrl}${locationId}&units=${currentUnitType}&appid=${environment.openWeatherApiKey}`)) as Promise<CityWeather>;
  }

  public updateCurrentWeatherData(cityWeather: CityWeather | null) {
    this.currentWeatherData$.next(cityWeather);
  }
}
