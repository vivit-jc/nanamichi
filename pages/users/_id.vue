<template>
  <div class="container">
    <div>
      <h1 class="title">
        ナナメのみちしるべ(α)
      </h1>
      <h2 class="subtitle">
        あつまれ　どうぶつの森　アイテム交換支援ツール
      </h2>
      <div>
        <nuxt-link to="/">ホームに戻る</nuxt-link>
      </div>
      <b-container fluid id="image-node" class="bg-light">
        <b-row>
          <b-col sm="6"><Demands :demands="demands"></Demands></b-col>
          <b-col sm="6"><Supplies :supplies="supplies"></Supplies></b-col>
        </b-row>
      </b-container>
      <div class="m-2">
        <div>ツール制作：<a href="https://twitter.com/vivit_jc" target="_blank">@vivit_jc</a></div>
        <div>これから作る・作りかけ</div>
        <ul>
          <li>レスポンシブ対応（スマホ対応）</li>
          <li>誰からもらった・誰にあげたかを記録する機能</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios';
import firebase from "~/plugins/firebase.js";
import 'firebase/firestore';
import { mapGetters} from 'vuex';

import Demands from '~/components/demands.vue';
import Supplies from '~/components/supplies.vue';

const db = firebase.firestore();

export default {
  data() {
      return {
          name: "",
          variation: "",
          dismissCountDown: 0,
          dismissSecs: 3,
          infoMessage: "", 
          uuid: '1',
      }
  },
  components: {
    Demands, Supplies
  },
  mounted: function() {
    const uid = this.$route.params.id
    this.$store.dispatch('setDemandsRef',
      db.collection('demands').orderBy('timestamp','desc').where('uid','==',uid)
    );
    this.$store.dispatch('setSuppliesRef',
      db.collection('supplies').orderBy('timestamp','desc').where('uid','==',uid)
    );
  },
  computed: {
      ...mapGetters(['supplies','demands'])
  },
  created: function () {
  },
  methods: {

  }
}

</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  //font-weight: 300;
  //font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  //font-weight: 300;
  //font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.ul{
  
}

</style>
