import { Component, OnInit } from '@angular/core';
import { TestsFacade } from '../facades/tests.facade';
import { Router } from '@angular/router';

interface Film {
  filmId: number;
  title: string;
  description: string;
  actors: string;
  genre: string;
  country:string
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
  public title:string ='';
  public genre:string ='';
  public country:string ='';
  public releaseDate: Date = new Date();
  public file:File;
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
  
  delete(id: number) {
    this.testFacade.delete(id).subscribe(
      (response) => {
        console.log('Película eliminada', response);
        alert('Película eliminada: '+ response.message);
        this.loadTest(); // Recargar la lista de películas
      },
      (error) => {
        console.error('Error al eliminar la película:', error);
      }
    );
  }
  
  save(){
    
  }
}
