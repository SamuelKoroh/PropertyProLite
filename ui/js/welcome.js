const mainContainer = document.querySelector('#mainContainer');
const titleSpan = document.querySelector('#titleSpan');
const welcomeUser = document.querySelector('#welcomeUser');
welcomeUser.innerHTML = `<i class="fas fa-user" ></i> Welcome ${localStorage.getItem('userName')}`;
