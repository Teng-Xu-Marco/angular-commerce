import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  // can be subscribed
  totalPrice: Subject<number> = new Subject<number>;
  totalQuantity: Subject<number> = new Subject<number>;;

  constructor() { }

  addToCart(theCartItem: CartItem) {
    let existedCartItem: CartItem | undefined;
    let curTotalPrice: number = 0.00
    let curTotalQuantity: number = 0;

    if (this.cartItems.length > 0) {
      for(let tmpCartItem of this.cartItems) {
        curTotalPrice += tmpCartItem.unitPrice * tmpCartItem.quantity;
        curTotalQuantity += tmpCartItem.quantity;
  
        if (tmpCartItem.id == theCartItem.id) {
          existedCartItem = tmpCartItem;
        }
      }
    }

    if (existedCartItem != undefined) {
      existedCartItem.quantity += 1;
    } else {
      this.cartItems.push(theCartItem)
    }

    curTotalPrice += theCartItem.unitPrice;
    curTotalQuantity += 1;

    // push/publish the value to all the subscribers
    this.totalPrice.next(curTotalPrice);
    this.totalQuantity.next(curTotalQuantity);
  }
}
