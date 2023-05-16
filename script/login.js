const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const loginName = document.querySelector('#name').value;

  localStorage.setItem('name', loginName);

  window.location.href = './chatapp.html';
});
//-------------------
// FORM FIELD
//-------------------
function InvalidMsg(textbox) {
  if (textbox.value === '') {
    textbox.setCustomValidity(
      'YOU SHALL NOT PASS, without entering a name first!'
    );
  } else {
    textbox.setCustomValidity('');
  }

  return true;
}
