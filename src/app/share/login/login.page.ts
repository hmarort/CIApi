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
    console.log('Datos antes de enviar:', this.registerData);  // Verifica los datos antes de enviar

    // Asegúrate de que los datos estén bien formados
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

  login() {
    this.testFacade.find(this.username, this.password).subscribe(
      (response) => {
        if (response && response.message) {
          this.presentAlert(true);
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

  async performBiometricVerification() {
    const result = await NativeBiometric.isAvailable();

    if (!result.isAvailable) return;

    const isFaceID = result.biometryType == BiometryType.FACE_ID;

    const verified = await NativeBiometric.verifyIdentity({
      title: "Iniciar sesión",
    }).then(() => true).catch(() => false);

    if (!verified) return;
    else this.router.navigate(['/home']);

    const credentials = await NativeBiometric.getCredentials({
      server: "www.example.com",
    });
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