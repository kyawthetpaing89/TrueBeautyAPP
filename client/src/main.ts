import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/utilities/auth-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideGoogleCharts } from 'angular-google-charts';

function provideAnimationsAsync() {
  return provideAnimations();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideGoogleCharts(),
  ],
}).catch((err) => console.error(err));
