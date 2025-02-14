import { Component, OnInit } from '@angular/core';
import { TestsFacade } from '../facades/tests.facade';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  message: String = '';
  constructor(
    private testFacade: TestsFacade,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadTest();
  }

  loadTest() {
    this.testFacade.index().subscribe(
      (data) => {
        this.message = data.message;
      });
  }

}
