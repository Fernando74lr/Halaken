import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastController, IonList, Platform } from '@ionic/angular';
import { StorageService, Item } from '../services/storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  result  = null;
  scanActive = false;

  items: Item[] = [];
  newItem: Item = <Item>{};

  @ViewChild('inventory')inventory: IonList;

  constructor( private plt: Platform, private storageService: StorageService, private toastController: ToastController) {
    this.plt.ready().then(() => {
      this.loadItems();
    })
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
