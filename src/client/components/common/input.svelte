<script lang="ts">

  export let inputType = "text";
  export let inputId;
  export let inputName;
  export let inputPlaceholder;
  export let labelText;
  
</script>

<div class="fco__input-wrapper">
  <label class="fco-label" for={inputId}>{labelText}</label>
  <br>
  <input class="fco__input-item" type={inputType} id={inputId} name={inputName} placeholder={inputPlaceholder}>
</div>