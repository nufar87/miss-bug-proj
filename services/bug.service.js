const fs = require('fs');
const gBugs = require('../data/bug.json');

module.exports = {
  query,
  getById,
  remove,
  save,
  queryById,
};

const itemsPerPage = 2;

function query(filterBy) {
  console.log('filterBy', filterBy);
  const { title, severity, page } = filterBy;

  var regex = new RegExp(title, 'i');
  let filteredBugs = gBugs.filter((bug) => regex.test(bug.title));
  console.log('filteredBugs', filteredBugs);
  if (severity) {
    filteredBugs = filteredBugs.filter((bug) => bug.severity === severity);
  }

  const startIdx = page * itemsPerPage;
  const totalPages = Math.ceil(filteredBugs.length / itemsPerPage);
  filteredBugs = filteredBugs.slice(startIdx, startIdx + itemsPerPage);
  return Promise.resolve({ totalPages, filteredBugs });
}

function queryById(userId) {
  return new Promise((resolve, reject) => {
    const userBugs = gBugs.filter((bug) => bug.creator._id === userId);
    if (userBugs) {
      resolve(userBugs);
    } else {
      reject('User has no bugs');
    }
  });
}

function getById(bugId) {
  const bug = gBugs.find((bug) => bug._id === bugId);
  if (!bug) return Promise.reject('Unknown bug');
  return Promise.resolve(bug);
}

function remove(bugId, loggedInUser) {
  const idx = gBugs.findIndex((bug) => bug._id === bugId);
  if (idx < 0) return Promise.reject('unknown bug');
  if (gBugs[idx].creator._id !== loggedInUser._id)
    return Promise.reject('Not your bug');
  gBugs.splice(idx, 1);
  return _saveBugsToFile();
}

function save(bug, loggedInUser) {
  if (bug._id) {
    const idx = gBugs.findIndex((currBug) => currBug._id === bug._id);
    if (gBugs[idx].creator._id !== loggedInUser._id)
      return Promise.reject('Not your bug');
    gBugs[idx] = bug;
  } else {
    bug._id = _makeId();
    gBugs.unshift(bug);
  }
  return _saveBugsToFile().then(() => bug);
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(gBugs, null, 2);

    fs.writeFile('data/bug.json', data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

//util service
function _makeId(length = 5) {
  var txt = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}
