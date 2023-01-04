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
      <el-table-column align="center" label="STT" width="135">
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
      <el-table-column label="Tình trạng truyện">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="Giá cọc">
        <template slot-scope="scope">
          {{ numberFormat(scope.row.price) }}
        </template>
      </el-table-column>
    </el-table>
    <h2>Thông tin thanh toán</h2>
    <el-form ref="form" class="form-search" :inline="true" :model="customer" label-width="140px" label-position="left">
      <el-form-item label="Tên KH">
        <el-input v-model="customer.name" disabled />
      </el-form-item>
      <el-form-item label="Số điện thoại" disabled>
        <el-input ref="phoneNumber" v-model="customer.phoneNumber" disabled />
      </el-form-item>
      <el-form-item label="Ngày bắt đầu">
        <el-input v-model="formattedStartDate" disabled />
      </el-form-item>
      <el-form-item label="Ngày trả dự kiến">
        <el-input v-model="expectedEndDate" disabled />
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
    cost() {
      return this.expectedRentDays * this.comics.length * 2000
    },
    currentRentDays() {
      const start = new Date(this.startDate)
      const end = new Date()
      const diffTime = Math.abs(end - start)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    expectedEndDate() {
      const start = new Date(this.startDate)
      const end = new Date(start.setDate(start.getDate() + this.expectedRentDays))
      return end.toLocaleDateString()
    },
    formattedStartDate() {
      const start = new Date(this.startDate)
      return start.toLocaleDateString()
    }
  },
  created() {
    this.fetchRentDetail()
    setTimeout(() => {
      if (!this.listLoading) {
        this.handlePrint()
      } else {
        setTimeout(() => {
          this.handlePrint()
        }, 500)
      }
    }, 500)
  },
  mounted() {
    window.onafterprint = function(e) {
      // redirect to home page
      window.location.href = '/'
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
                        price: comic.price,
                        status: res[j].status
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
        if (index === 4) {
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
    handlePrint() {
      window.print()
    }
  }
}
</script>
