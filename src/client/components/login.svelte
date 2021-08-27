<script lang="ts">

  import Input from './common/input.svelte';
  import {EApiValidationError, EApiErrorCode} from '../../models'
  import { usersService } from '../services';
  import { modalService } from '../services/core';

  import Registration from './registration.svelte';

  let inputValue = {
    password: '',
    email: '',
  };

  let loginErrorMessage = {
    password: '',
    email: '',
  };

  let loginErrorAnswer = {
    [EApiValidationError.Required]: 'This fild is required',
    [EApiValidationError.UserNotFound]: 'User Not Found',
    [EApiValidationError.UserExist]: 'User Exist',
    [EApiValidationError.PasswordIncorrect]: 'Password Incorrect',
    [EApiValidationError.InvalidPassword]: 'Invalid password'
  }

  let openRegistration = () => {
    modalService.openModal(Registration);
  };
  
   // при натисненні на кнопку login відправляються дані
   const loginToGame = async() => {
    loginErrorMessage = {
      password: '',
      email: '',
    }

    try {
      let date = await usersService.login(inputValue);
      modalService.closeActiveModal();
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

<div class="fco-login">
  
  <h2 class="fco-login__title">Login</h2>
  <form class="fco-login-form">

    <!-- Start input fields -->
    <Input
      bind:inputValue={inputValue.email}
      labelText="Login"
      errorMessage={loginErrorMessage.email} 
      inputType="text" inputName="login" 
      inputId="user-login" 
      inputPlaceholder="example@mail.com"
    />
  
    <Input 
      bind:inputValue={inputValue.password}
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
        type="button"
        class="fco-btn fco-btn--orange fco-btn--align-center fco-btn--width"
        on:click={()=> loginToGame()}
        >Login
      </button>

      <button 
        class="fco-btn fco-btn--orange fco-btn--align-center fco-btn--width"
        on:click={openRegistration}
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
