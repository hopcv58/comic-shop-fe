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
      <el-table-column label="Tên truyện">
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
        <el-input :value="currentRentDays" disabled />
      </el-form-item>
      <el-form-item label="Phí thuê">
        <el-input :value="numberFormat(cost)" disabled />
      </el-form-item>
      <el-form-item label="Phí phạt">
        <el-input v-model="fine" :autofocus="renting" :disabled="!renting" />
      </el-form-item>
      <el-form-item label="Tổng tiền">
        <el-input :value="numberFormat(totalPayment)" disabled />
      </el-form-item>
      <br>
      <el-button v-if="renting" type="success" size="mini" @click="handleReturn">In phiếu trả</el-button>
    </el-form>
  </div>
</template>

<script>
import { getById as getComicById } from '@/api/comic'
import { getById as getRentById, handleUpdate } from '@/api/rent'
import { getList as getComicDetails } from '@/api/comic-detail'
import { numberFormat } from '@/utils'

export default {
  data() {
    return {
      comics: [],
      listLoading: false,
      expectedRentDays: 0,
      startDate: null,
      comicListForUpdate: [],
      renting: false,
      customer: {
        id: '',
        name: '',
        gender: '',
        phoneNumber: ''
      },
      fine: 0
    }
  },
  computed: {
    cost() {
      if (this.currentRentDays > this.expectedRentDays) {
        return (this.expectedRentDays * 2000 + (this.currentRentDays - this.expectedRentDays) * 3000) * this.comics.length
      } else {
        return this.currentRentDays * this.comics.length * 2000
      }
    },
    currentRentDays() {
      const start = new Date(this.startDate)
      const end = new Date()
      const diffTime = Math.abs(end - start)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    totalPayment() {
      if (this.fine) {
        return parseInt(this.cost) + parseInt(this.fine)
      } else {
        return this.cost
      }
    }
  },
  created() {
    this.fetchRentDetail()
  },
  methods: {
    numberFormat,
    fetchRentDetail() {
      getRentById(this.$route.params.id).then(response => {
        this.customer = response.customerEntity
        this.comicListForUpdate = response.comicList
        this.expectedRentDays = response.rentDays
        this.startDate = response.startDate
        this.fine = response.fine ? response.fine : 0
        this.renting = response.renting
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
    },
    handleReturn() {
      // update fine and then redirect to print page
      handleUpdate(this.$route.params.id, {
        id: this.$route.params.id,
        customerId: this.customer.id,
        startDate: this.startDate,
        deposit: this.comics.reduce((a, b) => a + b.price, 0),
        fine: parseInt(this.fine),
        rentDays: this.expectedRentDays,
        rentalFee: this.totalPayment,
        renting: 0,
        comicList: this.comicListForUpdate
      }).then(() => {
        this.$message.success('Tạo phiếu trả thành công')
        this.$router.push({
          path: `/print/return/${this.$route.params.id}`
        })
      })
    }
  }
}
</script>
