<template>
  <div class="app-container">
    <h2>Top 5 truyện được thuê nhiều nhất</h2>
    <el-table
      v-loading="listLoading"
      :data="comics"
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
      <el-table-column label="Tên truyện" align="center">
        <template slot-scope="scope">
          {{ scope.row[1] }}
        </template>
      </el-table-column>
      <el-table-column label="Mã truyện" align="center">
        <template slot-scope="scope">
          {{ scope.row[2] }}
        </template>
      </el-table-column>
      <el-table-column label="Số lượt thuê" align="center">
        <template slot-scope="scope">
          {{ scope.row[0] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getTopComic } from '@/api/analysis'

export default {
  data() {
    return {
      comics: null,
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
      getTopComic(this.params).then(response => {
        this.comics = response
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
