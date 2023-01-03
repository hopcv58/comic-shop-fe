<template>
  <div class="app-container">
    <el-form style="margin-bottom: 25px">
      <el-autocomplete
        v-model="customer.name"
        :fetch-suggestions="getCustomerByKeyword"
        placeholder="Tìm kiếm theo tên hoặc SĐT KH"
        style="width: 50%"
        @select="selectCustomer"
        @change="changeCustomer"
      />
    </el-form>
    <el-table
      :data="rents"
      element-loading-text="Loading"
      border
      :row-class-name="tableRowClassName"
      @current-change="handleSelect"
    >
      <el-table-column align="center" label="ID" width="55">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Tên KH" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.customerEntity.name }}
        </template>
      </el-table-column>
      <el-table-column label="Ngày thuê" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.startDate }}
        </template>
      </el-table-column>
      <el-table-column label="Ngày trả dự kiến" min-width="140">
        <template slot-scope="scope">
          {{ addDays(scope.row.startDate, scope.row.rentDays) }}
        </template>
      </el-table-column>
      <el-table-column label="Ngày trả" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.endDate }}
        </template>
      </el-table-column>
      <el-table-column label="Số lượng thuê" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.comicList.reduce((sum, item) => sum + item.comicDetailList.length, 0) }}
        </template>
      </el-table-column>
      <el-table-column label="Tổng tiền cọc" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.deposit }}
        </template>
      </el-table-column>
      <el-table-column label="Trạng thái" min-width="120">
        <template slot-scope="scope">
          <span v-if="!scope.row.renting">Đã trả</span>
          <span v-else-if="addDays(scope.row.startDate, scope.row.rentDays) < new Date().toISOString().slice(0, 10)">Đã quá hạn</span>
          <span v-else>Đang thuê</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="70">
        <template>
          <el-button
            type="success"
            size="mini"
          >
            Trả
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList as getCustomers } from '@/api/customer'
import { getListByCustomer, getList } from '@/api/rent'
import { addDays } from '@/utils'

export default {
  name: 'ComicList',
  data() {
    return {
      rents: null,
      keyword: '',
      customer: {
        id: '',
        name: ''
      },
      params: {
        pageSize: 10,
        pageNo: 0,
        sort: 'DESC',
        sortName: 'id'
      },
      listProps: {
        total: 1,
        totalPage: 1,
        currentPage: 1
      }
    }
  },
  created() {
    this.fetchCustomer()
  },
  methods: {
    addDays,
    tableRowClassName({ row }) {
      if (row.renting) {
        if (addDays(row.startDate, row.rentDays) < new Date().toISOString().slice(0, 10)) {
          return 'danger-row clickable-row'
        } else {
          return 'success-row clickable-row'
        }
      } else {
        return 'clickable-row'
      }
    },
    getCustomerByKeyword(keyword, cb) {
      if (keyword === '') {
        cb([])
      }
      getCustomers({
        name: keyword,
        pageSize: 5,
        pageNo: 0,
        sort: 'DESC',
        sortName: 'id'
      }).then(res => {
        const customers = res.content || []
        getCustomers({
          phoneNumber: keyword,
          pageSize: 5,
          pageNo: 0,
          sort: 'DESC',
          sortName: 'id'
        }).then(resp => {
          for (let i = 0; i < resp.content.length; i++) {
            if (customers.findIndex(c => c.id === resp.content[i].id) === -1) {
              customers.push(resp.content[i])
            }
          }
          const dropdownList = []
          for (let i = 0; i < customers.length; i++) {
            dropdownList.push({
              value: customers[i].name + ' - ' + customers[i].phoneNumber,
              id: customers[i].id
            })
          }
          cb(dropdownList)
        })
      })
    },
    selectCustomer(customer) {
      this.customer.id = customer.id
      this.fetchCustomer()
    },
    changeCustomer(customer) {
      if (customer === '') {
        this.customer.id = ''
        this.fetchCustomer()
      }
    },
    fetchCustomer() {
      if (this.customer.id) {
        getListByCustomer(this.customer.id).then(res => {
          this.rents = res
        })
      } else {
        getList().then(res => {
          this.rents = res
        })
      }
    },
    redirectToCreate() {
      this.$router.push({ path: '/comic/create' })
    },
    handleEdit(row) {
      this.$router.push({
        path: '/comic/edit' + '/' + row.id
      })
    },
    changePage(page) {
      this.params.pageNo = page - 1
      this.fetchCustomer()
    },
    handleSelect(row) {
      this.$router.push({
        path: '/rent/detail' + '/' + row.id
      })
    }
  }
}
</script>
