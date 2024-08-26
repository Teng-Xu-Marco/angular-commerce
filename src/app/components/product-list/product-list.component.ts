import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  curCategoryId: number = 1;
  searchMode: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
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

    this.productService.getProductListByCategoryId(this.curCategoryId).subscribe((data) => {
      this.products = data;
    });
  }

  findProductByKeyword() {
    const keywordParam = this.route.snapshot.paramMap.get('keyword')!;

    this.productService.getProductListByKeyword(keywordParam).subscribe((data) => {
      this.products = data;
    });
  }
}
