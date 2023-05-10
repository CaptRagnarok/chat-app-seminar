const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const loginName = document.querySelector('#name').value;

  localStorage.setItem('name', loginName);

  window.location.href = './index.html';
});
