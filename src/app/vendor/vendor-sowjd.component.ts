import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-vendor-sowjd',
  templateUrl: './vendor-sowjd.component.html',
  styleUrls: ['./vendor-sowjd.component.scss'],
})
export class VendorSowjdComponent {
  url: string;

  constructor(private router: Router) {
    this.router.events.subscribe((value) => {
      this.url = this.router.url.toString();
    });
  }

  ngOnInit(): void {}
}
