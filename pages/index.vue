<template>
  <div class="container">
    <div>
      <h1 class="title">
        ナナメのみちしるべ
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
        <Home v-if="!isLogin"></Home>
        <Mypage v-if="isLogin" :user="userData"></Mypage>
      </div>
      <div>
        <form ref="form">
          <div class="form-group row">
            <label class="col-form-label col-sm-3" for="name">アイテム名</label>
            <div class="col-sm-9">
              <input class="form-control" v-model="name" id="name">
            </div>
          </div>
          <div class="form-group row">
            <label class="col-form-label col-sm-3" for="variation">バリエーション(任意)</label>
            <div class="col-sm-9">
              <input class="form-control" v-model="variation" id="variation">
            </div>
          </div>
          <input class="btn btn-primary" type="button" v-on:click="addDemand" value="がほしい">
          <input class="btn btn-primary" type="button" v-on:click="addSupply" value="をあげたい">
        </form>
      </div>
      <div>
        <input class="btn btn-primary" type="button" v-on:click="makeImage" value="リストをTwitterに投稿(今作ってます、今は代わりに画像がダウンロードできるよ)">
      </div>
      <b-container fluid id="image-node">
        <b-row>
          <b-col><Demands v-if="isLogin" :demands="demands"></Demands></b-col>
          <b-col><Supplies v-if="isLogin" :supplies="supplies"></Supplies></b-col>
        </b-row>
      </b-container>
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
        variationaa: this.variation,
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

/*
    async upload(data) {
      const db = firebase.firestore();
      const sRef = firebase.storage().ref();
      const name = firebase.auth().currentUser.uid;
      const fileRef = sRef.child(`${name}.png`);
      fileRef.putString(data, "data_url")
        .then(function (dataUrl) {
         console.log("download")
          var link = document.createElement('a');
          link.download = 'list.png';
          link.href = dataUrl;
          link.click();
        });
      this.showInfo("Twitterに投稿しました！")
    },
*/
    async upload(dataUrl) {
        var link = document.createElement('a');
        link.download = 'list.png';
        link.href = dataUrl;
        link.click();
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
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
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
