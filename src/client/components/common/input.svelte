<script>

  export let inputId;
  export let inputName = "";
  export let inputPlaceholder = "";
  export let inputValue;
  export let labelText;
  export let errorMessage = "";  

	export let inputType = "text";
	function typeAction(node) {
		node.type = inputType;
	}
  
</script>

<div class="fco__input-wrapper">
  <label class="fco-label" for={inputId}>{labelText}</label>
  <br>
  <input class="fco__input-item" use:typeAction bind:value={inputValue} id={inputId} name={inputName} placeholder={inputPlaceholder}>
  <br>
  <label class="fco-label fco-label--error-message" for={inputId}>{errorMessage}</label>
</div>