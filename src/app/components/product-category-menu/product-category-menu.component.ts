import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-category-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css'
})
export class ProductCategoryMenuComponent implements OnInit{

  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService,
              private route: ActivatedRoute) {}

  // similar to @PostConstruct
  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategoryList().subscribe(
      data => {
        // console.log('Product Categories=' + JSON.stringify(data));
        this.productCategories = data;
      }
    )
  }
}
