import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { provideServiceWorker } from '@angular/service-worker';
import { provideIcons } from '@ng-icons/core';
import {
  lucideHouse, lucideChartBar, lucideBuilding, lucideLightbulb,
  lucideBell, lucideLogOut, lucidePlus, lucidePencil, lucideTrash2,
  lucideUser, lucideCamera, lucideLock,
  lucideCalendar, lucideChevronLeft, lucideChevronRight,
} from '@ng-icons/lucide';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideIcons({
      lucideHouse, lucideChartBar, lucideBuilding, lucideLightbulb,
      lucideBell, lucideLogOut, lucidePlus, lucidePencil, lucideTrash2,
      lucideUser, lucideCamera, lucideLock,
      lucideCalendar, lucideChevronLeft, lucideChevronRight,
    }),
  ],
};
