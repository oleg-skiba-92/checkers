import { EDataEntity, EDBFunctions } from '../../../models/db.model';
import { ERatingColumns, EUsersColumns } from '../tabels';

export const CREATE_RATING = `
CREATE OR REPLACE FUNCTION ${EDBFunctions.CreateRating}()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$

  DECLARE count_guest INTEGER;
  BEGIN
    INSERT INTO ${EDataEntity.Rating} (${ERatingColumns.UserId}) VALUES (NEW.${EUsersColumns.ID});
    RETURN NEW;
  END;

$$
`;
