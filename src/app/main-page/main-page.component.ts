import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private mobileQueryListener$: () => void;

  constructor(
              public media: MediaMatcher,
              public changeDetectorRef: ChangeDetectorRef,
              public menuService: MenuService) {    
    this.mobileQuery = media.matchMedia('(max-width: 1400px)');
    this.mobileQuery.addEventListener('change', () => {
      changeDetectorRef.detectChanges();
    });
   }

  ngOnInit() {
  }

  isScreenSmall(): boolean {
    return this.mobileQuery.matches;
  }

}