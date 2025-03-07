import { Component, OnInit } from '@angular/core';

import { BiometryType, NativeBiometric } from "capacitor-native-biometric";

import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  username: string= '';
  password: string= '';
  isAlertOpen = false;
  alertButtons = ['Action'];
  isRegisterModalOpen = false;
  registerData = {
    name: '',
    lastName: '',
    email: '',
    username: '',
    password: ''
  };

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
      lastName: '',
      email: '',
      username: '',
      password: ''
    };
  }

  signIn() {
    // Implementar lógica de registro aquí
    console.log('Datos de registro:', this.registerData);
    this.closeRegisterModal();
  }
  constructor(private alertController: AlertController, private router: Router) {}
  ngOnInit(): void {}

  login() {
    if (this.username === 'hmarort' && this.password === 'mamawebo') {
      this.presentAlert(true);
    } else {
      this.presentAlert();
    }
  }
  async presentAlert(boolean = false) {
    if (boolean) {
      const alert = await this.alertController.create({
        header: 'Login Succesful',
        message: 'Welcome.',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }]
      });
  
      await alert.present();
    }else{
      const alert = await this.alertController.create({
        header: 'Login Failed',
        message: 'Invalid credentials.',
        buttons: ['OK']
      });
  
      await alert.present();
    }
  }
  async performBiometricVerificatin(){
    const result = await NativeBiometric.isAvailable();
  
    if(!result.isAvailable) return;
  
    const isFaceID = result.biometryType == BiometryType.FACE_ID;
  
    const verified = await NativeBiometric.verifyIdentity({
      title: "Log in",
    }).then(() => true).catch(() => false);
  
    if(!verified) return; else this.router.navigate(['/home']);
  
    const credentials = await NativeBiometric.getCredentials({
      server: "www.example.com",
    });
  }
}
