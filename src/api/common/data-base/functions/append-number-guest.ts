import { EDataEntity, EDBFunctions } from '../../../models/db.model';
import { EGuestsColumns } from '../../../features/guest/guest.model';
import { EUsersColumns } from '../../../features/user/user.model';

export const APPEND_NUMBER_GUEST = `
CREATE OR REPLACE FUNCTION ${EDBFunctions.AppendNumberGuest}()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$

  DECLARE count_guest INTEGER;
  BEGIN
    SELECT * INTO count_guest FROM ${EDataEntity.GuestCount} LIMIT 1;

    IF count_guest IS NULL THEN 
      count_guest = 1;
      INSERT INTO ${EDataEntity.GuestCount} (${EGuestsColumns.Count}) VALUES (1);
    ELSE
      count_guest = count_guest + 1;
      UPDATE ${EDataEntity.GuestCount} SET ${EGuestsColumns.Count} = count_guest;
    END IF;
    
    NEW.${EUsersColumns.UserName} = CONCAT(NEW.${EUsersColumns.UserName}, ' ', count_guest);
    
    RETURN NEW;
  END;

$$
`;
