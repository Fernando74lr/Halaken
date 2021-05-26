import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastController, IonList, Platform, ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
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

  constructor( private plt: Platform, private storageService: StorageService, private toastController: ToastController, public modalController: ModalController) {
    this.plt.ready().then(() => {
      this.loadItems();
    });
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

  // Show modal
  async presentModal(itemEdit: Item) {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'itemEdit': itemEdit,
        'modal': this.modalController
      }
    });
    this.inventory.closeSlidingItems();
    await modal.present();
  }
  
  addOrRemoveOne(item: Item, increment: Boolean) {
    let message = '';

    if (increment) {
      item.quantity = item.quantity + 1;
      message = 'Se añadió otro artículo para:' + item.name;
    } else {
      item.quantity = item.quantity - 1;
      message = 'Se quitó un artículo para:' + item.name;
    }

    item.modified = Date.now();

    this.storageService.updateItem(item).then(item => {
      this.showToast(message);
      this.inventory.closeSlidingItems();
      this.loadItems();
    });
  }

}
