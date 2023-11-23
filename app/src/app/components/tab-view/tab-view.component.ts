import { Component, OnInit } from '@angular/core';
import { TabSelection } from 'src/app/data-models/tab-view/tab-view.type';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.css']
})
export class TabViewComponent implements OnInit {

  activeTab: string = TabSelection.CURRENT;

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit(): void {
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
    this.weatherService.changeTab(tab as TabSelection);
  }

}
