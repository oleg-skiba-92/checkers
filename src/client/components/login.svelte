<script lang="ts">
</script>

<!--------------------------------HTML CODE-------------------------------->

<div class="fco-login">
  <h2 class="fco-login__title">Login</h2>
    <form class="fco-login-form" action="https://echo.htmlacademy.ru" method="POST">
      <p>
        <label class="fco-login-label" for="fco-user-login">Email</label>
        <input class="fco-login-email" type="text" id="user-login" name="login" placeholder="mail@example.com">
      </p>
      <p>
        <label class="fco-login-label" for="fco-user-password">Password</label>
        <input class="fco-login-password" type="password" id="user-password" name="password" placeholder="******">
      </p>

      <!-- Button play -->
      <div class="fco-login-button-wrapper">
        <button class="fco-btn fco-btn--orange fco-btn--align-center">Login</button>
        <button class="fco-btn fco-btn--green fco-btn--align-center">Registration</button>
      </div>

      <p> --- or connect with ---</p>
      <button class="fco-btn fco-btn--align-center">g+ Google</button>
    </form>
</div>
