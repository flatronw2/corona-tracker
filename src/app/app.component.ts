import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { GlobalModel } from './global.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'covid-tracker-app';

  global!: boolean;
  country!: string;
  data!: GlobalModel;
  dailyData!: any[];
  countries!: any[]
  lineChartData: any[] = [
    {
      data: [65, 64, 33, 44], label: 'Templ label'
    }
  ];
  lineChartType = 'line';
  lineChartLabeles: any[] = [
    'label01', 'label02', 'label03'
  ];
  barChartType = 'bar';
  barChartLabels: any[] = [
    'Infected', 'Recovered', 'Deaths'
  ];
  barChartData: any[] = [
    { data: [65, 76, 33], label: 'Lable'}
  ];

  constructor(private api: ApiService){
    this.data = new GlobalModel(); 
  }

  ngOnInit(): void{
    this.global = true;
    this.fetchData();
    this.fetchCountries();
    this.fetchDailyData();
  }

  fetchData(){
    this.api.fetchData().subscribe((res: any) => {
      this.data.confirmed = res['confirmed']['value'];
      this.data.recovered = res['recovered']['value'];
      this.data.deaths = res['deaths']['value'];
      this.data.lastupdate = res['lastupdate'];
    })
  }

  fetchCountries(){
    this.api.fetchCountries().subscribe((res: any) => {
      var countries = res['countries'];
      this.countries = countries.map((name: any) => name['name'])
    })
  }
  
  fetchDataByCountry(country: string) {
    this.api.fetchDataByCountry(country).subscribe((res: any) => {
      this.data.confirmed = res['confirmed']['value'];
      this.data.recovered = res['recovered']['value'];
      this.data.deaths = res['deaths']['value'];
      this.data.lastupdate = res['lastupdate'];

      this.barChartData = [
        {
          data: [this.data.confirmed, this.data.recovered, this.data.deaths],
          label: 'peop'
        }
      ]
    })
  }
  fetchDailyData(){
    this.api.fetchDailyData().subscribe((res: any) => {
      this.lineChartLabeles = res.map((date: any) => date['reportDate']);
      var infectedData = res.map((confirmed:any)=> confirmed['totalConfirmed']);
      var deaths = res.map((deaths:any) =>['deaths']);
      var recovered = res.map((rev:any)=> rev) 

      this.lineChartData = [
        {
          data: infectedData,
          label: 'Infected'
        },
        {
          data: deaths,
          label: "Deaths"
        }
      ]
    })
  }

  countryChanged(value: string){
    this.country = value;
    if(value == 'global') {
      this.fetchData();
      this.global = true;
    } else {
      this.fetchDataByCountry(value);
      this.global = false;
    }
  }
}
