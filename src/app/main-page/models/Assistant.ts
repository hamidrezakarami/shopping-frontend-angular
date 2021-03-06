
export class Assistant {
  public static menuItem: any[] = [
    {
      id: 0,
      // name: 'H&N',
      link: '/search/home',
      fontIcon: '',
      icon: 'https://hn-int.com/wp-content/uploads/2020/09/wp-favicon.png',
      admin: false,
    },
    {
      id: 1,
      name: 'My Cards',
      link: '/search/mycard',
      fontIcon: 'shopping_cart',
      icon: '',
      admin: false,
    },    {
      id: 2,
      name: 'AddProduct',
      link: '/search/addproduct',
      fontIcon: 'add',
      icon: '',
      admin: false,
    },    {
      id: 3,
      name: 'Login',
      link: '/login',
      fontIcon: 'login',
      icon: '',
      admin: false,
    },
    // {
    //   id: 2,
    //   name: 'MyCards',
    //   link: '/search/schools',
    //   fontIcon: '',
    //   icon: './assets/menu/school.svg',
    //   admin: false,
    // },
    // {
    //   id: 3,
    //   name: 'Routes',
    //   link: '/search/routes',
    //   fontIcon: 'pin_drop',
    //   icon: '',
    //   admin: false,
    // },
    // {
    //   id: 4,
    //   name: 'Fleet',
    //   link: '/search/fleet',
    //   fontIcon: 'directions_bus',
    //   icon: '',
    //   admin: false,
    // },
    // {
    //   id: 5,
    //   name: 'Monitor',
    //   link: '/search/monitors',
    //   fontIcon: 'supervisor_account',
    //   icon: '',
    //   admin: false,
    // },
    // {
    //   id: 6,
    //   name: 'Stop',
    //   link: '/search/stop',
    //   fontIcon: '',
    //   icon: './assets/menu/bus-stop.svg',
    //   admin: false,
    // },
    // // {
    // //   id: 7,
    // //   name: 'Corner Stop',
    // //   link: '/search/cornerstop',
    // //   fontIcon: '',
    // //   icon: './assets/menu/corner-stop.svg',
    // //   admin: false,
    // // },
    // // {
    // //   id: 8,
    // //   name: 'Yards',
    // //   link: '/search/yards',
    // //   fontIcon: '',
    // //   icon: './assets/menu/yard.svg',
    // //   admin: false,
    // // },
    // {
    //   id: 9,
    //   name: 'Import/Export',
    //   link: '/search/imports-and-exports',
    //   fontIcon: 'cloud_download',
    //   icon: '',
    //   admin: false,
    // },
    // // {
    // //   name: "Schedule",
    // //   link: "/settings/schedule",
    // //   fontIcon: "schedule",
    // //   icon: "",
    // //   admin:true
    // // },
  ];

  public static ConvertTime(time: number): string {
    var date = new Date();
    date.setSeconds(time);
    return date.toISOString();
  }
  public static getColor(index): string {
    var color = [
      '#f44336',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#00BCD4',
      '#009688',
      '#4CAF50',
      '#8BC34A',
      '#CDDC39',
      '#FFEB3B',
      '#FFC107',
      '#FF9800',
      '#FF5722',
      '#795548',
      '#9E9E9E',
      '#607D8B',
    ];
    return color[index % color.length];
  }
  public static getIntTime(value: string) {
    var a = value.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    return +a[0] * 60 * 60 + +a[1] * 60;
  }

  public static castBoolToNumber(val: boolean): number {
    if (val == true) {
      return 1;
    } else {
      return 0;
    }
  }

  public static isJSON(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}
