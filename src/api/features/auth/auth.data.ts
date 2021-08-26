import { EAuthColumns, IAuthDataService, IAuthTable } from './auth.model';
import { dataService } from '../../services/core';
import { EDataEntity } from '../../models/db.model';

export class AuthData implements IAuthDataService {
  private entity = EDataEntity.Auth;

  create(data: IAuthTable): Promise<IAuthTable> {
    return dataService.createObject<IAuthTable>(this.entity, data);
  }

  getByGoogleId(id: string): Promise<IAuthTable> {
    return dataService.getObject<IAuthTable>(this.entity, EAuthColumns.GoogleId, id);
  }

  getByUserId(id: string): Promise<IAuthTable> {
    return dataService.getObject<IAuthTable>(this.entity, EAuthColumns.UserId, id);
  }

  getByEmail(email: string): Promise<IAuthTable> {
    return dataService.getObject<IAuthTable>(this.entity, EAuthColumns.Email, email);
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await dataService.updateObject(this.entity, EAuthColumns.UserId, userId, {[EAuthColumns.Password]: passwordHash});
  }

  async updateGoogleId(userId: string, googleId: string): Promise<void> {
    await dataService.updateObject(this.entity, EAuthColumns.UserId, userId, {[EAuthColumns.GoogleId]: googleId});
  }
}

export const authData: IAuthDataService = new AuthData();
