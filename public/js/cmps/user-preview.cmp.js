'use strict';

export default {
  props: ['user'],
  template: `<article className="bug-preview">
                <span>👤</span>
                <h4>{{user.fullName}}</h4>
                <p>Username: {{user.username}}</p>
                <p>isAdmin: {{user.isAdmin}}</p>
                <button @click="onRemove(user._id)">X</button>
              </article>`,
  methods: {
    onRemove(userId) {
      this.$emit('removeUser', userId);
    },
  },
};
