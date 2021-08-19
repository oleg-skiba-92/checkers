<script lang="ts">

  import Input from './common/input.svelte';
  //import {EApiValidationError} from '../../models' // Бред
  import { usersService } from '../services';
  
  let inputValue = {
    password: '',
    email: '',
  };
  
  /*// Якийсь бред
  async function catchLoginError() {
		const loginDate = await fetch(EApiValidationError);
		
		if (EApiValidationError) {
			return "";
		} else {
			throw new Error('Error message!!!');
		}
	}
*/
   // при натисненні на кнопку login відправляються дані
   const loginToGame = () => {
    usersService.login(inputValue);
  }
  //let promise = loginToGame();
  
</script>

<!--------------------------------HTML CODE-------------------------------->

<div class="fco-login">
  
  <h2 class="fco-login__title">Login</h2>
  <form class="fco-login-form">
    
    <!-- 
      ще одна тупость
    {#await promise}
    <p>хз шо це...</p>
    {:then 'Error Message!!!'}
    <Input bind:inputValue={inputValue.email} labelText="Login" errorMessage="" inputType="text" inputName="login" inputId="user-login" inputPlaceholder="example@mail.com"/>
    {:catch error}
    <Input bind:inputValue={inputValue.email} labelText="Login" errorMessage="123" inputType="text" inputName="login" inputId="user-login" inputPlaceholder="example@mail.com"/>
    {/await}
    -->

    <Input bind:inputValue={inputValue.email} labelText="Login" errorMessage="" inputType="text" inputName="login" inputId="user-login" inputPlaceholder="example@mail.com"/>

    <Input bind:inputValue={inputValue.password} labelText="Password" inputType="password" inputName="password" inputId="user-password" inputPlaceholder="******"/>
    
    <!-- Button login Registration -->
    <div class="fco-login__button-wrapper">
      <button type="button" class="fco-btn fco-btn--orange fco-btn--align-center fco-btn--width" on:click={()=> loginToGame()}>Login</button>
      <button class="fco-btn fco-btn--orange fco-btn--align-center fco-btn--width">Registration</button>
    </div>
  </form>

  <div class="fco-login__horizontal-line-wrapper">
    <div class="fco-login__horizontal-line"></div>
      or connect with 
    <div class="fco-login__horizontal-line"></div>
  </div>
  <button class="fco-btn fco-btn--align-center fco-btn--login fco-btn--width">g+ Google</button>

</div>
