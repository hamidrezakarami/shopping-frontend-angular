export class User {
    UserID: number;
    AccountID: number;
    RoleID: number;
    UserName: string;
    FormalName: string;
    Email: string;
    CellPhone: string;
    RoleName: string;
    AccountName: string;
    State: UserState;
    LastActivity: Date;
    UnitOfDistance: number;
    MapAPI: number;
}

enum UserState{
    Active =1,
    Deactive =2,
    Verify =3,
}

export class Profile extends User {
    GUID : string;
}

export class LoginResult extends Profile {
    Error: string;
    Token: string;
}

export class UserList{
    Users : User[];
    Count : number;
}

export class UserAccountList{
    Users : Account[];
    Count : number;
}

export class UserAccount{
    AccountFlag: number;
    AccountID : number;
    AccountName : string;
    AccountRefID : number;
    AccountBucketName: string;
    AccountBucketKey: string;
    AccountTravelTimeFileName: string;
    AccountTimeZone:string;
    MapConfig: string;
}

export class Role{
    RoleID : number;
    RoleName : string;
}
export class RoleAccess{
    RoleID : number;
    RoleName : string;
}

export class Access{
    AccessGroupID : number;
    AccessGroupName : string;
    //AccessID : number;
    //AccessName : string;
   //AccessQueueName : string;
}


export class Account{
    AccountID : number;
    AccountName : string;
    AccountRefID : number;
}







