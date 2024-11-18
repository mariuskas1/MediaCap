import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"mediacap-fcf82","appId":"1:314780790228:web:81abb1bb8351f433f1fa41","storageBucket":"mediacap-fcf82.firebasestorage.app","apiKey":"AIzaSyBrZPHXyznNUTMbxkC6593_ieZyQSUtrmI","authDomain":"mediacap-fcf82.firebaseapp.com","messagingSenderId":"314780790228"})), provideFirestore(() => getFirestore())]
};
