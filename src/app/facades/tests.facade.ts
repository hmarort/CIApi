import { Injectable } from '@angular/core';
import { TestsRequest } from "../requests/tests.request";
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TestsFacade {
  constructor(private request: TestsRequest) { }

  public index(): Observable<any>{    
    return this.request.index();
  }

  public delete(id: number): Observable<any> {
    return this.request.delete(id).pipe(
      map(response => {
        return response;
      })
    );
  }
  
}
