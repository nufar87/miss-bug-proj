import { router } from './router/index.js';
import { eventBus } from './services/eventBus-service.js';
import appHeader from './cmps/app-header.cmp.js';
import userMsg from './cmps/user-msg.cmp.js';

const options = {
  template: `
    <app-header />
    <user-msg />
    <router-view />
    `,
  router,
  components: {
    appHeader,
    userMsg,
  },
};

const app = Vue.createApp(options);
app.use(router);
app.use(eventBus);
app.mount('#app');
