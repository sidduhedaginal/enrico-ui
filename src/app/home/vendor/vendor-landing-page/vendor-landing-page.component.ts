import { Component } from '@angular/core';
import { cardType } from '../../../model/card';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-vendor-landing-page',
  templateUrl: './vendor-landing-page.component.html',
  styleUrls: ['./vendor-landing-page.component.css'],
})
export class VendorLandingPageComponent {
  currentPath: string = '';
  _checkuser: any = [];

  homeCards: cardType[] = [];

  constructor(private router: Router,  private homeService: HomeService,public loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderService.setShowLoading();
    this.currentPath = this.router.url;
this.homeService.getVendorProfile().subscribe((res:any)=>{
  this.loaderService.setDisableLoading();
  if(res && res.data && res.data.businessSupport== "BGV"){
 
    this.homeCards= [   
      {
        backgroundImg: 'resource-bg.svg',
        title: 'Resource',
        icon: 'resource.svg',
        contentDescription: 'Resource Management',
        path: 'Resource',
      },
    ];
  }
  else{
    this.homeCards = [
      {
        backgroundImg: 'resource-bg.svg',
        title:'SoW JD',//'Vendor Portal',
        icon: 'resource.svg',
        contentDescription:'SoW JD',// 'Vendor Portal.',
        path: 'vendor',
      },
      {
        backgroundImg: 'resource-bg.svg',
        title: 'Resource',
        icon: 'resource.svg',
        contentDescription: 'Resource Management',
        path: 'Resource',
      },
    ];
  }
})


  }
}
