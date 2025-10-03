import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleChartsModule } from 'angular-google-charts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GoogleChartsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {}
}
