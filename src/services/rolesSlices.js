import httpService from './httpservice';

const BASE_USERS_URL = '/roles';

export async function getAllRoles() {
  return httpService.get(`${BASE_USERS_URL}`);
}