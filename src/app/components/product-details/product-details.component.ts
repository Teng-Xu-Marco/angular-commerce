import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.handleProductDetails());
  }

  handleProductDetails() {
    const curProductId = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(curProductId).subscribe((data) => {
      // console.log('Product=' + JSON.stringify(data));
      this.product = data;
    });
  }
}