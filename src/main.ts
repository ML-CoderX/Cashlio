import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { homeOutline, addCircleOutline, timeOutline, personOutline } from 'ionicons/icons';

addIcons({
  'home-outline': homeOutline,
  'add-circle-outline': addCircleOutline,
  'time-outline': timeOutline,
  'person-outline': personOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes)
  ]
});