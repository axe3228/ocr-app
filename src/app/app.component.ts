import { Component } from '@angular/core';
import * as Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';

declare var require: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ocr-app';
  worker!: Tesseract.Worker;
  workerReady = false;
  image = '../assets/images/CVNwA.jpg';
  ocrResult = '';
  captureProgress = 0;

  constructor() {
    this.loadWorker();
  }

  async loadWorker() {
    this.worker = createWorker({
      logger: (progress) => {
        console.log(progress);
        if (progress.status == 'recognizing text') {
          this.captureProgress = parseInt('' + progress.progress * 100);
        }
      },
    });
    await this.worker.load();
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
    console.log('FIN');

    this.workerReady = true;
  }

  async recognizeImage() {
    const result = await this.worker.recognize(this.image);
    console.log(result.data.text);
    this.ocrResult = result.data.text;
  }
}
