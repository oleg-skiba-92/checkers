<script lang="ts">

  import Input from './common/input.svelte';
  import Login from './login.svelte';
  import { modalService } from '../services/core';
  import {EApiValidationError, EApiErrorCode} from '../../models'
  import { usersService } from '../services';

  let inputValueRegistration = {
    userName: '',
    password: '',
    email: '',
  };

  let loginErrorMessage = {
    userName: '',
    password: '',
    email: '',
  };

  // думаю тут повинна бути друга змінна з другими помилками
  let loginErrorAnswer = {
    [EApiValidationError.Required]: 'This fild is required',
    [EApiValidationError.UserNotFound]: 'User Not Found',
    [EApiValidationError.UserExist]: 'User Exist',
    [EApiValidationError.PasswordIncorrect]: 'Password Incorrect',
    [EApiValidationError.InvalidPassword]: 'Invalid password'
  }
  

  let openLogin = () => {
    modalService.openModal(Login);
  };
  
   // при натисненні на кнопку Registration відправляються дані
   const registrationInGame = async() => {
    loginErrorMessage = {
      userName: '',
      password: '',
      email: '',
    }

    try {
      let date = await usersService.registration(inputValueRegistration);
    }
    catch (err) {
      if (err && err.error === EApiErrorCode.ValidationError) {
          (err.payload || []).forEach(errorData => {
            loginErrorMessage[errorData.field] = loginErrorAnswer[errorData.error];
          });
      }
    }
  
  }

</script>

<!--------------------------------HTML CODE-------------------------------->

<div class="fco-registration">

  <h2 class="fco-login__title">Registration</h2>
  <form class="fco-login-form">
    
    <!-- Start input fields -->
    <Input
      bind:inputValue={inputValueRegistration.userName}
      labelText="User name"
      errorMessage={loginErrorMessage.userName} 
      inputType="text" 
      inputName="userName" 
      inputId="user-login" 
      inputPlaceholder="example@mail.com"
    />

    <Input
      bind:inputValue={inputValueRegistration.email}
      labelText="Email"
      errorMessage={loginErrorMessage.email} 
      inputType="text" 
      inputName="email" 
      inputId="user-login" 
      inputPlaceholder="example@mail.com"
    />

    <Input 
      bind:inputValue={inputValueRegistration.password}
      labelText="Password"
      errorMessage={loginErrorMessage.password}
      inputType="password"
      inputName="password"
      inputId="user-password"
      inputPlaceholder="******"
    />
    <!-- End input fields -->
    
    <!-- 2 Buttons: login & Registration -->
    <div class="fco-login__button-wrapper">
      <button 
        class="fco-btn fco-btn--orange fco-btn--align-center fco-btn--width"
        on:click={openLogin}
        >Login
      </button>

      <button
        class="fco-btn fco-btn--orange fco-btn--align-center fco-btn--width"
        on:click={()=> registrationInGame()}
        >Registration
      </button>
    </div>
  </form>

  <!-- Login with ... -->
  <div class="fco-login__horizontal-line-wrapper">
    <div class="fco-login__horizontal-line"></div>
      or connect with 
    <div class="fco-login__horizontal-line"></div>
  </div>
  <button class="fco-btn fco-btn--align-center fco-btn--login fco-btn--width">g+ Google</button>
</div>
