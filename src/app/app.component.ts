import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { LoaderService } from './services/loader.service';
import { LicenseManager } from 'ag-grid-enterprise';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Enrico Digital';
  UserDetails: any;
  token: any;
  constructor(
    public authenticationService: AuthenticationService,
    public loaderService: LoaderService
  ) {
    this.token = localStorage.getItem(
      'oidc.user:https://login.microsoftonline.com/0ae51e19-07c8-4e4b-bb6d-648ee58410f4/v2.0/:3800bb56-45cb-4c0a-bd89-7394b0d57720'
    );
    LicenseManager.setLicenseKey(
      'Using_this_AG_Grid_Enterprise_key_( AG-040688 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( BOSCH GLOBAL SOFTWARE TECHNOLOGIES PRIVATE LIMITED )_is_granted_a_( Multiple Applications )_Developer_License_for_( 1 ))_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_AG_Grid_Enterprise___This_key_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 5 May 2024 )____[v2]_MTcxNDg2MzYwMDAwMA==fd50a821c86d16531ecf7f879a81539c'
    );
  }
  ngOnInit() {
    // this.authenticationService.verifyToken().subscribe(
    //   (details: any) => {
    //     this.UserDetails = details.result;
    //     // localStorage.setItem('UserDetails', JSON.stringify(this.UserDetails));
    //     //reditect to dashboard
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }
}
