import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  // can be subscribed
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}

  addToCart(theCartItem: CartItem) {
    let existedCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      // find the 1st matched item in the array
      existedCartItem = this.cartItems.find(
        (item) => item.id === theCartItem.id
      );
    }

    if (existedCartItem != undefined) {
      existedCartItem.quantity += 1;
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeTotal();
  }

  computeTotal() {
    let curTotalPrice: number = 0;
    let curTotalQuantity: number = 0;

    for (let tmpCartItem of this.cartItems) {
      curTotalPrice += tmpCartItem.unitPrice * tmpCartItem.quantity;
      curTotalQuantity += tmpCartItem.quantity;
    }

    // push/publish the value to all the subscribers
    this.totalPrice.next(curTotalPrice);
    this.totalQuantity.next(curTotalQuantity);
  }

  decreaseQuantity(theCartitem: CartItem) {
    theCartitem.quantity -= 1;
  
    if (theCartitem.quantity === 0) {
      this.removeFromCart(theCartitem);
    }else{
      this.computeTotal();
    }
  }

  removeFromCart(theCartitem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartitem.id);
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
    }
    this.computeTotal();
  }
}
