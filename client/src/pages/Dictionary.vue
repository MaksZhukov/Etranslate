<template>
  <fragment>
    <v-layout row justify-center>
      <v-flex sm12>
        <list-dictionary :listUserDictionary="userDictionary"></list-dictionary>
      </v-flex>
    </v-layout>
  </fragment>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ListDictionary from '../components/ListDictionary.vue';

export default {
  name: 'dictionary',
  components: { ListDictionary },
  data: () => ({
    text: '',
    translate: '',
    search: '',
  }),
  created() {
    this.getUserDictionary();
  },
  computed: {
    ...mapState('userDictionaryModule', ['userDictionary']),
  },
  methods: {
    ...mapActions('userDictionaryModule', ['getUserDictionary']),
  },

};

</script>
