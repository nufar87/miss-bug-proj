const express = require('express');
const cookieParser = require('cookie-parser');

const bugService = require('./services/bug.service');
const userService = require('./services/user.service.js');

const app = express();

// Express Config:
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

// Express Routing:
app.get('/api/bug/user', (req, res) => {
  var loggedInUser = userService.validateToken(req.cookies.loginToken);

  bugService.getUserBugs(loggedInUser).then((bugs) => {
    res.send(bugs);
  });
});

//LIST
app.get('/api/bug', (req, res) => {
  const { title, severity, page } = req.query;

  const filterBy = {
    title: title || '',
    severity: +severity || '',
    page: +page || 0,
  };
  bugService
    .query(filterBy)
    .then((bugs) => {
      res.send(bugs);
    })
    .catch((err) => {
      console.log('OOPS:', err);
      res.status(400).send('Cannot load bugs');
    });
});

//READ
app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params;

  let visitedBugs = req.cookies.visitedBugs || [];
  if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit');
  if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId);
  res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 });

  bugService
    .getById(bugId)
    .then((bug) => {
      res.send(bug);
    })
    .catch((err) => {
      console.log('OOPS:', err);
      res.status(400).send('Cannot load bug');
    });
});

//ADD
app.post('/api/bug/', (req, res) => {
  const loggedInUser = userService.validateToken(req.cookies.loginToken);
  if (!loggedInUser) return res.status(401).send('Cannot update bug');

  const { title, description, severity } = req.body;
  const bug = {
    title,
    description,
    severity,
    creator: loggedInUser,
  };
  bugService
    .save(bug)
    .then((bug) => {
      res.send(bug);
    })
    .catch((err) => {
      console.log('OOPS:', err);
      res.status(400).send('Cannot save car');
    });
});

//UPDATE
app.put('/api/bug/:bugId', (req, res) => {
  const loggedInUser = userService.validateToken(req.cookies.loginToken);
  if (!loggedInUser) return res.status(401).send('Cannot update bug');

  const { _id, title, description, severity } = req.body;
  const bug = {
    _id,
    title,
    description,
    severity,
  };
  bugService
    .save(bug, loggedInUser)
    .then((savedBug) => {
      res.send(savedBug);
    })
    .catch((err) => {
      console.log('OOPS:', err);
      res.status(400).send('Cannot save bug');
    });
});

//DELETE BUG
app.delete('/api/bug/:bugId/', (req, res) => {
  // app.delete('/api/bug/:bugId/remove', (req, res) => {
  const loggedInUser = userService.validateToken(req.cookies.loginToken);
  if (!loggedInUser) return res.status(401).send('Cannot delete bug');

  const bugId = req.params.bugId;

  bugService
    .remove(bugId, loggedInUser)
    .then(() => {
      res.send('Removed bug!');
    })
    .catch((err) => {
      console.log('OOPS:', err);
      res.status(400).send('Cannot remove bug');
    });
});

// LOGIN
app.post('/api/auth/login', (req, res) => {
  userService.checkLogin(req.body).then((user) => {
    if (user) {
      const loginToken = userService.getLoginToken(user);
      res.cookie('loginToken', loginToken);
      res.send(user);
    } else {
      res.status(401).send('Invalid login');
    }
  });
});

// SIGNUP
app.post('/api/auth/signup', (req, res) => {
  userService
    .save(req.body)
    .then((user) => {
      const loginToken = userService.getLoginToken(user);
      res.cookie('loginToken', loginToken);
      res.send(user);
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
});

// LOGOUT
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('loginToken');
  res.send('logout');
});

//READ USER
app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params;
  userService
    .getById(userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log('OOPS:', err);
      res.status(400).send('Unknown Bug');
    });
});

//USER BUGS
app.get('/api/userbug/:userId', (req, res) => {
  const { userId } = req.params;
  bugService
    .queryById(userId)
    .then((userBugs) => res.send(userBugs))
    .catch((err) => {
      console.log('OOPS:', err);
      res.status(400).send('Cannot Load user bugs');
    });
});

//USERS LIST
app.get('/api/admin/users', (req, res) => {
  userService
    .queryByUsers()
    .then((users) => res.send(users))
    .catch((err) => {
      console.log('OOPS:', err);
      res.status(400).send('Cannot Load users list');
    });
});

//DELETE
app.delete('/api/admin/users/:userId/remove', (req, res) => {
  const userId = req.params.userId;
  userService
    .remove(userId)
    .then(() => {
      res.send('removed');
    })
    .catch((err) => {
      console.log('OOPS', err);
      res.status(400).send('Unknown Bug');
    });
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, '127.0.0.1');
console.log(`server running at http://127.0.0.1:${PORT}/`);
