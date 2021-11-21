import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParamsHandler } from 'src/app/core/params-handler';
import { GlobalService } from 'src/app/core/services/global.service';
import { ApiRequest } from 'src/app/core/services/request.service';
interface Animal {
  name: string;
  sound: string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  addProductForm = this.formbuilder.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: ['', Validators.required],
    amount: ['1', Validators.required],
    describtion: [''],
  });
  errors = errorMessages;
  constructor(private formbuilder: FormBuilder, private gs: GlobalService) {}
  ngOnInit(): void {}

  category = new FormControl();
  categoryList: string[] = [
    'car',
    'cloth',
    'electric',
    'laptop',
    'smartPhone',
    'art',
    'sport',
    'toy',
    'dish',
    'smartWatch',
    'homeDesign',
  ];
  addProductReq(){
    let params = new ParamsHandler();
    params.addParam('name', this.addProductForm.get("name").value);
    params.addParam('category', this.addProductForm.get("category").value);
    params.addParam('price', this.addProductForm.get("price").value);
    params.addParam('amount', this.addProductForm.get("amount").value);
    params.addParam('describtion', this.addProductForm.get("describtion").value);
    this.insertProduct(params);

  }
  insertProduct(param: ParamsHandler) {
    ApiRequest('POST')
      .controller('product')
      .action('addProduct')
      .setBody(param)
      .call(this.gs)
      .subscribe((resp) => {
        console.log(resp);
      });
  }




}
export const errorMessages: { [key: string]: string } = {
  name: 'write Name',
  category: 'Please choose at least ONE category',
  price: 'Write IT',
  amount: '1 2 ...',
};
