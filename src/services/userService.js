import httpService from './httpservice';
import axios from 'axios';
import { API_BASE_URL } from '../config/environment';
const BASE_USERS_URL = '/users';

export async function login(headers = {}) {
  return axios.post(`${API_BASE_URL}${BASE_USERS_URL}/login`, {}, {headers});
}

export async function getAllUsers() {
  return httpService.get(`${BASE_USERS_URL}`);
}

export async function createNewUser(newUser) {
  return httpService.post(`${BASE_USERS_URL}`, newUser);
}

export async function editUser(editedUser, userId) {
  return httpService.put(`${BASE_USERS_URL}/${userId}`, editedUser);
}

export async function editPassword(editedUserPassword, userId) {
  return httpService.put(`${BASE_USERS_URL}/${userId}/password`, editedUserPassword);
}

export async function deleteUser(userId) {
  return httpService.delete(`${BASE_USERS_URL}/${userId}`);
}
