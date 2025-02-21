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
  date:string;
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
  public releaseDate: string = '';
  public file:File= new File([],"");
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
  
  save() {
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('genre', this.genre);
    formData.append('country', this.country);
    formData.append('date', this.releaseDate);
    if (this.file) {
      formData.append('poster', this.file, this.file.name);
    }

    this.testFacade.save(formData).subscribe({
      next: (response) => {
        console.log('Película guardada', response);
        alert('Película guardada correctamente');
        this.resetForm();
        this.loadTest(); // Recargar la lista de películas
      },
      error: (error) => {
        console.error('Error al guardar la película:', error);
        if (error.error && error.error.error) {
          alert(error.error.error);
        } else {
          alert('Error al guardar la película');
        }
      }
    });
  }

  validateForm(): boolean {
    return this.title !== '' && this.genre !== '' && this.country !== '' && this.file !== null;
  }

  resetForm() {
    this.title = '';
    this.genre = '';
    this.country = '';
    this.releaseDate = '';
    this.file = new File([], "");
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
    }
  }
}
