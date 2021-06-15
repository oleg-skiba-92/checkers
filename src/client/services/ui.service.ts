import { TSimpleDataCallback } from '../game/views.model';
import { IRoomPlayer } from '../../models/room.model';
import { EColor, EGameError } from '../../models';

interface IUser {
  [key: string]: any;
}

export class UiService {
  private freePlayersList: HTMLElement;
  private suggestsList: HTMLElement;
  private playersArea: HTMLElement;
  private currentTurn: HTMLElement;
  private gameError: HTMLElement;
  private confirm: HTMLElement;
  private loginForm: HTMLElement;
  private registrationForm: HTMLElement;

  updateFreePlayers(userList: IUser[], suggestGameClick: TSimpleDataCallback<string>) {
    this.freePlayersList.innerHTML = ''
    userList.forEach((user) => {
      let listItem = document.createElement('div');

      listItem.className = 'user-list__item';
      listItem.innerHTML = `<div class="user-list__user-name">${user.userName}</div>
<div class="user-list__actions">
<div class="btn btn--yes" data-user-id="${user.id}">Запропонувати</div>
</div>`;

      this.freePlayersList.append(listItem);
    });

    let btns = this.freePlayersList.getElementsByClassName('btn')
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', (event: MouseEvent) => {
        suggestGameClick((<HTMLDivElement>event.target).dataset['userId'])
      })
    }
  }

  updateSuggests(suggests: IUser[], onAgree: TSimpleDataCallback<string>, onDisagree: TSimpleDataCallback<string>) {
    this.suggestsList.innerHTML = ''
    suggests.forEach((user) => {
      let listItem = document.createElement('div');

      listItem.className = 'user-list__item';
      listItem.innerHTML = `<div class="user-list__user-name">${user.userName}</div>
<div class="user-list__actions">
<div class="btn btn--yes" data-user-id="${user.id}">Грати</div>
<div class="btn btn--no" data-user-id="${user.id}">Відмовитись</div>
</div>`;

      this.suggestsList.append(listItem);
    });

    let btns = this.suggestsList.getElementsByClassName('btn--yes');
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', (event: MouseEvent) => {
        onAgree((<HTMLDivElement>event.target).dataset['userId'])
      })
    }

    let btns2 = this.suggestsList.getElementsByClassName('btn--no')
    for (let i = 0; i < btns2.length; i++) {
      btns2[i].addEventListener('click', (event: MouseEvent) => {
        onDisagree((<HTMLDivElement>event.target).dataset['userId'])
      })
    }
  }

  newGame(currentUser: IRoomPlayer, opponentUser: IRoomPlayer) {
    document.body.className = 'page-game';
    this.playersArea.innerHTML = '';
    this.playersArea.append(this.createPlayerElement(currentUser));
    this.playersArea.append(this.createPlayerElement(opponentUser));
    this.changeTurnColor(EColor.Black); //TODO fix it
  }

  //TODO fix it
  changeTurnColor(nextColor: EColor) {
    let msg = '';
    switch (nextColor) {
      case EColor.White:
        msg = 'Хід чорних';
        break;
      case EColor.Black:
        msg = 'Хід білих';
        break;
    }

    this.currentTurn.innerHTML = msg
  }

  showError(error: EGameError) {
    let msg = '';
    switch (error) {
      case EGameError.OpponentTurn:
        msg = 'Зараз не ваш хід';
        break;
      case EGameError.NotYourChecker:
        msg = '';
        break;
      case EGameError.NeedEndTurn:
        msg = 'Потрібно закінчити хід';
        break;
      case EGameError.CannotTurnHere:
        msg = 'Ви не можете сюди ходити';
        break;
      case EGameError.CannotPossibleTurns:
        msg = 'Для цієї шашки немає ходів';
        break;
      case EGameError.BeatMandatory:
        msg = `Бій обов'язковий`;
        break;
    }

    this.gameError.innerHTML = msg
  }

  endGame() {
    document.body.className = 'page-list';
  }

  showConfirm(message: string, buttons: { label: string, className: string, cb: () => void }[]) {
    this.confirm.style.display = null;
    this.confirm.innerHTML = '';

    let contentEl = document.createElement('div');
    contentEl.className = 'confirm__content';
    let titleEl = document.createElement('div');
    titleEl.className = 'confirm__title';
    titleEl.innerText = message;
    let actionsEl = document.createElement('div');
    actionsEl.className = 'confirm__actions';

    let btns = buttons.map((btn) => {
      let btnEl = document.createElement('div');
      btnEl.className = `btn ${btn.className}`;
      btnEl.innerText = btn.label;
      btnEl.addEventListener('click', (event: MouseEvent) => {
        btn.cb();
      })
      return btnEl;
    })

    actionsEl.append(...btns);
    contentEl.append(titleEl, actionsEl);

    this.confirm.append(contentEl);
  }

  hideConfirm() {
    this.confirm.style.display = 'none';
  }

  initGamePage() {
    this.freePlayersList = document.getElementById('free-players');
    this.suggestsList = document.getElementById('suggests');
    this.playersArea = document.getElementById('game-players');
    this.currentTurn = document.getElementById('current-turn');
    this.gameError = document.getElementById('game-error');
    this.confirm = document.getElementById('confirm');
    this.hideConfirm();
  }

  initLoginPage(onLogin: TSimpleDataCallback<{ password: string, email: string }>, onRegistration: TSimpleDataCallback<{ email: string, password: string, userName: string }>) {

    this.registrationForm = document.getElementById('registration');
    this.loginForm = document.getElementById('login');

    this.showLoginForm();

    document.getElementById('register-submit').addEventListener('click', () => {
      this.registrationForm.getElementsByClassName('login-page__form-error')[0].innerHTML = '';
      let postData = <any>{};
      for (let i = 0; i < (<any>this.registrationForm).elements.length; i++) {
        if ((<any>this.registrationForm).elements[i].name) {
          postData[(<any>this.registrationForm).elements[i].name] = (<any>this.registrationForm).elements[i].value;
        }
      }

      onRegistration(postData);
    })

    document.getElementById('login-submit').addEventListener('click', () => {
      this.loginForm.getElementsByClassName('login-page__form-error')[0].innerHTML = '';
      let postData = <any>{};
      for (let i = 0; i < (<any>this.loginForm).elements.length; i++) {
        if ((<any>this.loginForm).elements[i].name) {
          postData[(<any>this.loginForm).elements[i].name] = (<any>this.loginForm).elements[i].value;
        }
      }

      onLogin(postData);
    });

    document.getElementById('login-btn').addEventListener('click', () => {
      this.showLoginForm();
    })

    document.getElementById('register-btn').addEventListener('click', () => {
      this.showRegistrationForm();
    });
  }

  showLoginForm() {
    this.loginForm.style.visibility = 'visible';
    this.loginForm.style.height = null;
    this.registrationForm.style.visibility = null;
    this.registrationForm.style.height = '0';
  }

  showRegistrationForm() {
    this.registrationForm.style.visibility = 'visible';
    this.registrationForm.style.height = null;
    this.loginForm.style.visibility = null;
    this.loginForm.style.height = '0';
  }

  showLoginFormError(msg: string) {
    this.loginForm.getElementsByClassName('login-page__form-error')[0].innerHTML = msg;
  }

  showRegistrationFormError(msg: string) {
    this.registrationForm.getElementsByClassName('login-page__form-error')[0].innerHTML = msg;
  }

  private createPlayerElement(player: IRoomPlayer): HTMLElement {
    let el = document.createElement('div');
    el.className = 'game__player';
    el.innerHTML = `<div class="game__player-name">${player.userName}</div>
<img class="game__player--checker" src="assets/${player.color}-checker.png">`;

    return el;
  }
}
