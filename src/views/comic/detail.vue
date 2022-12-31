<template>
  <div class="app-container">
    <div style="display: flex; justify-content: end; margin-bottom: 20px">
      <el-button type="primary" size="mini" @click="redirectToCreate">Thêm quyển mới</el-button>
    </div>
    <el-form :inline="true" :model="comic">
      <el-form-item label="Tên đầu truyện">
        <el-input v-model="comic.name" disabled />
      </el-form-item>
      <el-form-item label="Thể loại">
        <el-input v-model="comic.category" disabled />
      </el-form-item>
      <el-form-item label="Tác giả">
        <el-input v-model="comic.author" disabled />
      </el-form-item>
      <el-form-item label="Nhà xuất bản">
        <el-input v-model="comic.publisher" disabled />
      </el-form-item>
      <el-form-item label="Giá gốc">
        <el-input v-model="comic.price" disabled />
      </el-form-item>
      <el-form-item label="Vị trí">
        <el-input v-model="comic.position" disabled />
      </el-form-item>
    </el-form>
    <el-table
      ref="table"
      v-loading="listLoading"
      :data="comicDetails"
      element-loading-text="Loading"
      table-layout="auto"
      border
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="85">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Mã sách" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.comicDetailCode }}
        </template>
      </el-table-column>
      <el-table-column label="Tình trạng sách" min-width="120">
        <template slot-scope="scope">
          <el-input ref="input" v-if="scope.row.id === editing.id" v-model="scope.row.status" @blur="handleDeselect" />
          <div v-else>{{ scope.row.status }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Tình trạng thuê" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.available === true ? 'Có thể thuê' : 'Đã thuê' }}
        </template>
      </el-table-column>
      <el-table-column label="" width="250" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            @click="handleRent(scope.row)"
          >Thuê</el-button>
          <el-button
            v-if="scope.row.id === editing.id"
            type="primary"
            size="mini"
            @click="handleDeselect"
          >Lưu</el-button>
          <el-button
            v-else
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
  </div>
</template>

<script>
import { handleDelete, getList } from '@/api/comic-detail'
import { getById } from '@/api/comic'

export default {
  data() {
    return {
      comicDetails: null,
      listLoading: true,
      editing: {
        id: null,
        status: null
      },
      params: {
        comicId: this.$route.params.id,
        available: null
      },
      comic: {
        name: '',
        category: '',
        author: '',
        publisher: ''
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
        // sort by available and then id desc
        this.comicDetails = response.sort((a, b) => {
          if (a.available === b.available) {
            return b.id - a.id
          }
          return a.available ? -1 : 1
        })
        this.listLoading = false
      })
      getById(this.$route.params.id).then(response => {
        this.comic = response
      })
    },
    handleSelect(row) {
      this.editing = row
    },
    handleDeselect() {
      this.$refs.table.setCurrentRow(null)
      this.editing = {
        id: null,
        status: null
      }
    },
    redirectToCreate() {
      this.$router.push({ path: '/comic/create' })
    },
    handleRent(row) {
      this.$message({
        message: 'Đã thuê thành công',
        type: 'success'
      })
    },
    handleEdit(row) {
      this.handleSelect(row)
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
<style scoped>
.el-form-item {
  width: calc(50% - 10px);
}
</style>
