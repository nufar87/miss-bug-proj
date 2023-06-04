import { userService } from '../services/user-service.js';
import { eventBus } from '../services/eventBus-service.js';

export default {
  name: 'app-login',
  template: `
        <section class="app-login">
            <form v-show="showLogin" @submit.prevent="login">
                <h3> <i class="fas fa-user"></i> Login: </h3>
                <input type="text" v-model="credentials.username" placeholder="Insert your username..."  />
                <input type="password" v-model="credentials.password" placeholder="Insert your password..."  />
                <button> Login </button>
            </form>
            <button v-show="showLogin" class="signup" @click.stop="toggleLogin"> Create new account <i class="fas fa-user-plus"></i> </button>
            <form v-show="!showLogin" @submit.prevent="signup">
                <h3> <i class="fas fa-user"></i> Sign up: </h3>
                <input type="text" v-model="signupInfo.fullname" placeholder="Your full name..."  />
                <input type="text" v-model="signupInfo.username" placeholder="Your username..."  />
                <input type="password" v-model="signupInfo.password" placeholder="Your password..."  />
                <button> Save and login </button>
                <button @click.stop.prevent="toggleLogin"> Back </button>
            </form>
        </section>
    `,
  data() {
    return {
      credentials: {
        username: '',
        password: '',
      },
      signupInfo: {
        fullname: '',
        username: '',
        password: '',
      },
      showLogin: true,
      user: '',
    };
  },
  methods: {
    toggleLogin() {
      this.showLogin = !this.showLogin;
    },
    login() {
      userService
        .login(this.credentials)
        .then((user) => {
          this.$emit('onChangeLoginStatus');
          console.log('login successfully- login cmp');
          eventBus.emit('loggedUser', 'user');
          // showUser(user);
          this.$router.push('/bug');
        })
        .catch((err) => {
          console.log('Cannot login', err);
          const msg = {
            txt: 'Something is wrong',
            type: 'error',
          };
          eventBus.emit('show-msg', msg);
        });
    },
    signup() {
      userService
        .signup(this.signupInfo)
        .then((user) => {
          this.$emit('onChangeLoginStatus');
          this.$router.push('/bug');
        })
        .catch((err) => {
          console.log('Cannot signup', err);
          const msg = {
            txt: 'Something is wrong',
            type: 'error',
          };
          eventBus.emit('show-msg', msg);
        });
    },
  },
};
