<template>
  <div class="app-container">
    <el-form :inline="true" :model="params" class="form-search">
      <el-form-item label="Tên KH">
        <el-input v-model="params.name" placeholder="Tên KH" @input="fetchData" />
      </el-form-item>
      <el-form-item label="Số ĐT">
        <el-input v-model="params.phoneNumber" placeholder="Số ĐT" @input="fetchData" />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="customers"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ listProps.currentPage * params.pageSize - params.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Tên Khách hàng">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Giới tính" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Số điện thoại" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.phoneNumber }}
        </template>
      </el-table-column>
      <el-table-column label="" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="handleSelect(scope.row)" size="mini">Chọn</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: center; margin-top: 20px">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="listProps.total"
        :page-size="params.pageSize"
        :current-page.sync="listProps.currentPage"
        :hide-on-single-page="true"
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { deleteCustomer, getList } from '@/api/customer'

export default {
  data() {
    return {
      customers: null,
      listLoading: true,
      params: {
        name: null,
        phoneNumber: null,
        pageSize: 5,
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
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.customers = response.content
        this.listProps = {
          total: response.totalElements,
          totalPage: response.totalPages,
          currentPage: response.number + 1
        }
        this.listLoading = false
      })
    },
    debouncedSearch() {

    },
    addCustomer() {
      this.$router.push({ path: '/customer/create' })
    },
    handleEdit(row) {
      this.$router.push({
        path: '/customer/edit' + '/' + row.id
      })
    },
    changePage(page) {
      this.params.pageNo = page - 1
      this.fetchData()
    },
    handleDelete(row) {
      this.$confirm('This will permanently delete the customer. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteCustomer(row.id).then(() => {
          this.$message({
            type: 'success',
            message: 'Delete successfully!'
          })
          this.fetchData()
        })
      })
    },
    handleSelect(row) {
      this.$store.dispatch('cart/setCustomerId', row.id)
      this.$router.push({ path: '/cart/checkout' })
    }
  }
}
</script>
<style scoped>
.el-form-item {
  width: calc(50% - 10px);
}
</style>
