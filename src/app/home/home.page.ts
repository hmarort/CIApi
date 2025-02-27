import { Component, OnInit } from '@angular/core';
import { TestsFacade } from '../facades/tests.facade';
import { Router } from '@angular/router';

interface Film {
  filmId: number;
  title: string;
  description: string;
  actors: string;
  genre: string;
  country: string;
  date: string;
  base64:string;
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
  public filmId: number | null = null;
  public title: string = '';
  public genre: string = '';
  public country: string = '';
  public releaseDate: string = '';
  public file: File = new File([], "");
  
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
        alert('Película eliminada: ' + response.message);
        this.loadTest(); // Recargar la lista de películas
      },
      (error) => {
        console.error('Error al eliminar la película:', error);
      }
    );
  }

  // Función que se activa al seleccionar una película para editar
  edit(film: Film) {
    this.filmId = film.filmId;
    this.title = film.title;
    this.genre = film.genre;
    this.country = film.country;
    this.releaseDate = film.date;
    // No necesitamos asignar file aquí, ya que la imagen de la película es opcional para editar
  }

  save() {
    const formData = this.createFormData();
    const action = this.filmId ? 'editar' : 'guardar';

    this.testFacade.save(formData).subscribe({
      next: (response) => this.handleSuccess(response, action),
      error: (error) => this.handleError(error, action)
    });
  }

  private createFormData(): FormData {
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('genre', this.genre);
    formData.append('country', this.country);
    formData.append('date', this.releaseDate);

    if (this.file) {
      formData.append('poster', this.file, this.file.name);
    }

    if (this.filmId) {
      formData.append('filmId', this.filmId.toString());
    }

    return formData;
  }

  private handleSuccess(response: any, action: string) {
    console.log(`Película ${action}da`, response);
    alert(`Película ${action}da correctamente`);
    this.resetForm();
    this.loadTest();
  }

  private handleError(error: any, action: string) {
    console.error(`Error al ${action} la película:`, error);
    const errorMessage = error.error && error.error.error
      ? error.error.error
      : `Error al ${action} la película`;
    alert(errorMessage);
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
    this.filmId = null;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
    }
  }
}