import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AlertController, ToastController, IonList, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { StorageService, Item } from '../services/storage.service';

const { BarcodeScanner } = Plugins;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements AfterViewInit, OnDestroy {

  result  = null;
  scanActive = false;

  items: Item[] = [];
  newItem: Item = <Item>{};

  constructor(private alertController: AlertController, private plt: Platform, private storageService: StorageService, private toastController: ToastController) {
    this.plt.ready().then(() => {
      this.loadItems();
    })
  }
  
  ngAfterViewInit() {
    // BarcodeScanner.prepare();
  }

  ngOnDestroy() {
    // BarcodeScanner.stopScan();
  }

  /* Scanner */
  async startScanner() {
    const allowed = await this.checkPermission();
    if (allowed) {
      this.showToast('Iniciando cámara');
      this.scanActive = true;
      const result = await BarcodeScanner.startScan();
      console.log("🚀 ~ file: home.page.ts ~ line 30 ~ HomePage ~ startScanner ~ result", result);
      if (result.hasContent) {
        
        this.items.forEach(element => {
          if (element.barcode == result.content) {
            this.result = element;
          }
        });
        if (this.result) {
          this.showToast('¡Encontrado!');
        } else {
          this.showToast('No hay ningún artículo con ese código de barra.');
        }
        this.scanActive = false;
      }
    }
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true});
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        const alert = await this.alertController.create({
          header: 'No permission',
          message: 'Please allow camera acess in your settings',
          buttons: [{
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Open Settings',
            handler: () => {
              resolve(false);
              BarcodeScanner.openAppSettings();
            }
          }]
        });

        await alert.present();
      } else {
        resolve(false);
      }
    });
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  /* Storage */
  // Read
  loadItems() {
    this.storageService.getItems().then(items => {
      this.items = items.reverse();
      this.showToast('Datos obtenidos, No. items: ' + this.items.length);
      console.log(this.items);
    });
  }

  // Helper
  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}