import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';  // Importar ModalController
import { TestsFacade } from '../share/conexion_api/facades/tests.facade';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

interface Film {
  filmId: number;
  title: string;
  description: string;
  actors: string;
  genre: string;
  country: string;
  date: string;
  base64: string;
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
  public searchTerm: string = '';
  public genre: string = '';
  public country: string = '';
  public releaseDate: string = '';
  public file: File = new File([], "");
  public isModalOpen: boolean = false;

  constructor(
    private testFacade: TestsFacade,
    private router: Router,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    await this.loadTest();
  }

  search(event?: any) {
    this.loading = true;
    console.log('Función search llamada con término:', this.searchTerm);

    // Si no hay término de búsqueda, cargamos todos los datos
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.loadTest();
      return;
    }

    // Realizamos la búsqueda con el término proporcionado
    this.testFacade.search(this.searchTerm).subscribe({
      next: (data) => {
        this.films = data.message;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al buscar películas:', error);
        this.loading = false;
      },
      complete: () => {
        // Solo llamamos a complete si event es un refresher
        if (event && event.target && typeof event.target.complete === 'function') {
          event.target.complete();
        }
      }
    });
  }



  doRefresh(event: any) {
    this.loading = true;
    this.loadTest(event);
  }

  loadTest(event?: any) {
    this.loading = true;
    this.testFacade.index().subscribe(
      (data) => {
        this.films = data.message;
        this.loading = false;
        if (event) event.target.complete();
      },
      (error) => {
        console.error('Error al cargar los datos:', error);
        this.loading = false;
        if (event) event.target.complete();
      }
    );
  }



  delete(id: number) {
    this.testFacade.delete(id).subscribe(
      (response) => {
        console.log('Película eliminada', response);
        alert('Película eliminada: ' + response.message);
        this.loadTest();
      },
      (error) => {
        console.error('Error al eliminar la película:', error);
      }
    );
  }

  edit(film: Film) {
    this.filmId = film.filmId;
    this.title = film.title;
    this.genre = film.genre;
    this.country = film.country;
    this.releaseDate = film.date;
  }

  openModal(film?: Film) {
    if (film) {
      this.edit(film);
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
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
    this.closeModal();
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

  async escanearCodigo(): Promise<any> {
    const status = await BarcodeScanner.checkPermission();
    if (status.denied) {
      const c = confirm('Si quieres dar permisos a la aplicación, por favor ve a la configuración.');
      if (c) {
        BarcodeScanner.openAppSettings();
      }
      return;
    }
    try {
      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        this.searchTerm = result.content;
        this.search();
      }
    } catch (error) {
      console.error('Error al escanear el código: ', error);
    }
  }

}