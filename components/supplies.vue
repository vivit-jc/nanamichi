<template>
  <div>
    <h2>あげたい</h2>
	<ul class="list-group">
	  <!-- リスト形式データの表示 -->
	  <li class="list-group-item" v-for="supply in supplies" v-bind:key="supply.id">
	    <div class="row">
  	      <div class="col-sm-10">
    	    {{supply.name}}<span v-if="supply.variation">({{supply.variation}})</span>
	      </div>
	      <div class="col-sm-2"> 	
            <img src="/delete.png" class="img-fluid" alt="delete" v-on:click="remove(supply)"/>
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
  name: 'supplies',
  props: ['supplies','display'],
  methods: {
  	remove: function(supply){
      db.collection('supplies').doc(supply.id).delete()
  	}
  }
}
</script>