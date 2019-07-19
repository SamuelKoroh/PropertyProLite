const signOut = document.querySelector('#signOut');

signOut.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
});
