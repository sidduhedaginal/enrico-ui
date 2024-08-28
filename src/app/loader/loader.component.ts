import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  loader: boolean;
  constructor(private homeService: HomeService) {
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
  }
}
