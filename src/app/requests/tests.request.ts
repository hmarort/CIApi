import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Importa el servicio HttpClient, no HttpClientModule
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestsRequest {
  baseUrl: string = 'https://apirest.saicasl.eu/api3/api/public/';
  constructor(private http: HttpClient) { }  // Inyecta HttpClient aquí

  public index(): Observable<any> {
    return this.http.get(this.baseUrl);  // Realiza la solicitud GET con HttpClient
  }
}
