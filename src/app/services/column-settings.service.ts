import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ColumnSettingsService {
  private url = environment.apiConfig;
  private vendor_url = environment.vendor_API;

  constructor(private http: HttpClient) {}

  saveColumnsSecSpocMyRequest(selectedColumns: []) {
    return this.http.post(
      `${this.url}/api/master-data/save-columns?menuId=45`,
      selectedColumns
    );
  }
  getColumnsSecSpocMyRequest() {
    return this.http.get(`${this.url}/api/sowjd/Column-preferences/45`);
  }

  saveColumnsSecSpocMyAction(selectedColumns: []) {
    return this.http.post(
      `${this.url}/api/master-data/save-columns?menuId=46`,
      selectedColumns
    );
  }
  getColumnsSecSpocMyAction() {
    return this.http.get(`${this.url}/api/sowjd/Column-preferences/46`);
  }

  saveColumnsDHMyAction(selectedColumns: []) {
    return this.http.post(
      `${this.url}/api/master-data/save-columns?menuId=44`,
      selectedColumns
    );
  }
  getColumnsDHMyAction() {
    return this.http.get(`${this.url}/api/sowjd/Column-preferences/44`);
  }

  saveColumnsDHMyRequest(selectedColumns: []) {
    return this.http.post(
      `${this.url}/api/master-data/save-columns?menuId=43`,
      selectedColumns
    );
  }
  getColumnsDHMyRequest() {
    return this.http.get(`${this.url}/api/sowjd/Column-preferences/43`);
  }

  saveSoWJDColumns(selectedColumns: []) {
    return this.http.post(
      `${this.url}/api/master-data/save-columns?menuId=41`,
      selectedColumns
    );
  }
  getSoWJDColumns() {
    return this.http.get(`${this.url}/api/sowjd/Column-preferences/41`);
  }

  saveRFQColumns(selectedColumns: []) {
    return this.http.post(
      `${this.url}/api/master-data/save-columns?menuId=61`,
      selectedColumns
    );
  }
  getRFQColumns() {
    return this.http.get(`${this.url}/api/sowjd/Column-preferences/61`);
  }

  saveVendorSignOffColumn(selectedColumns: []) {
    return this.http.post(
      `${this.vendor_url}/api/GridSettings/save-columns?menuId=49`,
      selectedColumns
    );
  }
  getVendorSignOffColumn() {
    return this.http.get(
      `${this.vendor_url}/api/GridSettings/Column-preferences/49`
    );
  }

  saveSignOffColumns(selectedColumns: []) {
    return this.http.post(
      `${this.vendor_url}/api/GridSettings/save-columns?menuId=62`,
      selectedColumns
    );
  }
  getSignOffColumns() {
    return this.http.get(
      `${this.vendor_url}/api/GridSettings/Column-preferences/62`
    );
  }

  saveSowjdSRNColumns(selectedColumns: []) {
    return this.http.post(
      `${this.url}/api/master-data/save-columns?menuId=51`,
      selectedColumns
    );
  }

  getSowjdSRNColumns() {
    return this.http.get(`${this.url}/api/sowjd/Column-preferences/51`);
  }

  saveVendorRFQColumn(selectedColumns: []) {
    return this.http.post(
      `${this.vendor_url}/api/GridSettings/save-columns?menuId=50`,
      selectedColumns
    );
  }
  getVendorRFQColumn() {
    return this.http.get(
      `${this.vendor_url}/api/GridSettings/Column-preferences/50`
    );
  }

  saveColumnsVendorSrn(selectedColumns: []) {
    return this.http.post(
      `${this.vendor_url}/api/GridSettings/save-columns?menuId=48`,
      selectedColumns
    );
  }
  getColumnsVendorSrn() {
    return this.http.get(
      `${this.vendor_url}/api/GridSettings/Column-preferences/48`
    );
  }

  saveMyActionColumns(selectedColumns: []) {
    return this.http.post(
      `${this.vendor_url}/api/GridSettings/save-columns?menuId=63`,
      selectedColumns
    );
  }
  getMyActionColumns() {
    return this.http.get(`${this.url}/api/sowjd/Column-preferences/63`);
  }
}
