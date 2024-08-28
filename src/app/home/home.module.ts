import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CardComponent } from './card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { VendorLandingPageComponent } from './vendor/vendor-landing-page/vendor-landing-page.component';

@NgModule({
  declarations: [HomeComponent, CardComponent, VendorLandingPageComponent],
  imports: [CommonModule, HomeRoutingModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}
