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
    textbox.setCustomValidity('You must enter a name to proceed');
  } else {
    textbox.setCustomValidity('');
  }

  return true;
}
