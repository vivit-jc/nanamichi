import { vuexfireMutations, firestoreAction } from 'vuexfire';

export const state = () => ({
   posts: [],
   demands: [],
   supplies: []
});
export const mutations = {
   ...vuexfireMutations
};
export const actions = {
    setPostsRef: firestoreAction(function (context, ref) {
        context.bindFirestoreRef('posts', ref)
    }),
    setDemandsRef: firestoreAction(function (context, ref) {
        context.bindFirestoreRef('demands', ref)
    }),
    setSuppliesRef: firestoreAction(function (context, ref) {
        context.bindFirestoreRef('supplies', ref)
    }),
   
};
export const getters = {
   posts: state => state.posts,
   demands: state => state.demands,
   supplies: state => state.supplies
};