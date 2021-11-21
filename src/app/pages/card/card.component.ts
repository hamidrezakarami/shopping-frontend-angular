import { Component, OnInit } from '@angular/core';
import { ParamsHandler } from 'src/app/core/params-handler';
import { GlobalService } from 'src/app/core/services/global.service';
import { ApiRequest } from 'src/app/core/services/request.service';
import { Product } from '../shared/models/product.model';
import { Card } from '../shared/models/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  cards: Card[] = [];
  products: Product[] = [];
  errors = errorMessages;
  constructor(private gs: GlobalService) {}

  ngOnInit(): void {
    this.getProducts(new ParamsHandler());
  }

  getProducts(params: ParamsHandler = null) {
    ApiRequest('GET')
      .controller('product')
      .action('')
      .setParam(params)
      .call(this.gs)
      .subscribe((resp) => {
        console.log(resp);
        this.products = resp;
        // if(resp.imgUrls?length == 0)
        //   console.log(resp.name)
        // else
        //   console.log("salam")

        this.cards = [
          {
            _id: '1',
            status: 'progressing ...',
            address: 'arazi-payin kuh',
            totalPrice: 84,
            arrivalDate: '10/11/2021',
            description: '',
            createCardDate: '10/11/2021',
            products: resp,
          },
          {
            _id: '2',
            status: 'not reci',
            address: 'asf',
            totalPrice: 84,
            arrivalDate: '10/11',
            description: 'lukyfg',
            createCardDate: '3/3',
            products: resp,
          },
        ];
      });
  }
}
export const errorMessages: { [key: string]: string } = {};
