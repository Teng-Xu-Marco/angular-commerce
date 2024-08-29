import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule],
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  curCategoryId: number = 1;
  prevCategoryId: number = 1;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  prevKeywordParam: string = "";

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  // similar to @PostConstruct
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.listProducts());
  }

  listProducts() {
    const searchMode = this.route.snapshot.paramMap.has('keyword');

    if (searchMode) {
      this.findProductByKeyword();
    } else {
      this.findProductByCategoryId();
    }
  }

  findProductByCategoryId() {
    // check if 'id' is available, '!' is used to tell comnpiler that the object is not null
    const categoryIdParam = this.route.snapshot.paramMap.get('id')!;

    // if 'id' doesn't exist, use the default value
    this.curCategoryId = categoryIdParam ? +categoryIdParam : 1;

    // check if the category has been changed
    if (this.prevCategoryId != this.curCategoryId) {
      this.thePageNumber = 1;
    }

    this.prevCategoryId = this.curCategoryId;

    this.productService
      .getProductListPaginate(
        // notice that page number in Spring Data REST is 0-index
        this.thePageNumber - 1,
        this.thePageSize,
        this.curCategoryId
      )
      .subscribe(this.processResult());
  }

  findProductByKeyword() {
    const keywordParam = this.route.snapshot.paramMap.get('keyword')!;

    if (this.prevKeywordParam != keywordParam) {
      this.thePageNumber = 1;
    }
    
    this.prevKeywordParam = keywordParam;

    this.productService
      .searchProductListPaginate(
        // notice that page number in Spring Data REST is 0-index
        this.thePageNumber - 1,
        this.thePageSize,
        keywordParam
      )
      .subscribe(this.processResult());
  }

  private processResult() {
    return (data: any) => {
      (this.products = data._embedded.products),
        (this.thePageNumber = data.page.number + 1),
        (this.thePageSize = data.page.size),
        (this.theTotalElements = data.page.totalElements);
    };
  }

  pageSizeHandler(mySelectedValue: string) {
    this.thePageSize = +mySelectedValue;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(theProduct);

    // call the cart service to update the maintained information for items in the cart
    this.cartService.addToCart(new CartItem(theProduct));
  }
}
