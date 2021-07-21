import {URL, HEADERS, DEFAULT_PROJECT} from '../constants';
import {getLastUpdate, getUpdatedProject} from '../lib';

export const deleteProjectAsync = async id => {
  try {
    const response = await fetch(`${URL}/projects/${id}`, {
      method: 'DELETE',
      headers: HEADERS,
    });
    return response.status;
  } catch (e) {
    alert('Failed to connect JSON Server.');
    throw e;
  }
};

export const updateProjectAsync = async ({diff, current}) => {
  const updatedProject = getUpdatedProject(diff, current);
  try {
    const response = await fetch(`${URL}/projects/${updatedProject.id}`, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(updatedProject),
    });
    return await response.json();
  } catch (e) {
    alert('Failed to connect JSON Server.');
    throw e;
  }
};

export const fetchAllProjectsAsync = async () => {
  try {
    const response = await fetch(`${URL}/projects`);
    const data = await response.json();
    return data;
  } catch (e) {
    alert('Failed to connect JSON Server.');
    throw e;
  }
};

export const createProjectAsync = async (id, startDate, title) => {
  const lastUpdate = getLastUpdate();
  const body = JSON.stringify({
    ...DEFAULT_PROJECT,
    id,
    startDate,
    title,
    lastUpdate,
  });

  try {
    const response = await fetch(`${URL}/projects`, {
      method: 'POST',
      headers: HEADERS,
      body,
    });
    const data = await response.json();
    return data;
  } catch (e) {
    alert('Failed to connect JSON Server.');
    throw e;
  }
};
