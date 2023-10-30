import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of as observableOf, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public apiUrl = 'http://localhost:5000/';

  constructor(private http: HttpClient) { }

  reporte(param): Observable<any> {
    return this.http.post(this.apiUrl + 'reporte', param);
  }

  login(param): Observable<any> {
    return this.http.post(this.apiUrl + 'login', param);
  }

  reporteu(param): Observable<any> {
    return this.http.post(this.apiUrl + 'reporteu', param);
  }
 
  empresas(): Observable<any> {
    return this.http.get(this.apiUrl + 'empresas');
  }
}
