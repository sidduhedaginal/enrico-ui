import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanningtabsComponent } from './planningtabs/planningtabs.component';
import { SecondleveldetailsComponent } from './secondleveldetails/secondleveldetails.component';
import { FirstleveldetailsComponent } from './firstleveldetails/firstleveldetails.component';
import { AopdetailsComponent } from './aopdetails/aopdetails.component';
import { PoplandetailsComponent} from './poplandetails/poplandetails.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { ImportedfileComponent } from './secondleveldetails/importedfile/importedfile.component';

const routes: Routes = [
  {path:'',component:PlanningtabsComponent},
  {
    path:'planning',
    data:{breadcrumb:"Planning"},
    children:[
      { path:'second-level-details', 
        component:SecondleveldetailsComponent,
        data:{breadcrumb:"Second Level Details"},
      },
      {path:'second-level-details',
      data:{breadcrumb:"Second Level Details"},
      children:[
        {
          path:'importedfile',
          component:ImportedfileComponent,
          data:{breadcrumb:"Imported File"},
        },
      ]
      },
      { path:'first-level-details',
        component:FirstleveldetailsComponent,
        data:{breadcrumb:"First Level Details"}
      },
      { path:'aop-details', 
        component:AopdetailsComponent,
        data:{breadcrumb:"AOP Details"}
      },
      { path:'po-details', 
        component:PoplandetailsComponent,
        data:{breadcrumb:"PO Details"}
        
      },
      { path:'access-denied', 
        component:AccessdeniedComponent,
        data:{breadcrumb:"Access Denied"}
      }
    ]
  },
  {
    path:'my-actions',
    data:{breadcrumb:'My Actions'},
    children:[
      // { path:'planning',
      //   component:PlanningtabsComponent,
      //   data:{breadcrumb:"Planning"},
      // },
      // {
      //   path:'planning',
      //   data:{breadcrumb:"Planning"},
        // children:[
          { path:'second-level-details', 
            component:SecondleveldetailsComponent,
            data:{breadcrumb:"Second Level Details"},
          },
          { path:'first-level-details',
            component:FirstleveldetailsComponent,
            data:{breadcrumb:"First Level Details"}
          },
          { path:'aop-details', 
            component:AopdetailsComponent,
            data:{breadcrumb:"AOP Details"}
          },
        // ]
      // }
    ]
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningRoutingModule { }
