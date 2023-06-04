import { bugService } from '../services/bug-service.js';
import { userService } from '../services/user-service.js';

import bugList from '../cmps/bug-list.cmp.js';
import bugFilter from '../cmps/bug-filter.cmp.js';

export default {
  template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy" @setFilterBySeverity="setFilterBySeverity"></bug-filter> ||
          <p>Total Pages: {{totalPages}} </p>||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
        <div className="pagination">
          <button @click="setPage(-1)">Prev</button>
          <button @click="setPage(1)">Next</button>
          <p>Total Pages {{totalPages}}</p>
        </div>
    </section>
    `,
  data() {
    return {
      bugs: null,
      filterBy: {
        title: '',
        severity: '',
        page: 0,
      },
      totalPages: 0,
      loggedInUser: userService.getLoggedInUser(),
      user: null,
    };
  },
  created() {
    this.loadBugs();
    if (!this.loggedInUser) this.$router.push('/auth/login');
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy).then(({ totalPages, filteredBugs }) => {
        this.totalPages = totalPages;
        this.bugs = filteredBugs;
      });
    },
    setFilterBy(filterBy) {
      this.filterBy.title = filterBy.title;
      this.loadBugs();
    },
    setFilterBySeverity(filterBy) {
      this.filterBy.severity = +filterBy.severity;
      this.loadBugs();
    },
    removeBug(bugId) {
      bugService.remove(bugId).then(() => this.loadBugs());
    },
    setPage(dir) {
      this.filterBy.page += +dir;
      if (this.filterBy.page > this.totalPages - 1) this.filterBy.page = 0;
      if (this.filterBy.page < 0) this.filterBy.page = this.totalPages - 1;
      this.loadBugs();
    },
  },
  components: {
    bugList,
    bugFilter,
  },
};
