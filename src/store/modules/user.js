import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    email: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
    localStorage.setItem('name', name)
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
    localStorage.setItem('avatar', avatar)
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
    localStorage.setItem('roles', JSON.stringify(roles))
  },
  SET_EMAIL: (state, email) => {
    state.email = email
    localStorage.setItem('email', email)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        commit('SET_TOKEN', response.accessToken)
        commit('SET_ROLES', response.roles)
        commit('SET_NAME', response.username)
        commit('SET_EMAIL', response.email)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        setToken(response.accessToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    const name = localStorage.getItem('name')
    const avatar = localStorage.getItem('avatar')
    const roles = JSON.parse(localStorage.getItem('roles'))
    const email = localStorage.getItem('email')
    commit('SET_NAME', name)
    commit('SET_AVATAR', avatar)
    commit('SET_ROLES', roles)
    commit('SET_EMAIL', email)
    return { name, avatar, roles, email }
  },

  // user logout
  logout({ commit, state }) {
    removeToken() // must remove  token  first
    resetRouter()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

