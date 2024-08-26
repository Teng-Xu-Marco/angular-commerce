import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products'
  private categoryUrl = 'http://localhost:8080/api/product-category'

  constructor(private httpClient: HttpClient) { }

  getProductListByCategoryId(curCategoryId: number): Observable<Product[]> {

    // to call rest api on backend
    const url = this.baseUrl + `/search/findByCategoryId?id=${curCategoryId}`

    return this.getProducts(url);
  }

  getProductListByKeyword(theKeyword: string): Observable<Product[]> {

    // to call rest api on backend
    const url = this.baseUrl + `/search/findByNameContaining?name=${theKeyword}`

    return this.getProducts(url);
  }

  private getProducts(url: string): Observable<Product[]> {
    return this.httpClient.get<GetResponse>(url).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategoryList(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getProduct(curProductId: number): Observable<Product> {

    const url = `${this.baseUrl}/${curProductId}`;

    return this.httpClient.get<Product>(url);
  }
}

// unwrap the JSON from Spring Data REST _embedded entry
interface GetResponse {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}