<script lang="ts">
  import Input from './common/input.svelte';

</script>

<!--------------------------------HTML CODE-------------------------------->

<div class="fco-login">
  
  <h2 class="fco-login__title">Login</h2>
  <form class="fco-login-form" action="https://echo.htmlacademy.ru" method="POST">
    <Input labelText="Login" inputType="email" inputName="login" inputId="user-login" inputPlaceholder="example@mail.com"/>
  
    <Input labelText="Password" inputType="password"  inputName="password" inputId="user-password" inputPlaceholder="******"/>
    
    <!-- Button login Registration -->
    <div class="fco-login__button-wrapper">
      <button class="fco-btn fco-btn--orange fco-btn--align-center fco-btn--width">Login</button>
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
