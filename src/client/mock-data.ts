import { playersService } from './services/players.service';
import { usersService } from './services/users.service';

export function mock(err, data) {
  if(err == 'TypeError: Failed to fetch') {
    console.log('used mock data');
    return data;
  } else {
    throw new Error(err);
  }
}

export const mUser = {id: '111', userName: 'unauthorized user', picture: 'assets/my-avatar.png', rating: 1234};
export const mFreePlayers = [
  {id: '111', userName: 'Test User 1', picture: 'assets/avatar.png', rating: 1234},
  {id: '222', userName: 'Test User 2', picture: 'assets/avatar.png', rating: 1234},
  {id: '333', userName: 'Test User 3', picture: 'assets/avatar.png', rating: 1234},
  {id: '444', userName: 'Test User 4', picture: 'assets/avatar.png', rating: 1234},
  {id: '555', userName: 'Test User 4', picture: 'assets/avatar.png', rating: 1234},
]
export const mInvites = [
  {
    from: {id: '222', userName: 'Test User 2', picture: 'assets/avatar.png', rating: 1234},
    to: {id: '111', userName: 'Test User 1', picture: 'assets/avatar.png', rating: 1234}
  },
  {
    from: {id: '333', userName: 'Test User 3', picture: 'assets/avatar.png', rating: 1234},
    to: {id: '111', userName: 'Test User 1', picture: 'assets/avatar.png', rating: 1234}
  },
  {
    from: {id: '444', userName: 'Test User 4', picture: 'assets/avatar.png', rating: 1234},
    to: {id: '111', userName: 'Test User 1', picture: 'assets/avatar.png', rating: 1234}
  },
  {
    from: {id: '555', userName: 'Test User 5', picture: 'assets/avatar.png', rating: 1234},
    to: {id: '111', userName: 'Test User 1', picture: 'assets/avatar.png', rating: 1234}
  },
]

export const mockAllData = () => {
  usersService.me$.set(mUser)
  playersService.updateFreePlayerList(mFreePlayers)
  playersService.updateInvitesList(mInvites)
}
