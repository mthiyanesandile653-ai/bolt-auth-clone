const form = document.querySelector('#authForm');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const nameInput = document.querySelector('#name');
const nameField = document.querySelector('#nameField');
const submitBtn = document.querySelector('#submitBtn');
const switchBtn = document.querySelector('#switchBtn');
const forgotBtn = document.querySelector('#forgotBtn');
const dialog = document.querySelector('#noticeDialog');
let signUpMode = false;

function showDialog(title, text, icon = '✓') {
  document.querySelector('#dialogTitle').textContent = title;
  document.querySelector('#dialogText').textContent = text;
  document.querySelector('#dialogIcon').textContent = icon;
  dialog.showModal();
}

function setError(input, message) {
  input.classList.toggle('invalid', Boolean(message));
  const error = document.querySelector(`#${input.id}Error`);
  if (error) error.textContent = message;
}

function validate() {
  let valid = true;
  setError(email, '');
  setError(password, '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setError(email, 'Enter a valid email address'); valid = false;
  }
  if (password.value.length < 8) {
    setError(password, 'Password must be at least 8 characters'); valid = false;
  }
  if (signUpMode && nameInput.value.trim().length < 2) {
    showDialog('Name required', 'Please enter your full name.', '!'); return false;
  }
  return valid;
}

switchBtn.addEventListener('click', () => {
  signUpMode = !signUpMode;
  nameField.hidden = !signUpMode;
  document.querySelector('#formTitle').textContent = signUpMode ? 'Create an account' : 'Welcome back';
  document.querySelector('#formSubtitle').textContent = signUpMode ? 'Start building with Bolt' : 'Sign in to continue to Bolt';
  submitBtn.textContent = signUpMode ? 'Create account' : 'Sign in';
  document.querySelector('#switchText').textContent = signUpMode ? 'Already have an account?' : 'Don’t have an account?';
  switchBtn.textContent = signUpMode ? 'Sign in' : 'Sign up';
  password.autocomplete = signUpMode ? 'new-password' : 'current-password';
});

form.addEventListener('submit', event => {
  event.preventEvent?.();
  event.preventDefault();
  if (!validate()) return;
  submitBtn.disabled = true;
  submitBtn.textContent = signUpMode ? 'Creating account…' : 'Signing in…';
  setTimeout(() => {
    const users = JSON.parse(localStorage.getItem('bolt-users') || '{}');
    const key = email.value.trim().toLowerCase();
    if (signUpMode) {
      if (users[key]) {
        submitBtn.disabled = false; submitBtn.textContent = 'Create account';
        showDialog('Account exists', 'An account with this email already exists.', '!'); return;
      }
      users[key] = { name: nameInput.value.trim(), password: password.value };
      localStorage.setItem('bolt-users', JSON.stringify(users));
      localStorage.setItem('bolt-session', JSON.stringify({ name: nameInput.value.trim(), email: key }));
      showDialog('Account created', 'Your account is ready. Welcome to Bolt!');
    } else {
      const user = users[key];
      if (!user || user.password !== password.value) {
        submitBtn.disabled = false; submitBtn.textContent = 'Sign in';
        showDialog('Unable to sign in', 'The email or password is incorrect.', '!'); return;
      }
      localStorage.setItem('bolt-session', JSON.stringify({ name: user.name, email: key }));
      showDialog('Signed in', `Welcome back, ${user.name}.`);
    }
    submitBtn.disabled = false;
    submitBtn.textContent = signUpMode ? 'Create account' : 'Sign in';
  }, 700);
});

forgotBtn.addEventListener('click', () => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    email.focus(); setError(email, 'Enter your email first'); return;
  }
  showDialog('Reset link ready', `A password reset request was created for ${email.value.trim()} in this demo.`);
});

['google', 'github'].forEach(provider => {
  document.querySelector(`#${provider}Btn`).addEventListener('click', () => {
    showDialog(`${provider[0].toUpperCase() + provider.slice(1)} sign-in`, `Add your ${provider} OAuth client credentials to enable live ${provider[0].toUpperCase() + provider.slice(1)} authentication.`, '↗');
  });
});

document.querySelector('#themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('bolt-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});
if (localStorage.getItem('bolt-theme') === 'dark') document.body.classList.add('dark');
