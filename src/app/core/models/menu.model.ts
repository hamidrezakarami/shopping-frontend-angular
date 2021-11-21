export interface MenuItem {
    id?: number;
    name: string;
    link?: string;
    onClick?: () => void;
    fontIcon?: string;
    imageIcon?: string;
    roleID?: number;
    selected?: boolean;
    width?: number;
    left?: number;
    location?: 'top-menu'| 'nav-menu';
  }