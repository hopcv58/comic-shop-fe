<template>
  <div class="app-container">
    <h2>Danh sách khách hàng đang thuê truyện</h2>
    <el-table
      v-loading="listLoading"
      :data="customers"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="STT" width="95">
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
import { getListCustomerRenting } from '@/api/analysis'

export default {
  data() {
    return {
      customers: null,
      listLoading: true,
      params: {
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
      getListCustomerRenting(this.params).then(response => {
        this.customers = response.content
        this.listProps = {
          total: response.totalElements,
          totalPage: response.totalPages,
          currentPage: response.number + 1
        }
        this.listLoading = false
      })
    },
    changePage(page) {
      this.params.pageNo = page - 1
      this.fetchData()
    }
  }
}
</script>
