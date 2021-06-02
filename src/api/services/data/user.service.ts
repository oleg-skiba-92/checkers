import { EDataEntity, EUsersColumns, IUserTable } from '../../../models';
import { dataService } from '../core';
import { IUserInfo } from '../../../models';

export interface IUserService {
  getByGoogleId(id: string): Promise<IUserTable>;

  getById(id: string): Promise<IUserTable>;

  getByEmail(email: string): Promise<IUserTable>;

  updatePassword(id: string, passwordHash: string): Promise<void>;

  updateGoogleId(id: string, googleId: string): Promise<void>;

  createUser(data: IUserTable): Promise<IUserTable>;

  toUserInfo(user: IUserTable): IUserInfo;
}

class UserService implements IUserService {
  private entity = EDataEntity.Users;

  getByGoogleId(id: string): Promise<IUserTable> {
    return dataService.getObject<IUserTable>(this.entity, EUsersColumns.GoogleId, id);
  }

  getById(id: string): Promise<IUserTable> {
    return dataService.getObject<IUserTable>(this.entity, EUsersColumns.ID, id);
  }

  getByEmail(email: string): Promise<IUserTable> {
    return dataService.getObject<IUserTable>(this.entity, EUsersColumns.Email, email);
  }

  createUser(data: IUserTable): Promise<IUserTable> {
    return dataService.createObject<IUserTable>(this.entity, data);
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await dataService.updateObject(this.entity, EUsersColumns.ID, id, {[EUsersColumns.Password]: passwordHash});
  }

  async updateGoogleId(id: string, googleId: string): Promise<void> {
    return <any> await dataService.updateObject(this.entity, EUsersColumns.ID, id, {[EUsersColumns.GoogleId]: googleId});
  }

  toUserInfo(user: IUserTable): IUserInfo {
    return {
      id: user.id.toString(),
      userName: user.user_name,
      email: user.email,
      dateCreated: user.date_created,
    }
  }
}

export const userService: IUserService = new UserService();
