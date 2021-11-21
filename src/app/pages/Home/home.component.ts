import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParamsHandler } from 'src/app/core/params-handler';
import { GlobalService } from 'src/app/core/services/global.service';
import { ApiRequest } from 'src/app/core/services/request.service';
import { Toaster } from 'src/app/core/toast-notification';
import { Product } from '../shared/models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  productCards: Product[] = [];

  constructor(
    public router: Router,
    private gs: GlobalService,
    private toaster: Toaster
  ) {}

  ngOnInit(): void {
    this.getProducts(new ParamsHandler());
  }

  onClickMoreProperties() {}

  onClickCard(product: Product) {
    console.log(product);
    this.productCards.push(product);
    this.toaster.open({
      type: 'success',
      text: 'Add to card successfuly',
    });
  }

  getProducts(params: ParamsHandler = null) {
    ApiRequest('GET')
      .controller('product')
      .setParam(params)
      .call(this.gs)
      .subscribe((resp) => {
        console.log(resp);
        this.products = resp;
      });
  }

  onClickProduct(event: Product) {
    console.log(event);
  }
}
