import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AlertController, ToastController, IonList, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { StorageService, Item } from '../services/storage.service';

const { BarcodeScanner } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit, OnDestroy {

  result  = null;
  scanActive = false;

  items: Item[] = [];
  newItem: Item = <Item>{};

  @ViewChild('inventory')inventory: IonList;

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
        this.result = result.content;
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

  // Create
  addItem() {
    this.newItem.modified = Date.now();
    
    this.storageService.addItem(this.newItem).then(item => {
      this.newItem = <Item>{};
      this.showToast('Artículo añadido');
      this.loadItems();
    });
  }

  // Read
  loadItems() {
    this.storageService.getItems().then(items => {
      this.items = items.reverse();
    });
  }

  // Update
  updateItem(item: Item) {
    item.name = `UPDATED: ${item.name}`;
    item.modified = Date.now();

    this.storageService.updateItem(item).then(item => {
      this.showToast('Artículo editado');
      this.inventory.closeSlidingItems();
      this.loadItems();
    });
  }

  // Delete
  deleteItem(item: Item) {
    this.storageService.deleteItem(item.barcode).then(item => {
      this.showToast('Artículo borrado');
      this.inventory.closeSlidingItems();
      this.loadItems();
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
