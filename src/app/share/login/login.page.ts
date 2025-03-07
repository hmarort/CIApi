import { Component, OnInit } from '@angular/core';
import { BiometryType, NativeBiometric } from 'capacitor-native-biometric';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TestsFacade } from '../conexion_api/facades/tests.facade';

interface User {
  userId: number;
  name: string;
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  name: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  isAlertOpen = false;
  alertButtons = ['Action'];
  isRegisterModalOpen = false;
  registerData = {
    name: '',
    username: '',
    email: '',
    password: ''
  };

  constructor(
    private alertController: AlertController,
    private testFacade: TestsFacade,
    private router: Router,
    private modalController: ModalController
  ) {}

  openRegisterModal() {
    this.isRegisterModalOpen = true;
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
    this.resetRegisterForm();
  }

  resetRegisterForm() {
    this.registerData = {
      name: '',
      email: '',
      username: '',
      password: ''
    };
  }

  signIn() {
    console.log('Datos antes de enviar:', this.registerData);

    if (this.registerData.name && this.registerData.username && this.registerData.email && this.registerData.password) {
      const userData = this.createUserData();
      this.testFacade.sign(userData).subscribe(
        (response) => {
          console.log('Registro exitoso:', response);
          this.closeRegisterModal();
        },
        (error) => {
          console.log('Error al registrar:', error);
        }
      );
    } else {
      console.log('Por favor, complete todos los campos.');
    }
  }

  async login() {
    this.testFacade.find(this.username, this.password).subscribe(
      async (response) => {
        if (response && response.message) {
          // Preguntar al usuario si desea guardar sus credenciales
          const saveDataAlert = await this.alertController.create({
            header: 'Guardar Credenciales',
            message: '¿Desea guardar sus credenciales para futuras sesiones?',
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                handler: () => {
                  this.presentAlert(true);
                }
              },
              {
                text: 'Sí',
                handler: async () => {
                  await this.saveLoginData(this.username, this.password);
                  this.username='';
                  this.password='';
                  this.presentAlert(true);
                }
              }
            ]
          });
  
          await saveDataAlert.present();
        } else {
          this.presentAlert();
        }
      },
      (error) => {
        console.error(error);
        this.presentAlert();
      }
    );
  }

  async saveLoginData(username: string, password: string) {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
  }

  async performBiometricVerification() {
    const result = await NativeBiometric.isAvailable();

    if (!result.isAvailable) return;

    const isFaceID = result.biometryType == BiometryType.FACE_ID;

    const verified = await NativeBiometric.verifyIdentity({
      title: "Iniciar sesión",
    }).then(() => true).catch(() => false);

    if (!verified) return;

    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername && storedPassword) {
      this.testFacade.find(storedUsername, storedPassword).subscribe(
        (response) => {
          if (response && response.message) {
            this.router.navigate(['/home']);
          } else {
            console.log('Credenciales inválidas');
          }
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      alert('No hay datos de inicio de sesión guardados');
      console.log('No hay datos de inicio de sesión guardados');
    }
  }

  async presentAlert(boolean = false) {
    if (boolean) {
      const alert = await this.alertController.create({
        header: 'Login Exitoso',
        message: 'Bienvenido.',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }]
      });

      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Login Fallido',
        message: 'Credenciales inválidas.',
        buttons: ['OK']
      });

      await alert.present();
    }
  }

  private createUserData(): any {
    return {
      name: this.registerData.name,
      username: this.registerData.username,
      email: this.registerData.email,
      password: this.registerData.password
    };
  }
}