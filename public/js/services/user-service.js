import { storageService } from './async-storage-service.js';
const KEY = 'userDB';
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser';

export const userService = {
  getLoggedInUser,
  login,
  logout,
  signup,
  query,
  remove,
};

function getLoggedInUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER));
}

function login({ username, password }) {
  return axios
    .post('/api/auth/login', { username, password })
    .then((res) => res.data)
    .then((user) => {
      return setLoggedInUser(user);
    });
}

function signup({ username, password, fullname }) {
  const user = { username, password, fullname, isAdmin: false };
  return axios
    .post('/api/auth/signup', user)
    .then((res) => res.data)
    .then((user) => {
      return setLoggedInUser(user);
    })
    .catch((err) => {
      console.log('Error:', err);
    });
}

function logout() {
  return axios
    .post('/api/auth/logout')
    .then(() => {
      sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);
    })
    .catch((err) => {
      console.log('Cannot logout', err);
    });
}

function query() {
  return axios.get('/api/admin/users').then((res) => res.data);
}

function remove(userId) {
  ///api/admin/users/:userId/remove
  console.log('delete');
  return axios
    .delete('/api/admin/users/' + userId + '/remove')
    .then((res) => res.data);
}

function setLoggedInUser(user) {
  const userToSave = {
    _id: user._id,
    fullname: user.fullname,
    isAdmin: user.isAdmin,
  };
  console.log('user', user);
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave));
  return userToSave;
}
