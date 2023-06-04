import userPreview from './user-preview.cmp.js';

export default {
  props: ['users'],
  template: `
    <section v-if="users.length" className="user-list">                    
      <user-preview v-for="user in users" :user="user" :key="user._id" @removeUser="$emit('removeUser', $event)" />
    </section>
    <section v-else class="user-list">Yay! No Users!</section>
    `,
  methods: {},
  components: {
    userPreview,
  },
};
