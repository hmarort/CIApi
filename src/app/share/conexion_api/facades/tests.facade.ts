import { Injectable } from '@angular/core';
import { TestsRequest } from "../requests/tests.request";
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TestsFacade {
  constructor(private request: TestsRequest) { }

  /** Films */
  public index(): Observable<any>{    
    return this.request.index();
  }
  public search(title: string): Observable<any>{    
    return this.request.search(title);
  }

  public delete(id: number): Observable<any> {
    return this.request.delete(id).pipe(
      map(response => {
        return response;
      })
    );
  }
  public save(filmData: FormData): Observable<any> {
    return this.request.save(filmData);
  }
  
  /** Users */
  public find(username: string, password: string): Observable<any> {
    return this.request.find(username, password);
  }
  
  public sign(userData: any): Observable<any> {
    return this.request.sign(userData);
  }
}
