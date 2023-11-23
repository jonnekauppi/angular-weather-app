import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { UnitType } from '../data-models/search/search.type';
import { CityWeather, WeatherApiResponse } from '../data-models/weather/weather.type';
import { environment } from '../../environments/environment';
import { TabSelection } from '../data-models/tab-view/tab-view.type';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  public currentCityWeather$: BehaviorSubject<CityWeather | null> = new BehaviorSubject<CityWeather | null>(null);
  public fiveDayCityWeather$: BehaviorSubject<CityWeather[] | null> = new BehaviorSubject<CityWeather[] | null>(null);
  public selectedUnitType$: BehaviorSubject<UnitType> = new BehaviorSubject<UnitType>(UnitType.METRIC);
  public selectedTab$: BehaviorSubject<TabSelection> = new BehaviorSubject<TabSelection>(TabSelection.CURRENT);
  private weatherDataByNameUrl: string = 'https://api.openweathermap.org/data/2.5/find?q=';
  private currentCityWeatherByIdUrl: string = 'https://api.openweathermap.org/data/2.5/weather?id=';
  private fiveDayCityWeatherByIdUrl: string = 'http://api.openweathermap.org/data/2.5/forecast?id=';

  constructor(
    private http: HttpClient,
  ) { }

  public changeTab(tab: TabSelection) {
    this.selectedTab$.next(tab);
  }

  public getLocationsByName(location: string, currentUnitType: UnitType): Promise<WeatherApiResponse> {
    this.selectedUnitType$.next(currentUnitType);
    return firstValueFrom(this.http.get(`${this.weatherDataByNameUrl}${location}&units=${currentUnitType}&appid=${environment.openWeatherApiKey}`)) as Promise<WeatherApiResponse>;
  }

  public updateSelectedUnitType(unitType: UnitType) {
    this.selectedUnitType$.next(unitType);
  }

  public async getWeatherForLocationById(locationId: string): Promise<void> {
    await this.getCurrentWeatherForLocationById(locationId);
    await this.get5DayWeatherForLocationById(locationId);
  }

  public async getCurrentWeatherForLocationById(locationId: string): Promise<void> {
    const currentUnitType = this.selectedUnitType$.getValue();
    const currentCityWeather = await firstValueFrom(this.http.get(`${this.currentCityWeatherByIdUrl}${locationId}&units=${currentUnitType}&appid=${environment.openWeatherApiKey}`)) as CityWeather;
    this.currentCityWeather$.next(currentCityWeather);
  }

  public async get5DayWeatherForLocationById(locationId: string): Promise<void> {
    const currentUnitType = this.selectedUnitType$.getValue();
    const fiveDayCityWeather = await firstValueFrom(this.http.get(`${this.fiveDayCityWeatherByIdUrl}${locationId}&units=${currentUnitType}&appid=${environment.openWeatherApiKey}`)) as WeatherApiResponse;
    this.fiveDayCityWeather$.next(fiveDayCityWeather.list);
  }
}
