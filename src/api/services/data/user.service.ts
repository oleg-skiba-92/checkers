import { EDataEntity, EUsersColumns, IUserTable } from '../../../models/db.model';
import { dataService } from '../core/db.service';

export interface IUserService {
  getByGoogleId(id: string, userName?: string, email?: string): Promise<IUserTable>;

  getByFacebookId(id: string, userName?: string, email?: string): Promise<IUserTable>;

  getById(id: string): Promise<IUserTable>;

  getByEmail(email: string): Promise<IUserTable>;

  registerUser(userName :string, email: string, passwordHash: string): Promise<IUserTable>;

  updatePassword(id:string, passwordHash: string): Promise<void>;
}

class UserService implements IUserService {
  private entity = EDataEntity.Users;

  public async getByGoogleId(id: string, userName?: string, email?: string): Promise<IUserTable> {
    let user: IUserTable = await dataService.getObject<IUserTable>(this.entity, EUsersColumns.GoogleId, id);
    if (user) {
      return user;
    }
    if (email) {
      user = await dataService.getObject<IUserTable>(this.entity, EUsersColumns.Email, email);

      if (user) {
        await dataService.updateObject(this.entity, EUsersColumns.Email, email, {[EUsersColumns.GoogleId]: id})
        return user;
      }
    }

    return await dataService.createObject<IUserTable>(this.entity, <IUserTable>{
      [EUsersColumns.FacebookId]: null,
      [EUsersColumns.GoogleId]: id,
      [EUsersColumns.UserName]: userName,
      [EUsersColumns.Email]: email,
      [EUsersColumns.Password]: null,
    });
  }

  public async getByFacebookId(id: string, userName?: string, email?: string): Promise<IUserTable> {
    let user: IUserTable = await dataService.getObject<IUserTable>(this.entity, EUsersColumns.FacebookId, id);
    if (user) {
      return user;
    }
    if (email) {
      user = await dataService.getObject<IUserTable>(this.entity, EUsersColumns.Email, email);

      if (user) {
        await dataService.updateObject(this.entity, EUsersColumns.Email, email, {[EUsersColumns.FacebookId]: id})
        return user;
      }
    }

    return await dataService.createObject<IUserTable>(this.entity, <IUserTable>{
      [EUsersColumns.FacebookId]: id,
      [EUsersColumns.GoogleId]: null,
      [EUsersColumns.UserName]: userName,
      [EUsersColumns.Email]: email,
      [EUsersColumns.Password]: null,
    });
  }

  public getById(id: string): Promise<IUserTable> {
    console.log('getById', id);
    return dataService.getObject<IUserTable>(this.entity, EUsersColumns.ID, id);
  }

  public getByEmail(email: string): Promise<IUserTable> {
    return dataService.getObject<IUserTable>(this.entity, EUsersColumns.Email, email);
  }

  public registerUser(userName :string, email: string, passwordHash: string): Promise<IUserTable> {
    return dataService.createObject<IUserTable>(this.entity, <IUserTable>{
      [EUsersColumns.FacebookId]: null,
      [EUsersColumns.GoogleId]: null,
      [EUsersColumns.UserName]: userName,
      [EUsersColumns.Email]: email,
      [EUsersColumns.Password]: passwordHash,
    });
  }

  public async updatePassword(id:string, passwordHash: string): Promise<void> {
    await dataService.updateObject(this.entity, EUsersColumns.ID, id, {[EUsersColumns.Password]: passwordHash});
  }
}

export const userService: IUserService = new UserService();
