<template>
<div id="mypage">
  <div>
  {{ user.displayName }}でログインしています
  <br/>
  <button @click="logout">ログアウト</button>
  </div>
</div>

</template>

<script>
import firebase from '@/plugins/firebase'
export default {
  name: 'mypage',
  props: ['user'],
  methods: {
    logout: function() {
      firebase.auth().signOut();
    }
  }
}
</script>