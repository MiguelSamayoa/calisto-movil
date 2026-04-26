import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { defineCustomElements as defineJeepSqlite } from 'jeep-sqlite/loader';

defineJeepSqlite(window);

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
