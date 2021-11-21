export class User {
  UserID: number;
  RoleName?: string;
  RoleID?: number;
  UserName: string;
  BirthDate?: string;
  CreateDate?: number;
  Email?: string;
  FirstName?: string;
  Gender?: string;
  IdentifierNO?: string;
  LastName?: string;
  NationalNO?: string;
  Phone?: string;
  IsBlocked?: boolean;
  IsDelete?: boolean;
  IsEnable?: boolean;
  Token?: string;
  CellPhone?:string
  FormalName?:string
  AccountName?:string
}

export class UserLogin extends User {
  jwt: string;
}
