import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from '../core/models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menu$: BehaviorSubject<MenuItem[]>;
  private currentMenu$: BehaviorSubject<MenuItem>;
  private navbarIsActive$: BehaviorSubject<boolean>;
  private profile$: BehaviorSubject<MenuItem[]>;
  private topbarMenuList$: BehaviorSubject<MenuItem[]>;
  private navbarMenuList$: BehaviorSubject<MenuItem[]>;
  public thislink : string = null

  constructor() {
    this.menu$ = new BehaviorSubject<MenuItem[]>([]);
    this.topbarMenuList$ = new BehaviorSubject<MenuItem[]>([]);
    this.navbarMenuList$ = new BehaviorSubject<MenuItem[]>([]);
    this.currentMenu$ = new BehaviorSubject<MenuItem>(null);
    this.navbarIsActive$ = new BehaviorSubject<boolean>(false);
    this.profile$ = new BehaviorSubject<MenuItem[]>([]);
  }

  // observable get

  public getMenuList(): MenuItem[] {
    return this.menu$.value;
  }

  get menuListAsObservable() {
    return this.menu$.asObservable();
  }

  get topbarMenuListAsObservable() {
    return this.topbarMenuList$.asObservable();
  }

  get navbarMenuListAsObservable() {
    return this.navbarMenuList$.asObservable();
  }

  get currentMenuAsObservable() {
    return this.currentMenu$.asObservable();
  }

  get navbarActiveAsObservable() {
    return this.navbarIsActive$.asObservable();
  }

  get profileAsObservable() {
    return this.profile$.asObservable();
  }

  // method

  set setProfileList(menuList: MenuItem[]) {
    this.profile$.next(menuList);
  }

  public addProfileItem(profileItem: MenuItem) {
    this.profile$.getValue().push(profileItem);
    this.profile$.next(this.profile$.getValue());
  }

  set setMenuList(menuList: MenuItem[]) {
    menuList.forEach( m => {
      m.left = null;
      m.width = null;
      m.location = 'top-menu';
    });
    this.menu$.next(menuList);
    this.updateMenu();
  }

  public addMenuItem(menuItem: MenuItem) {
    this.menu$.getValue().push(menuItem);
    this.menu$.getValue().forEach( m => {
      m.left = null;
      m.width = null;
      m.location = 'top-menu';
    });
    this.menu$.next(this.menu$.getValue());
    this.updateMenu();
  }

  public selectedMenu(selectedMenu: MenuItem) {
    this.currentMenu$.next(selectedMenu);
  }

  public updateMenu() {
    const topbarMenu = this.menu$.getValue().filter( m => m.location === undefined || m.location === 'top-menu');
    const navbarMenu = this.menu$.getValue().filter( m => m.location === 'nav-menu');
    this.topbarMenuList$.next(topbarMenu);
    this.navbarMenuList$.next(navbarMenu);
    this.navbarIsActive$.next(navbarMenu.length > 0);
  }

}



