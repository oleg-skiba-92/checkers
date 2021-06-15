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
]
