import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UnitType } from 'src/app/data-models/search/search.type';
import { CityWeather, WeatherApiResponse } from 'src/app/data-models/weather/weather.type';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  searchForm: FormGroup = new FormGroup({
    cityName: new FormControl(''),
    unit: new FormControl('metric')
  });
  searchResults: CityWeather[] = [];
  infoMessage: string = '';

  languageSub: Subscription = new Subscription();

  @ViewChild('resultsList', { static: false }) resultsList: ElementRef = new ElementRef(null);

  constructor(
    private weatherService: WeatherService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    try {
      this.searchForm = new FormGroup({
        cityName: new FormControl(''),
        unit: new FormControl('metric')
      });

      // Check if there is data in localStorage
      this.getDataFromLocalStorage();

      // Update the infoMessage when the translations are ready
      this.languageSub = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        this.infoMessage = this.translateService.instant('search.default-info-message');
      });

    } catch (err) {
      console.error('Error trying to initialize search component', err);
    }
  }

  ngOnDestroy(): void {
    this.languageSub.unsubscribe();
  }

  async onSearch(cityId?: string) {
    try {

      const formValue = this.searchForm.value;
      this.weatherService.updateSelectedUnitType(formValue.unit);

      // If city id is provided, get weather data by id
      if (cityId) {
        this.fetchData(cityId);
      } else {
        // Api will return bad request if query is less than 3 characters long
        if (!(formValue.cityName)) {
          this.infoMessage = this.translateService.instant('search.default-info-message');
          return;
        }

        // Fill in the city name with spaces because the API will throw an error with a query less than 3 characters long
        // This will allow the user to search for cities with shorter names like 'Ii'
        if (formValue.cityName.length < 3) {
          for (let i = formValue.cityName.length; i < 3; i++) {
            formValue.cityName += ' ';
          }
        }

        const locationsResponse: WeatherApiResponse = await this.weatherService.getLocationsByName(formValue.cityName, formValue.unit);

        if (!locationsResponse) {
          this.infoMessage = this.translateService.instant('search.api-error-message');
          throw new Error('No weather response from API');
        }

        if (!locationsResponse.list?.length) {
          this.infoMessage = this.translateService.instant('search.no-results-message');
          return;
        }

        // If there is only one result, update the current weather data
        if (locationsResponse.list?.length === 1) {
          this.onSelectCity(locationsResponse.list[0]);
          return;
        }

        // If there are multiple results, store the results to show list of cities found
        this.searchResults = locationsResponse.list;
      }
    } catch (err) {
      this.infoMessage = this.translateService.instant('search.api-error-message');
      console.error('Error trying to perform search', err);
    }
  }

  async fetchData(cityId: string) {
    try {
      await this.weatherService.getWeatherForLocationById(cityId);
      this.infoMessage = ''; // Clear the info message
    } catch (err) {
      this.infoMessage = this.translateService.instant('search.api-error-message');
      console.error('Error trying to fetch data', err);
    }
  }

  // User selects a city from the results list
  onSelectCity(city: CityWeather) {
    this.searchResults = []; // Clear the search results list
    this.fetchData(city?.id?.toString());
    this.saveToLocalStorage(city.id?.toString(), city.name, this.searchForm.value.unit);
  }

  // Get data from localStorage if available
  getDataFromLocalStorage() {
    try {
      const savedCityId = localStorage.getItem('selectedCityId');
      const savedCity = localStorage.getItem('selectedCity');
      const savedUnit = localStorage.getItem('selectedUnit');

      if (savedUnit) {
        this.searchForm.get('unit')?.setValue(savedUnit);
      }

      if (savedCity) {
        this.searchForm.get('cityName')?.setValue(savedCity);
      }

      // If there is a saved city id, fetch the weather data
      if (savedCityId) {
        this.onSearch(savedCityId);
      }
    } catch (err) {
      console.error('Error trying to handle stored data', err);
    }
  }

  // Save to localStorage
  saveToLocalStorage(cityId: string, cityName: string, unit: UnitType) {
    try {
      localStorage.setItem('selectedCityId', cityId);
      localStorage.setItem('selectedCity', cityName);
      localStorage.setItem('selectedUnit', unit);
    } catch (err) {
      console.error('Error trying to save to localStorage', err);
    }
  }

  // If user clicks outside the results list, hide the list
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.resultsList && !this.resultsList.nativeElement.contains(event.target)) {
      this.searchResults = [];
    }
  }
}