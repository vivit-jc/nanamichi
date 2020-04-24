<template>
  <div>
    <h2>ほしい</h2>
	<ul class="list-group">
	  <!-- リスト形式データの表示 -->
	  <li class="list-group-item" v-for="demand in demands" v-bind:key="demand.id">
	    <div class="row">
	      <div class="col-sm-10">
	        {{demand.name}}<span v-if="demand.variation">({{demand.variation}})</span>
	      </div>
	      <div class="col-sm-2"> 	
            <img src="/delete.png" class="img-fluid" alt="delete" v-on:click="remove(demand)"/>
	      </div>
	    </div>
	  </li>
	</ul>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'
const db = firebase.firestore();
export default {
  name: 'demands',
  props: ['demands','display'],
  methods: {
  	remove: function(demand){
      db.collection('demands').doc(demand.id).delete()
  	},
  }
}
</script>