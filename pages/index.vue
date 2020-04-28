<template>
  <div class="container">
    <div>
      <h1 class="title">
        ナナメのみちしるべ(α)
      </h1>
      <h2 class="subtitle">
        あつまれ　どうぶつの森　アイテム交換支援ツール
      </h2>
      <b-alert :show="dismissCountDown"
             dismissible
             variant="info"
             @dismissed="dismissCountDown=0"
             @dismiss-count-down="countDownChanged">{{infoMessage}}
      </b-alert>
      <div class="links">
        <div>
          このアプリのTwitterハッシュタグ <a href="https://twitter.com/search?q=%23%E3%83%8A%E3%83%8A%E3%81%BF%E3%81%A1&src=typed_query" target="_blank">#ナナみち</a>
        </div>
        <Home v-if="!isLogin"></Home>
        <Mypage v-if="isLogin" :user="userData"></Mypage>
      </div>
      <div v-if="isLogin">
        <form ref="form" class="m-1">
          <div class="form-group row">
            <label class="col-form-label col-12 col-lg-3" for="name">アイテム名</label>
            <div class="col-12 col-lg-9">
              <input class="form-control" v-model="name" id="name">
            </div>
          </div>
          <div class="form-group row">
            <label class="col-form-label col-12 col-lg-3" for="variation">バリエーション(任意)</label>
            <div class="col-12 col-lg-9">
              <input class="form-control" v-model="variation" id="variation">
            </div>
          </div>
          <input class="btn btn-primary" type="button" v-on:click="addDemand" value="がほしい">
          <input class="btn btn-primary" type="button" v-on:click="addSupply" value="をあげたい">
        </form>
      </div>
      <div v-if="isLogin" class="m-2">
        <input class="btn btn-primary" type="button" v-on:click="makeImage" value="リストをTwitterに投稿">
      </div>
      <b-container fluid v-if="isLogin" id="image-node" class="bg-light">
        <b-row>
          <b-col sm="6"><Demands v-if="isLogin" :demands="demands"></Demands></b-col>
          <b-col sm="6"><Supplies v-if="isLogin" :supplies="supplies"></Supplies></b-col>
        </b-row>
      </b-container>
      <div class="m-2">
        <div>作った人：<a href="https://twitter.com/vivit_jc" target="_blank">@vivit_jc</a></div>
        <div>これからやること</div>
        <ul>
          <li>レスポンシブ対応（スマホ対応）</li>
          <li>Twitterへの画像投稿</li>
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
import 'firebase/storage';
import { mapGetters} from 'vuex';

import Home from '~/components/home.vue';
import Mypage from '~/components/mypage.vue';
import Demands from '~/components/demands.vue';
import Supplies from '~/components/supplies.vue';

import domtoimage from 'dom-to-image';

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
    Home, Mypage, Demands, Supplies
  },
  asyncData(context){
    return { hello: 'Hello, World！！', isLogin:false, userData:null}
  },
  fetch(){
    
  },
  mounted: function() {
    firebase.auth().onAuthStateChanged(user => {
      // console.log(user);
      if (user) {
        this.isLogin = true;
        this.userData = user;
        this.$store.dispatch('setDemandsRef',
          db.collection('demands').orderBy('timestamp','desc').where('uid','==',user.uid)
        );
        this.$store.dispatch('setSuppliesRef',
          db.collection('supplies').orderBy('timestamp','desc').where('uid','==',user.uid)
        );
      } else {
        this.isLogin = false;
        this.userData = null;
      };
    });
  },
  computed: {
      count () { return this.$store.state.counter.count },
      ...mapGetters(['posts','supplies','demands'])
  },
  created: function () {
       // firestoreのpostsをバインド
      this.$store.dispatch('setPostsRef', db.collection('posts'));
  },
  methods: {
    addCount (e) {
      this.$store.commit('counter/add')
    },

    twitterLogin: function() {
      firebase.auth().signInWithRedirect(new firebase.auth.TwitterAuthProvider());
    },
    
    addSupply: function(){
      if (this.name == "" || this.name.length > 30) {
          return false;
      }
      var user = firebase.auth().currentUser;
      let dbdata = {
        name: this.name,
        variation: this.variation,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid
      };
      db.collection('supplies').add(dbdata);
      this.name = ""
      this.variation = ""
    },

    addDemand: function(){
      if (this.name == "" || this.name.length > 30) {
          return false;
      }
      var user = firebase.auth().currentUser;
      let dbdata = {
        name: this.name,
        variation: this.variation,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid
      };
      db.collection('demands').add(dbdata);
      this.name = ""
      this.variation = ""
    },
    
    async makeImage(){
      // const el = this.$refs.target.$el
      const output = await domtoimage.toPng(document.getElementById('image-node'))
      await this.upload(output)

    },

    async upload(data) {
      const sRef = firebase.storage().ref();
      const name = firebase.auth().currentUser.uid
      const fileRef = sRef.child(`${name}.png`);
      
      await fileRef.putString(data, 'data_url')
      const url = await fileRef.getDownloadURL()
      console.log(url)
      const card = db.collection('cards').doc(name)
      await card.set({
        url
      });
      const tw_url = "https://twitter.com/share?url=https://nanamichi-8cd8a.web.app/s/"
       + name
       + "&hashtags=ナナみち&text=ナナメのみちしるべ　あつ森アイテム交換支援ツール"
      window.open(tw_url, '_blank')
    },

    countDownChanged(dismissCountDown)  {
      this.dismissCountDown = dismissCountDown
    },
      
    showInfo(message) {
      this.infoMessage = message
      this.dismissCountDown = this.dismissSecs
    }
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
