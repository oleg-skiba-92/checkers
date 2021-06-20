import { dataService } from '../../services/core';
import { EUsersColumns, IUserDataService, IUserTable } from './user.model';
import { EDataEntity } from '../../models/db.model';
import { IUserInfo } from '../../../models';

class UserData implements IUserDataService {
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
    return <any>await dataService.updateObject(this.entity, EUsersColumns.ID, id, {[EUsersColumns.GoogleId]: googleId});
  }

  async updateLastVisited(id: string): Promise<void> {
    await dataService.updateObject(this.entity, EUsersColumns.ID, id, {[EUsersColumns.LastVisited]: new Date()});
  }

  toUserInfo(user: IUserTable): IUserInfo {
    return {
      id: user.id.toString(),
      userName: user.user_name,
      email: user.email,
      dateCreated: user.date_created,
      picture: user.picture,
      rating: 1234
    };
  }
}

export const userData: IUserDataService = new UserData();
