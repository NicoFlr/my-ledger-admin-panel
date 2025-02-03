import httpService from './httpservice';

const BASE_ROLES_URL = '/roles';

export async function getAllRoles() {
  return httpService.get(`${BASE_ROLES_URL}`);
}

export async function createNewRole(newRole) {
  return httpService.post(`${BASE_ROLES_URL}`, newRole);
}

export async function editRole(editedRole, roleId) {
  return httpService.put(`${BASE_ROLES_URL}/${roleId}`, editedRole);
}