export default {
  template: `
        <section class="bug-filter">
            <span>Filter by title: </span>
            <input @input="setFilterBy" type="text" v-model="filterBy.title">
            <span>Filter by severity: </span>
            <select @change="setFilterBySeverity" name="text" id="" v-model="filterBy.severity">
              <option value="">all</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
        </section>
    `,
  data() {
    return {
      filterBy: {
        title: '',
        severity: '',
      },
    };
  },
  methods: {
    setFilterBy() {
      this.$emit('setFilterBy', this.filterBy);
    },
    setFilterBySeverity() {
      this.$emit('setFilterBySeverity', this.filterBy);
    },
  },
};
