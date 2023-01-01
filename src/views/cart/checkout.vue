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
      <el-table-column label="Giá gốc">
        <template slot-scope="scope">
          {{ numberFormat(scope.row.price) }}
        </template>
      </el-table-column>
    </el-table>
    <h2>Thông tin khách hàng</h2>
    <el-form ref="form" class="form-search" :inline="true" :model="customer" label-width="120px" label-position="left" disabled>
      <el-form-item label="Tên">
        <el-input v-model="customer.name" />
      </el-form-item>
      <el-form-item label="Số điện thoại" disabled>
        <el-input ref="phoneNumber" v-model="customer.phoneNumber" />
      </el-form-item>
      <el-form-item label="Giới tính" disabled>
        <el-select v-model="customer.gender" placeholder="Bấm vào để chọn">
          <el-option label="Nam" value="Nam" />
          <el-option label="Nữ" value="Nữ" />
        </el-select>
      </el-form-item>
      <el-form-item label="Số ngày thuê">
        <el-input ref="phoneNumber" v-model="rentDay" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getById } from '@/api/comic'
import { getList as getDetails } from '@/api/comic-detail'
import { numberFormat } from '@/utils'
import { getCustomer } from '@/api/customer'

export default {
  data() {
    return {
      comics: [],
      customerId: null,
      listLoading: true,
      rentDay: 0,
      customer: {
        name: '',
        gender: '',
        phoneNumber: ''
      }
    }
  },
  created() {
    this.fetchComic()
    this.fetchCustomer()
  },
  methods: {
    numberFormat,
    fetchComic() {
      this.listLoading = true
      let cartItems = []
      const cart = JSON.parse(localStorage.getItem('cart'))
      this.customerId = cart.userId
      if (cart) {
        cartItems = cart.items || []
      } else {
        this.$router.push({ name: 'ComicList' })
      }
      for (let i = 0; i < cartItems?.length; i++) {
        let comic = null
        let comicDetail = []
        getById(cartItems[i].comicId).then(res => {
          comic = res
          getDetails({
            comicId: cartItems[i].comicId
          }).then(res => {
            comicDetail = res.filter(item => cartItems[i].comicDetailIds.includes(item.id))
            for (let j = 0; j < comicDetail.length; j++) {
              this.comics.push({
                id: comicDetail[j].id,
                name: comic.name,
                code: comicDetail[j].comicDetailCode,
                price: comic.price
              })
              this.listLoading = false
            }
          })
        })
      }
    },
    fetchCustomer() {
      getCustomer(this.customerId).then(res => {
        this.customer = res
      }).catch(err => {
        console.log(err)
        this.$router.push({ name: 'CustomerList' })
      })
    },
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
    }
  }
}
</script>
