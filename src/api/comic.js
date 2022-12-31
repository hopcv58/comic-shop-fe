import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/comics',
    method: 'get',
    params: params
  })
}
export function getById(id) {
  return request({
    url: `/comics/${id}`,
    method: 'get'
  })
}

export function handleCreate(data) {
  return request({
    url: '/comics',
    method: 'post',
    data
  })
}

export function handleUpdate(id, data) {
  return request({
    url: `/comics/${id}`,
    method: 'post',
    data
  })
}

export function handleDelete(id) {
  return request({
    url: `/comics/${id}`,
    method: 'delete'
  })
}
