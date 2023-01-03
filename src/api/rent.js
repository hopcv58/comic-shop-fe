import request from '@/utils/request'
export function handleCreate(data) {
  return request({
    url: '/rent',
    method: 'post',
    data
  })
}

export function getListByCustomer(customerId) {
  return request({
    url: '/rent/customer/' + customerId,
    method: 'get'
  })
}

export function getList() {
  return request({
    url: '/rent',
    method: 'get'
  })
}

export function getById(id) {
  return request({
    url: '/rent/' + id,
    method: 'get'
  })
}

export function handleUpdate(id, data) {
  return request({
    url: '/rent/' + id,
    method: 'post',
    data
  })
}
