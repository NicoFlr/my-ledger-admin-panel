import httpService from './httpservice';

const BASE_CATEGORIES_URL = '/categories';

export async function getAllCategories() {
  return httpService.get(`${BASE_CATEGORIES_URL}`);
}

export async function createNewCategory(newCategory) {
  return httpService.post(`${BASE_CATEGORIES_URL}`, newCategory);
}

export async function editCategory(editedCategory, categoryId) {
  return httpService.put(`${BASE_CATEGORIES_URL}/${categoryId}`, editedCategory);
}

export async function deleteCategory(categoryId) {
  return httpService.delete(`${BASE_CATEGORIES_URL}/${categoryId}`);
}