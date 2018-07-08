import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import * as TEAMS from './teams.json';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'responseType': 'application/json',
    'Access-Control-Allow-Origin':  'http://127.0.0.1:5000/',
    'Access-Control-Allow-Methods': 'POST GET',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  })
};

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  form: FormGroup;
  countries = [];
  leftTeamArray = [];
  rightTeamArray = [];
  predict: number;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.countries = Object.keys(TEAMS).sort();

    this.form = this.fb.group({
      leftCountry: ['', [Validators.required]],
      leftCountryScore: ['', [Validators.required]],
      leftTeam: ['', [Validators.required]],
      rightCountry: ['', [Validators.required]],
      rightCountryScore: ['', [Validators.required]],
      rightTeam: ['', [Validators.required]],
    });

    this.form.get('leftCountry').valueChanges.subscribe(team => {
      this.leftTeamArray = TEAMS[team].sort();
    });

    this.form.get('rightCountry').valueChanges.subscribe(team => {
      this.rightTeamArray = TEAMS[team].sort();
    });
  }

  get leftCountry(): AbstractControl {
    return this.form.get('leftCountry');
  }

  get leftTeam(): AbstractControl {
    return this.form.get('leftTeam');
  }

  get rightCountry(): AbstractControl {
    return this.form.get('rightCountry');
  }

  get rightTeam(): AbstractControl {
    return this.form.get('rightTeam');
  }

  notInTeam(team: string, player: string): boolean {
    return !this.form.get(team).value.includes(player);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    console.log(this.form.value);

    this.http.post('http://127.0.0.1:5000/', JSON.stringify(this.form.value), httpOptions)
      .subscribe((res: any) => this.predict = res.result , (error) => console.log(error));
  }

}
