import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/customers',
    method: 'get',
    params: params
  })
}
export function getCustomer(id) {
  return request({
    url: `/customers/${id}`,
    method: 'get'
  })
}

export function createCustomer(data) {
  return request({
    url: '/customers',
    method: 'post',
    data
  })
}

export function updateCustomer(id, data) {
  return request({
    url: `/customers/${id}`,
    method: 'post',
    data
  })
}

export function deleteCustomer(id) {
  return request({
    url: `/customers/${id}`,
    method: 'delete'
  })
}
