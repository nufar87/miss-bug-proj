'use strict';

import { bugService } from '../services/bug-service.js';

export default {
  template: `
    <section v-if="bug" class="bug-details">
        <h1>{{bug.title}}</h1>
        <h4>Creator: {{bug.creator.fullname}}</h4>
        <span>Description: {{bug.description}}</span>
        <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
        <router-link to="/bug">Back</router-link>
    </section>
    `,
  data() {
    return {
      bug: null,
    };
  },
  created() {
    const { bugId } = this.$route.params;
    if (bugId) {
      bugService
        .getById(bugId)
        .then((bug) => {
          this.bug = bug;
          console.log('bug', bug);
          console.log('bug-creator', bug.creator);
        })
        .catch((err) => {
          console.log(err);
          this.$router.push('/bug');
          eventBus.emit('show-msg', { txt: err.response.data, type: 'error' });
        });
    }
  },
};
