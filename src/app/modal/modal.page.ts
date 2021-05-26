import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Item, StorageService } from '../services/storage.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  name: string = 'ddd';

  @Input() itemEdit: Item;
  @Input() modal: ModalController;
  newItem: Item = <Item>{};

  constructor(private storageService: StorageService, private toastController: ToastController) {}

  ngOnInit() {
    console.log(this.itemEdit);
  }

  // Close modal
  closeModal() {
    this.modal.dismiss();
  }

  // Test
  setValue() {
    console.log(this.itemEdit);    
  }

  // Update
  updateItem(item: Item) {
    // Update datetime
    item.modified = Date.now();
    this.storageService.updateItem(item).then(item => {
      this.showToast('Artículo editado ✔');
    });
    this.modal.dismiss();
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
