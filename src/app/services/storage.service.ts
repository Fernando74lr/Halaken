import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Item {
  name: string,
  price: number,
  quantity: number,
  description: string,
  barcode: string,
  modified: number
}

const ITEMS_KEY = 'inventory';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements OnInit {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async ngOnInit() {
    //
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create
  addItem(item: Item): Promise<any> {
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      if (items) {
        items.push(item);
        return this.storage.set(ITEMS_KEY, items);
      } else {
        return this.storage.set(ITEMS_KEY, [item]);
      }
    });
  }
  
  // Read
  getItems(): Promise<any> {
    return this.storage.get(ITEMS_KEY);
  }
  
  // Update
  updateItem(item: Item): Promise<any> {
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      if (!items || items.length === 0) {
        return null;
      }
      
      let newItems: Item[] = [];

      for (let i of items) {
        if (i.barcode === item.barcode) {
          newItems.push(item);
        } else {
          newItems.push(i);
        }
      }

      return this.storage.set(ITEMS_KEY, newItems);
    });
  }
  
  // Delete
  deleteItem(barcode: string): Promise<Item> {
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      if (!items || items.length === 0) {
        return null;
      }

      let toKeep: Item[] = [];

      for (let i of items) {
        if (i.barcode !== barcode) {
          toKeep.push(i);
        }
      }

      return this.storage.set(ITEMS_KEY, toKeep);
    });
  }
  
}
