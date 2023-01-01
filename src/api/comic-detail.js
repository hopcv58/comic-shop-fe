import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/comic-details',
    method: 'get',
    params: params
  })
}

export function handleCreate(data) {
  return request({
    url: '/comic-details',
    method: 'post',
    data
  })
}

export function handleUpdate(id, data) {
  return request({
    url: `/comic-details/${id}`,
    method: 'post',
    data
  })
}
