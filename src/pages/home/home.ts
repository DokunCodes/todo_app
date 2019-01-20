import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { AddItemPage } from '../add-item/add-item'
import { ItemDetailPage } from '../item-detail/item-detail';
import { UpdateItemPage } from '../update-item/update-item';
import { Data } from '../../providers/data';
import { reorderArray } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items;
  public tasks = [];
  
 

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public dataService: Data) {

    this.initializeItems();

  }

  initializeItems() {
    this.items = [];
    this.dataService.getData().then((todos) => {

      if (todos) {
        this.tasks = JSON.parse(todos);
        for(let j=0;j<this.tasks.length;j++)
        {
         if(this.tasks[j].status === "P")
         {
          this.items.push(this.tasks[j]);
         }
        }
        
      }

    });
  }

  ionViewDidLoad() {

  }

  getItems(ev: any) {
    // Reset items back to all of the items

    // set val to the value of the searchbar
    const val = ev.target.value;
   
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else{
      this.initializeItems();
    }
}

  reorderItems(indexes) {
    this.items = reorderArray(this.items, indexes);
  }


  addItem() {

    let addModal = this.modalCtrl.create(AddItemPage);

    addModal.onDidDismiss((item) => {

      if (item) {
        this.saveItem(item);
      }

    });

    addModal.present();

  }

  saveItem(item) {
    this.items.push(item);
    this.dataService.save(this.items);
  }


  viewItem(item) {
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }

  updateItem(item) {
    
    this.navCtrl.push(UpdateItemPage, {
      item: item
    });


    
  }

  deleteItem(item) {
    
    this.items = this.items.filter(task => task.id != item.id);
   
  }

}