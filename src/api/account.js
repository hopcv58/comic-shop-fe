import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/users',
    method: 'get',
    params: params
  })
}
export function handleCreate(data) {
  return request({
    url: '/auth/signup',
    method: 'post',
    data
  })
}

export function getById(id) {
  return request({
    url: '/users/' + id,
    method: 'get'
  })
}

export function handleUpdate(id, data) {
  return request({
    url: `/users/${id}`,
    method: 'post',
    data
  })
}

export function handleDelete(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}
