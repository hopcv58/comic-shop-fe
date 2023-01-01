<template>
  <div class="app-container">
    <div style="display: flex; justify-content: end; margin-bottom: 20px">
      <el-button type="primary" size="mini" @click="redirectToCreate">Thêm đầu truyện</el-button>
    </div>
    <el-form :inline="true" :model="params" class="form-search">
      <el-form-item label="Tên đầu truyện">
        <el-input v-model="params.name" @input="fetchData" />
      </el-form-item>
      <el-form-item label="Thể loại">
        <el-input v-model="params.category" @input="fetchData" />
      </el-form-item>
      <el-form-item label="Tác giả">
        <el-input v-model="params.author" @input="fetchData" />
      </el-form-item>
      <el-form-item label="Mã truyện">
        <el-input v-model="params.comicCode" @input="fetchData" />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="comics"
      element-loading-text="Loading"
      border
      highlight-current-row
      @current-change="handleSelect"
    >
      <el-table-column align="center" label="ID" width="55">
        <template slot-scope="scope">
          {{ listProps.currentPage * params.pageSize - params.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Mã đầu truyện" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.comicCode }}
        </template>
      </el-table-column>
      <el-table-column label="Tên đầu truyện" min-width="250">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Thể loại" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.category }}
        </template>
      </el-table-column>
      <el-table-column label="Tác giả" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.author }}
        </template>
      </el-table-column>
      <el-table-column label="Nhà xuất bản" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.publisher }}
        </template>
      </el-table-column>
      <el-table-column label="Vị trí" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.position }}
        </template>
      </el-table-column>
      <el-table-column label="Giá gốc" width="80">
        <template slot-scope="scope">
          {{ numberFormat(scope.row.price) }}
        </template>
      </el-table-column>
      <el-table-column label="Còn lại" width="80">
        <template slot-scope="scope">
          {{ scope.row.quantity }}
        </template>
      </el-table-column>
      <el-table-column label="" width="150" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(scope.row)"
          >Sửa</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >Xoá</el-button>
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
import { handleDelete, getList } from '@/api/comic'
import { numberFormat } from '@/utils'

export default {
  name: 'ComicList',
  data() {
    return {
      comics: null,
      listLoading: true,
      params: {
        name: null,
        category: null,
        author: null,
        comicCode: null,
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
    this.fetchData()
  },
  methods: {
    numberFormat,
    handleSelect(row) {
      this.$router.push({ path: `/comic/${row.id}` })
    },
    fetchData() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.comics = response.content
        this.listProps = {
          total: response.totalElements,
          totalPage: response.totalPages,
          currentPage: response.number + 1
        }
        this.listLoading = false
      })
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
      this.fetchData()
    },
    handleDelete(row) {
      this.$confirm('This will permanently delete the comic. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        handleDelete(row.id).then(() => {
          this.$message({
            type: 'success',
            message: 'Delete successfully!'
          })
          this.fetchData()
        })
      })
    }
  }
}
</script>
