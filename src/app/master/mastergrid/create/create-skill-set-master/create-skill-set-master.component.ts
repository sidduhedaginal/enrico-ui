import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lib-create-skill-set-master',
  templateUrl: './create-skill-set-master.component.html',
  styleUrls: ['./create-skill-set-master.component.css'],
})
export class CreateSkillSetMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  public title = 'Create Skillset Master Data';
  public routerdata: any;

  errorMessage = '';

  public skillset_ID = 0;
  public skillset_name = '';
  public classification = '';
  public cluster_name = '';
  public cluster_Id = 0;

  public showloader = false;

  isCreate = true;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {

      this.routerdata = params;
      
    });

    if (this.routerdata.data > 0) {
      this.isCreate = false;
    }

    if (this.routerdata.data > 0) {

      fetch(
        `${this.url}/MatserTable/Skillset/GetSkillSetById?a_skillsetId=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update Skillset Master Data';
            this.skillset_ID = data.result.skillsetId;
            this.skillset_name = data.result.skillsetName;
            this.classification = data.result.classification;
            this.cluster_Id = data.result.clusterId;
            this.cluster_name = data.result.clusterName;
          }
        });
    }
  }

  skills = ['DevOps', 'Development'];
  classifications = ['STANDARD', 'CORE'];

  clusterNames = [
    {
      name: 'Automation',
      value: 148136518500,
    },
    {
      name: 'Base SW Dev',
      value: 148136516100,
    },
  ];

  onClusterChange() {
    //cluster_id
    for (let index = 0; index < this.clusterNames.length; index++) {
      if (this.clusterNames[index].value == this.cluster_Id) {
        this.cluster_name = this.clusterNames[index].name;
      }
    }
  }

  saveVendorRateCard() {
    this.errorMessage = '';
    if (
      this.cluster_name == '' ||
      this.skillset_name == '' ||
      this.classification == ''
    ) {
      this.errorMessage = 'Please fill all mandatory (*) fields.';
      this.showloader=false;
      return false;
    } else {
      this.showloader = true;

      var formdata = new FormData();



      formdata.append('input', this.getString());

      var requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      var url = this.url + '/MatserTable/CreateSkillSet';

      if (!this.isCreate) {
         url = this.url + '/MatserTable/UpdateSkillSet';
      }

      console.log(url);
      fetch(url, requestOptions)
        .then(function (response) {
          return response.json();
        })
        .then((data) => {

          this.showloader = false;

          if (data.success == false) {
            this.errorMessage = data.message;
          } else {
            // alert(data.message);

            this.router.navigate(['/dashboard'], {
              queryParams: { routertitle: JSON.stringify('Skillset Master') },
            });
          }
        });

      return true;
    }
  }

  cancelVendorRateCard() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Skillset Master') },
    });
  }

  savePlantMaster() {}

  getString(): string {
    // const inputObject = {
    //   plant_code: this.plant_code,
    //   name: this.name,
    //   company_code: this.company_code,
    //   street_house_no: this.street_house_no,
    //   city: this.city,
    //   state: this.state,
    //   country: this.country,
    //   postal_code: this.postal_code,
    //   currency: this.currency

    const inputObject = {
      skillsetId: this.skillset_ID,
      skillsetName: this.skillset_name,
      classification: this.classification,
      clusterId: this.cluster_Id,
      clusterName: this.cluster_name,
    };

    console.log('created objects');

    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }
}
