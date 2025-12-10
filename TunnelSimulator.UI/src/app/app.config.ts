import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { routes } from './app.routes';
import { heroArrowDown, heroArrowLeft, heroChevronLeft, heroChevronRight, heroChevronUp, heroVideoCamera, heroXMark } from '@ng-icons/heroicons/outline';
import { heroArrowLeftMini, heroArrowRightMini, heroChevronLeftMini } from '@ng-icons/heroicons/mini';
import { heroVideoCameraSolid } from '@ng-icons/heroicons/solid';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideIcons({ heroXMark, heroArrowDown, heroArrowRightMini, heroArrowLeftMini, heroVideoCameraSolid, heroArrowLeft, heroChevronUp, heroChevronLeft, heroChevronRight, heroVideoCamera, heroChevronLeftMini }),
  ]
};
