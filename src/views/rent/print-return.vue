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
    <el-form ref="form" class="form-search" :inline="true" :model="customer" label-width="140px" label-position="left">
      <el-form-item label="Tên KH">
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
      <el-form-item label="Ngày bắt đầu">
        <el-input v-model="startDate" disabled />
      </el-form-item>
      <el-form-item label="Số ngày dự kiến">
        <el-input v-model="expectedRentDays" disabled />
      </el-form-item>
      <el-form-item label="Số ngày đã thuê">
        <el-input ref="phoneNumber" :value="currentRentDays" disabled />
      </el-form-item>
      <el-form-item label="Phí thuê">
        <el-input ref="phoneNumber" :value="fee" disabled />
      </el-form-item>
      <el-form-item label="Phí phạt">
        <el-input ref="phoneNumber" :value="fine" disabled />
      </el-form-item>
      <el-form-item label="Tổng tiền">
        <el-input ref="phoneNumber" :value="totalPayment" disabled />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getById as getComicById } from '@/api/comic'
import { getById as getRentById } from '@/api/rent'
import { getList as getComicDetails } from '@/api/comic-detail'
import { numberFormat } from '@/utils'

export default {
  data() {
    return {
      comics: [],
      customerId: null,
      listLoading: true,
      expectedRentDays: 0,
      startDate: null,
      customer: {
        name: '',
        gender: '',
        phoneNumber: ''
      }
    }
  },
  computed: {
    fee() {
      return this.expectedRentDays * this.comics.length * 2000
    },
    currentRentDays() {
      const start = new Date(this.startDate)
      const end = new Date()
      const diffTime = Math.abs(end - start)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    fine() {
      return this.currentRentDays > this.expectedRentDays ? (this.currentRentDays - this.expectedRentDays) * 4000 : 0
    },
    totalPayment() {
      return this.fee + this.fine
    }
  },
  created() {
    this.fetchRentDetail()
  },
  updated() {
    // print the page if listLoading is false and customer.name is not empty
    if (!this.listLoading) {
      this.handlePrint()
    }
  },
  methods: {
    numberFormat,
    fetchRentDetail() {
      getRentById(this.$route.params.id).then(response => {
        this.customer = response.customerEntity
        this.expectedRentDays = response.rentDays
        this.startDate = response.startDate
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
