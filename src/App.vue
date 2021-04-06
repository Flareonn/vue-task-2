<template>
  <div class="app">
    <b-container class="packages-result">
      <b-form @submit.prevent="onSearch" class="d-flex flex-column"
        ><b-form-group
          id="input-group-1"
          label="Enter your search request:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model.trim="searchModel.value"
            type="search"
            placeholder="search all of jsdelivr"
          ></b-form-input>
        </b-form-group>
        <b-button
          type="submit"
          :disabled="!searchValid || getLoading"
          variant="primary"
          >Submit</b-button
        >
      </b-form>
      <template v-if="searchModel.result">
        <b-card-group columns class="mt-5">
          <b-card
            :title="pkg.package.name"
            v-for="(pkg, idx) of searchModel.result.slice(
              startSlicePag,
              paginator.perPage * paginator.currentPage
            )"
            :key="idx"
            @click.stop="
              $bvModal.show('bv-modal-example');
              currentPackage = pkg.package;
            "
          >
            <b-card-text>{{ pkg.package.description }}</b-card-text>
            <b-card-text class="text-muted d-flex justify-content-between">
              <div>
                <b-link
                  target="_blank"
                  v-for="(link, linkKey) of pkg.package.links"
                  :key="linkKey"
                  :href="link"
                  class="mr-2"
                >
                  <b-icon-github v-if="link.includes('github')"></b-icon-github>
                  <b-icon-journal
                    v-else-if="link.includes('npmjs')"
                  ></b-icon-journal>
                  <b-icon-house-door-fill v-else></b-icon-house-door-fill>
                </b-link>
              </div>
              Publisher: {{ pkg.package.publisher.username }}</b-card-text
            >
            <template #footer v-if="pkg.package.keywords">
              <b-badge
                v-for="(badgeName, key) of pkg.package.keywords"
                :key="key"
                pill
                class="mr-2"
                >{{ badgeName }}</b-badge
              >
            </template>
          </b-card>
        </b-card-group>
        <b-pagination
          v-model="paginator.currentPage"
          :total-rows="searchModel.result.length"
          :per-page="paginator.perPage"
          aria-controls="my-table"
        ></b-pagination>
        <b-modal id="bv-modal-example" hide-footer>
          <template #modal-title>
            {{ currentPackage.name }} / {{ currentPackage.version }} /
            {{ currentPackage.scope }}
          </template>
          <div class="d-block">
            <p class="text-center">{{ currentPackage.description }}</p>
            <p class="text-right" v-if="currentPackage.publisher">
              Posted by
              <b-link :href="'mailto:' + currentPackage.publisher.email">{{
                currentPackage.publisher.username
              }}</b-link>
              at: <br />
              {{ new Date(currentPackage.date) }}
            </p>
            <p class="class-text-center" v-if="currentPackage.maintainers">
              Maintainers:
              <b-badge
                pill
                variant="primary"
                v-for="user in currentPackage.maintainers"
                class="mr-2"
                :key="user.name"
                :href="'mailto:' + user.email"
                >{{ user.username }}</b-badge
              >
            </p>
            <div class="d-flex justify-content-between">
              <div>
                <b-badge
                  v-for="(badgeName, key) of currentPackage.keywords"
                  :key="key"
                  pill
                  class="mr-2"
                  >{{ badgeName }}</b-badge
                >
              </div>
              <div>
                <b-link
                  target="_blank"
                  v-for="(link, linkKey) of currentPackage.links"
                  :key="linkKey"
                  :href="link"
                  class="mr-2"
                >
                  <b-icon-github v-if="link.includes('github')"></b-icon-github>
                  <b-icon-journal
                    v-else-if="link.includes('npmjs')"
                  ></b-icon-journal>
                  <b-icon-house-door-fill v-else></b-icon-house-door-fill>
                </b-link>
              </div>
            </div>
          </div>
          <b-button
            class="mt-3"
            block
            @click="$bvModal.hide('bv-modal-example')"
            >Close Me</b-button
          >
        </b-modal>
      </template>
    </b-container>
    <footer class="bg-secondary">
      <b-container class="d-flex flex-column text-white">
        <span>Author: Flareonn</span>
        <span>Брюханов Павел Владимирович</span>
        <b-link href="https://github.com/Flareonn">Github</b-link>
      </b-container>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      searchModel: {
        value: "",
        result: null,
      },
      paginator: {
        perPage: 10,
        currentPage: 1,
      },
      currentPackage: {},
    };
  },
  computed: {
    searchValid() {
      return this.searchModel.value.length > 1;
    },
    startSlicePag() {
      return this.paginator.currentPage === 1
        ? 0
        : this.paginator.perPage * (this.paginator.currentPage - 1);
    },
    getLoading() {
      return this.$store.getters.getLoading;
    },
  },
  methods: {
    onSearch() {
      if (!this.searchValid) return;
      this.$store.commit("setLoading", true);
      fetch(
        "http://registry.npmjs.org/-/v1/search?text=" +
          this.searchModel.value +
          "&size=250",
        { cache: "no-cache" }
      )
        .then((i) => i.json())
        .then((r) => (this.searchModel.result = r.objects))
        .finally(() => this.$store.commit("setLoading", false));
    },
  },
};
</script>

<style lang="sass">
.app
  min-height: 100vh
  display: flex
  flex-direction: column
  justify-content: space-between
.card
  cursor: pointer
</style>
