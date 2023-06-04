import { userService } from '../services/user-service.js';
import { eventBus } from '../services/eventBus-service.js';

export default {
  template: `
        <header class="app-header">           
            <nav>
                <a href="#/bug">Miss Bug</a>
              <div class="header-details" v-if="user">
                <p >Welcome  <span class="user-name" @click ="userProfile">{{user.fullname}}</span></p>   
                <button @click="logout">Logout</button>
              </div>
            </nav>
        </header>
    `,
  data() {
    return {
      user: null,
    };
  },
  methods: {
    onChangeLoginStatus() {
      this.user = userService.getLoggedInUser();
      eventBus.on('loggedUser');
    },
    logout() {
      userService.logout().then(() => {
        this.user = null;
        this.$router.push('/auth/login');
      });
    },
    userProfile() {
      this.$router.push(`/user/' + ${this.user._id}`);
    },
  },
  created() {
    eventBus.on('loggedUser', (user) => {
      this.user = user;
      console.log('user', this.user);
    });
    this.user = userService.getLoggedInUser();
    console.log('user', this.user);
  },
  computed: {
    isUserLoggedIn() {
      console.log('computed-header');
    },
  },
  // watch: {
  //   isUserLoggedIn() {
  //     console.log('user logged in');
  //     eventBus.on('loggedUser', (user) => {
  //       this.user = user;
  //       console.log('user', this.user);
  //     });
  //   },
  // },
};
