import axios from 'axios';

export function setAuthorizationToken(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `token ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

export function setAnnToken(token) {
  if (token) {
    axios.defaults.headers.common['Ann-Token'] = token;
  } else {
    delete axios.defaults.headers.common['Ann-Token'];
  }
}
