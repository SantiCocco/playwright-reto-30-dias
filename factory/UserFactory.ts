import { UserModel } from '../models/UserModel';

export class UserFactory {
  private static defaultPassword: string = 'Password123!';

  private static base(overrides: Partial<UserModel>): UserModel {
    const defaults: UserModel = {
      username: `user-` + crypto.randomUUID().slice(0, 6),
      employeeName: 'test user Employee',
      password: this.defaultPassword,
      confirmPassword: this.defaultPassword,
      role: 'ESS',
      status: `Enabled`,
    };
    return {
      ...defaults,
      ...(overrides || {}),
    };
  }

  public static createEmployeeESS(overrides?: Partial<UserModel>){
    return this.base({
      role: 'ESS',
      ...(overrides || {}),
    });
  }

  public static createAdmin(overrides?: Partial<UserModel>){
    return this.base({
      role: 'Admin',
      ...(overrides || {}),
    });
  }

  public static createDisabledAdmin(overrides?: Partial<UserModel>){
    return this.base({
      role: 'Admin',
      status: 'Disabled',
      ...(overrides || {}),
    });
  }

  
}