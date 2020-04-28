<template>
  <div>
    <h2>ほしい</h2>
	<ul class="list-group">
	  <!-- リスト形式データの表示 -->
	  <li class="list-group-item" v-for="(demand, index) in demands" v-bind:key="demand.id">
	    <div class="row" @mouseover="mouseOver(index)" @mouseleave="mouseLemove">
	      <div class="col-2">
	      </div>
	      <div class="col-8">
	        {{demand.name}}<span v-if="demand.variation">({{demand.variation}})</span>
	      </div>
	      <div class="col-2"> 
            <img v-show="hoverFlag && hoverIndex === index" src="/delete.png" class="img-fluid" alt="delete" v-on:click="remove(demand)"/>
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
  name: 'demands',
  props: ['demands','display'],
  methods: {
  	remove: function(demand){
      db.collection('demands').doc(demand.id).delete()
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