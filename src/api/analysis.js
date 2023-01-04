import request from '@/utils/request'

export function getListCustomerRenting(params) {
  return request({
    url: '/analysis/customer-renting',
    method: 'get',
    params: params
  })
}

export function getListComicRenting(params) {
  return request({
    url: '/analysis/comic-detail-renting',
    method: 'get',
    params: params
  })
}

export function getTopComic(params) {
  return request({
    url: '/analysis/top-comic',
    method: 'get'
  })
}

