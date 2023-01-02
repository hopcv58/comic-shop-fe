const getDefaultState = () => {
  let cart = localStorage.getItem('cart')
  if (cart) {
    cart = JSON.parse(cart)
  } else {
    cart = {
      items: [],
      userId: null
    }
  }
  return cart
}

const state = getDefaultState()

const mutations = {
  // Add an item to the rent
  ADD_ITEM(state, { comicId, comicDetailId }) {
    // if comicId is already in the rent, add comicDetailId to the list
    // else add a new item to the rent
    const item = state.items.find(item => item.comicId === comicId)
    if (item) {
      item.comicDetailIds.push(comicDetailId)
    } else {
      state.items.push({
        comicId,
        comicDetailIds: [comicDetailId]
      })
    }
    localStorage.setItem('cart', JSON.stringify(state))
  },
  REMOVE_ITEM(state, comicDetailId) {
    // remove the comicDetailId from the list
    // if the list is empty, remove the item from the rent
    const item = state.items.find(i => i.comicDetailIds.includes(comicDetailId))
    if (item) {
      item.comicDetailIds = item.comicDetailIds.filter(id => id !== comicDetailId)
      if (item.comicDetailIds.length === 0) {
        state.items = state.items.filter(i => i.comicId !== item.comicId)
      } else {
        state.items = state.items.map(i => i.comicId === item.comicId ? item : i)
      }
      localStorage.setItem('cart', JSON.stringify(state))
    }
  },
  REMOVE_ALL(state) {
    state.items = []
    localStorage.setItem('cart', JSON.stringify(state))
  },
  SET_CUSTOMER_ID(state, userId) {
    state.userId = userId
    localStorage.setItem('cart', JSON.stringify(state))
  }
}

const actions = {
  // Add an item to the rent
  addItem({ commit }, comicDetailData) {
    commit('ADD_ITEM', comicDetailData)
  },
  removeItem({ commit }, comicDetailId) {
    commit('REMOVE_ITEM', comicDetailId)
  },
  removeAll({ commit }) {
    commit('REMOVE_ALL')
  },
  setCustomerId({ commit }, userId) {
    commit('SET_CUSTOMER_ID', userId)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

