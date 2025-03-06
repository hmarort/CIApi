import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Importa el servicio HttpClient, no HttpClientModule
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestsRequest {
  private token: string = 'W66jQhYGGzEIuCcAXfpTJkt7uH6GBGpcJLCSXo6O2WF1AZkxiMXpypFaKEfA';
  private baseUrl: string = 'https://apirest.saicasl.eu/api3/api/public/';

  constructor(private http: HttpClient) { }

  public index(title?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const body = title ? { title: title } : {};

    return this.http.post<any>(`${this.baseUrl}`, body, { headers });
  }


  public delete(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.post<any>(`${this.baseUrl}delete`, { filmId: id }, { headers });
  }
  public save(filmData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post<any>(`${this.baseUrl}save`, filmData, { headers });
  }
}