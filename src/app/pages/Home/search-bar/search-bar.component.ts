import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LabelType } from 'ng5-slider';
import { Page } from 'src/app/core/Page';
import { ParamsHandler } from 'src/app/core/params-handler';
import { GlobalService } from 'src/app/core/services/global.service';
import { ApiRequest } from 'src/app/core/services/request.service';
// import { LabelType, Options } from 'ng5-slider';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent extends Page implements OnInit {
  @Output() onSearch = new EventEmitter<ParamsHandler>();
  expandable = true;
  showSearchHeader = true;
  state = false;
  clickOnExportBTN = false;
  priceRange: Array<string> = [];
  searchData: { maxPrice?: number } = {};

  viewState: Params;

  constructor(private snackBar: MatSnackBar, private gs: GlobalService) {
    super('#/search/home/', (error, action, className) => {
      this.snackBar.open(error, action, {
        panelClass: [className],
        duration: 10000,
      });
    });
    this.init(this.viewState);
    this.resetViewState({ name: null, sortByPrice: null });
  }

  ngOnInit(): void {
    this.getSearchData();
  }

  expansion_onOpen(sender: any) {
    if (
      this.expandable == false &&
      sender.expanded != false &&
      this.state == false
    ) {
      sender.close();
    }
    if (this.clickOnExportBTN) {
      sender.close();
      this.clickOnExportBTN = false;
    }

    if (this.expandable != false && sender.expanded != false) {
      this.showSearchHeader = false;
    }
  }

  expansion_onClose(sender: any) {
    if (
      this.expandable == false &&
      sender.expanded == false &&
      this.state == true
    ) {
      this.showSearchHeader = true;
      sender.open();
    }

    if (this.expandable != false && sender.expanded == false) {
      this.showSearchHeader = true;
    }
  }

  getSearchData() {
    ApiRequest('GET')
      .controller('product')
      .action('search')
      .call(this.gs)
      .subscribe((resp) => {
        this.searchData.maxPrice = resp.maxPrice + 10;
        this.viewState.rangeSlider = this.resetRengSlider();
      });
  }

  OnSearchByFilter() {
    let params = new ParamsHandler();

    params.addParam('name', this.viewState.name);
    params.addParam('minPrice', this.viewState.rangeSlider['minValue']);
    params.addParam('maxPrice', this.viewState.rangeSlider['maxValue']);
    params.addParam('sortWith', 'price');
    params.addParam('increase', this.viewState.sortByPrice);
    console.log(params);
    
    this.onSearch.emit(params);
  }

  OnClearFilter() {}

  resetRengSlider(): object {
    return {
      minValue: 0,
      maxValue: this.searchData.maxPrice,
      options: {
        floor: 0,
        ceil: this.searchData.maxPrice,
        translate: (value: number, label: LabelType): string => {
          switch (label) {
            case LabelType.Low:
              return '<b>Min price:</b> $' + value;
            case LabelType.High:
              return '<b>Max price:</b> $' + value;
            default:
              return '$' + value;
          }
        }
      },
    };
  }
}
interface Params {
  name: string;
  rangeSlider:object;
  sortByPrice:number;
}
