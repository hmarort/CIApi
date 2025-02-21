import { Component, OnInit } from '@angular/core';
import { TestsFacade } from '../facades/tests.facade';
import { Router } from '@angular/router';

interface Film {
  filmId: number;
  title: string;
  description: string;
  actors: string;
  genre: string;
  country:string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  films: Film[] = [];
  loading: boolean = true;

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
        this.films = data.message;
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar los datos:', error);
        this.loading = false;
      }
    );
  }  
}
