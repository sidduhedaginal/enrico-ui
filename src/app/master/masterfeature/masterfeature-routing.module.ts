import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MasterdetailsComponent} from '../masterdetails/masterdetails.component';
import {SkillmasterComponent} from  '../skillmaster/skillmaster.component';
import { ComplexFormComponent } from '../static-form/complex-form/complex-form.component';
import { OdcMasterComponent } from '../static-form/odc-master/odc-master.component';

const routes: Routes = [
  {path: "details", component:MasterdetailsComponent},
  {path: "Import", component:SkillmasterComponent}, 
  {path: "Vendor-Master", component: ComplexFormComponent },  
  {
    path: "odc-master", 
    component: OdcMasterComponent,
    data:{breadcrumb:'ODC Master'} 
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterfeatureRoutingModule { }
