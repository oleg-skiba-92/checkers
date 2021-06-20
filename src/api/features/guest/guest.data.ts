import { EGuestsColumns, IGuestDataService, IGuestTable } from './guest.model';
import { IUserInfo } from '../../../models';
import { dataService } from '../../services/core';
import { EDataEntity } from '../../models/db.model';

export class GuestData implements IGuestDataService {
  private entity = EDataEntity.Guests;

  getById(id: string): Promise<IGuestTable> {
    return dataService.getObject<IGuestTable>(this.entity, EGuestsColumns.ID, id);
  }

  create(data: IGuestTable): Promise<IGuestTable> {
    return dataService.createObject<IGuestTable>(this.entity, data);
  }

  async updateLastVisited(id: string): Promise<void> {
    await dataService.updateObject(this.entity, EGuestsColumns.ID, id, {[EGuestsColumns.LastVisited]: new Date()});
  }

  toUserInfo(guest: IGuestTable): IUserInfo {
    return {
      id: guest.id,
      userName: `${guest.user_name} ${guest.count_number}`,
      email: null,
      dateCreated: guest.date_created,
      picture: null,
      rating: 1234
    };
  }
}

export const guestData: IGuestDataService = new GuestData();
