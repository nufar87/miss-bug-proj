export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
  getUserBugs,
};

const BASE_URL = `/api/bug/`;

// function query() {
//   return axios.get('/api/bug').then((res) => res.data);
// }

function query(filterBy) {
  // console.log('filterBy:', filterBy);
  return axios.get(BASE_URL, { params: filterBy }).then((res) => res.data);
}

function getUserBugs(userId) {
  return axios.get('/api/userbug/' + userId).then((res) => res.data);
}

function getById(bugId) {
  return axios.get(BASE_URL + bugId).then((res) => res.data);
}

function getEmptyBug() {
  return {
    title: '',
    description: '',
    severity: '',
    createdAt: Date.now(),
  };
}

function remove(bugId) {
  return axios.delete(BASE_URL + bugId).then((res) => res.data);
  // return axios.delete(BASE_URL + bugId + '/remove').then((res) => res.data);
}

function save(bug) {
  if (bug._id) {
    return axios.put(BASE_URL + bug._id, bug).then((res) => res.data);
  } else {
    return axios.post(BASE_URL, bug).then((res) => res.data);
  }
}
