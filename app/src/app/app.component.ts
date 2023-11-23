import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    // Set english as the default language
    translate.setDefaultLang('en');
    translate.use('en');
  }

  // Support for changing languages for further development
  switchLanguage(language: string) {
    this.translate.use(language);
  }

}
