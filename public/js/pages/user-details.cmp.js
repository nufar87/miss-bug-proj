import { userService } from '../services/user-service.js';
import { bugService } from '../services/bug-service.js';

import bugList from '../cmps/bug-list.cmp.js';
import userList from '../cmps/user-list.cmp.js';

export default {
  name: 'user-details',
  template: `
        <section class="user-details">
        <div v-if="user.isAdmin">
                <img src="https://play-lh.googleusercontent.com/BMryS7Cn454jIAVrchF9as-7WOG07H97Lugr62ISdJSo7wj1cC-0MTUm3SqSZffc7IQ=w240-h480-rw" alt="Profile image" />
                <h1> <i class="far fa-user"></i> Name : {{ user.fullname }} </h1>
                <p> <i class="fas fa-bug"></i> Bugs uploaded: {{ userBugCount }} </p>
                <bug-list v-if="userBugs" :bugs="userBugs" @removeBug="removeBug"></bug-list>
                <p> <i class="fas fa-bug"></i> App users: {{ userCount }} </p>
                <router-link v-if="user.isAdmin" to="/admin/users">View Users</router-link>
                <button @click="back"> Back </button>
            </div>
            <div v-else>
                <img src="https://play-lh.googleusercontent.com/i1qvljmS0nE43vtDhNKeGYtNlujcFxq72WAsyD2htUHOac57Z9Oiew0FrpGKlEehOvo=w240-h480-rw" alt="Profile image" />
                <h1> <i class="far fa-user"></i> Name : {{ user.fullname }} </h1>
                <p> <i class="fas fa-bug"></i> Bugs uploaded: {{ userBugCount }} </p>
                <bug-list v-if="userBugs" :bugs="userBugs" @removeBug="removeBug"></bug-list>
                <router-link to="/bug">Back</router-link>
            </div>
        </section>
    `,
  data() {
    return {
      user: null,
      userBugCount: 0,
      userBugs: null,
      users: null,
      userCount: 0,
    };
  },
  computed: {},
  methods: {
    back() {
      this.$router.push('/bug');
    },
    removeUser(userId) {
      userService.remove(userId).then(() => {
        this.loadUsers();
      });
    },
    removeBug(bugId) {
      bugService.remove(bugId).then(() => {
        this.loadBugs();
      });
    },
  },
  created() {
    this.user = userService.getLoggedInUser();
    bugService.getUserBugs(this.user._id).then((bugs) => {
      this.userBugs = bugs;
      var length = this.userBugs.length;
      this.userBugCount = length;
    });
  },
  components: {
    bugList,
    userList,
  },
};
