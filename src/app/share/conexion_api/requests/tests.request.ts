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

  /** Films */
  public index(): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<any>(this.baseUrl, { headers });
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

  public search(title: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post<any>(`${this.baseUrl}search`, { 'title': title }, { headers });
  }

  /** Users */
  public find(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.baseUrl}find`, { 'username': username, 'password': password }, { headers });
  }

  public sign(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.baseUrl}sign`, userData, { headers });
  }


}
