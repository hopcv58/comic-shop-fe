<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="comics"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column align="center" label="ID" width="135">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Tên đầu sách">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Mã truyện">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="Giá cọc">
        <template slot-scope="scope">
          {{ numberFormat(scope.row.price) }}
        </template>
      </el-table-column>
    </el-table>
    <h2>Thông tin khách hàng</h2>
    <el-form ref="form" class="form-search" :inline="true" :model="customer" label-width="120px" label-position="left">
      <el-form-item label="Tên">
        <el-input v-model="customer.name" disabled />
      </el-form-item>
      <el-form-item label="Số điện thoại" disabled>
        <el-input ref="phoneNumber" v-model="customer.phoneNumber" disabled />
      </el-form-item>
      <el-form-item label="Giới tính">
        <el-select v-model="customer.gender" disabled>
          <el-option label="Nam" value="Nam" />
          <el-option label="Nữ" value="Nữ" />
        </el-select>
      </el-form-item>
      <el-form-item label="Số ngày thuê">
        <el-input ref="phoneNumber" v-model="rentDay" autofocus />
      </el-form-item>
      <el-button type="success" size="mini" @click="handleRent">Thanh toán</el-button>
    </el-form>
  </div>
</template>

<script>
import { getById as getComicById } from '@/api/comic'
import { getById as getRentById } from '@/api/rent'
import { getList as getComicDetails } from '@/api/comic-detail'
import { numberFormat } from '@/utils'
import { getCustomer } from '@/api/customer'
import { handleCreate as handleCreateReceipt } from '@/api/rent'

export default {
  data() {
    return {
      comics: [],
      customerId: null,
      listLoading: false,
      rentDay: 1,
      customer: {
        name: '',
        gender: '',
        phoneNumber: ''
      }
    }
  },
  created() {
    this.fetchRentDetail()
    // this.fetchCustomer()
  },
  methods: {
    numberFormat,
    fetchRentDetail() {
      getRentById(this.$route.params.id).then(response => {
        if (response.comicList.length) {
          for (let i = 0; i < response.comicList.length; i++) {
            let comic = null
            getComicById(response.comicList[i].comicId).then(res => {
              comic = res
              getComicDetails({
                comicId: response.comicList[i].comicId
              }).then(res => {
                for (let j = 0; j < res.length; j++) {
                  for (let k = 0; k < response.comicList[i].comicDetailList.length; k++) {
                    if (res[j].id === response.comicList[i].comicDetailList[k].comicDetailId) {
                      this.comics.push({
                        id: res[j].id,
                        name: comic.name,
                        code: res[j].comicDetailCode,
                        price: comic.price
                      })
                      break
                    }
                  }
                }
                this.listLoading = false
              })
            })
          }
        }
      })
    },
    // fetchCustomer() {
    //   getCustomer(this.customerId).then(res => {
    //     this.customer = res
    //   }).catch(err => {
    //     console.log(err)
    //     this.$router.push({ name: 'CustomerList' })
    //   })
    // },
    handleDelete(row) {
      const index = this.comics.indexOf(row)
      this.comics.splice(index, 1)
      this.$store.dispatch('cart/removeItem', row.id)
    },
    clearCart() {
      this.$store.dispatch('cart/removeAll')
      this.comics = []
    },
    getSummaries({ columns, data }) {
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Tổng tiền cọc'
          return
        }
        if (index === 3) {
          let sum = 0
          for (let i = 0; i < data.length; i++) {
            sum += data[i].price
          }
          sums[index] = numberFormat(sum)
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    handleRent() {
      const cart = JSON.parse(localStorage.getItem('cart'))
      let comicList = []
      if (cart && cart.items) {
        comicList = cart.items.map(item => {
          return {
            comicId: item.comicId,
            comicDetailList: item.comicDetailIds.map(id => {
              return {
                comicDetailId: id
              }
            })
          }
        })
      }
      console.log({
        rentDays: this.rentDay,
        deposit: this.comics.reduce((a, b) => a + b.price, 0),
        customerId: this.customerId,
        comicList
      })
      handleCreateReceipt({
        rentDays: this.rentDay,
        deposit: this.comics.reduce((a, b) => a + b.price, 0),
        customerId: this.customerId,
        comicList
      }).then(res => {
        this.$message({
          message: 'Thành công',
          type: 'success'
        })
        this.clearCart()
        this.$router.push('/order/list')
      }).catch(err => {
        console.log(err)
        this.$message({
          message: 'Thất bại',
          type: 'error'
        })
      })
    }
  }
}
</script>
