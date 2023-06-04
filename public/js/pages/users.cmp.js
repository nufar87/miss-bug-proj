'use strict';
import { eventBus } from '../services/eventBus-service.js';
import { userService } from '../services/user-service.js';
import { bugService } from '../services/bug-service.js';

import userList from '../cmps/user-list.cmp.js';

export default {
  template: `
    <section class="bug-details">
        <user-list v-if="users" :users="users" @removeUser="removeUser"/>
        <router-link to="/bug">Back</router-link>
    </section>
    `,
  data() {
    return {
      users: null,
    };
  },
  created() {
    this.loadUsers();
  },
  methods: {
    loadUsers() {
      userService.query().then((users) => {
        this.users = users;
      });
    },
    removeUser(userId) {
      bugService.getUserBugs(userId).then((bugs) => {
        if (!bugs.length) {
          userService.remove(userId).then(() => this.loadUsers());
          const msg = {
            txt: 'User removed',
            type: 'success',
          };
          eventBus.emit('show-msg', msg);
        } else {
          const msg = {
            txt: 'Unable to remove user, user has active bugs',
            type: 'error',
          };
          eventBus.emit('show-msg', msg);
        }
      });
    },
  },
  components: {
    userList,
  },
};
