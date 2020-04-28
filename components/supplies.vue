<template>
  <div>
    <h2>あげたい</h2>
	<ul class="list-group">
	  <!-- リスト形式データの表示 -->
	  <li class="list-group-item" v-for="(supply, index) in supplies" v-bind:key="supply.id">
	    <div class="row" @mouseover="mouseOver(index)" @mouseleave="mouseLemove">
  	      <div class="col-2">
	      </div>
  	      <div class="col-8">
    	    {{supply.name}}<span v-if="supply.variation">({{supply.variation}})</span>
	      </div>
	      <div class="col-2"> 	
            <img v-show="hoverFlag && hoverIndex === index" src="/delete.png" class="img-fluid" alt="delete" v-on:click="remove(supply)"/>
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
  data: function(){
    return {
      hoverFlag: false,
      hoverIndex: null,
    }
  },
  name: 'supplies',
  props: ['supplies','display'],
  methods: {
  	remove: function(supply){
      db.collection('supplies').doc(supply.id).delete()
  	},
    mouseOver(index){
      this.hoverFlag = true
      this.hoverIndex = index
    },
    mouseLemove(){
      this.hoverFlag = false
    }
  }
}
</script>