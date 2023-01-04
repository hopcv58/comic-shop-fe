<template>
  <div class="app-container">
    <div style="display: flex; justify-content: end; margin-bottom: 20px">
      <el-button type="primary" size="mini" @click="addAccount">Tạo tài khoản</el-button>
    </div>
    <el-form :inline="true" :model="params" class="form-search">
      <el-form-item label="Tên đăng nhập">
        <el-input v-model="params.username" placeholder="Tên đăng nhập" @input="fetchData" />
      </el-form-item>
      <el-form-item label="Tên">
        <el-input v-model="params.email" placeholder="Tên" @input="fetchData" />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="accounts"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="STT" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Tên">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="Tên đăng nhập" width="210" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Vai trò" width="180" align="center">
        <template slot-scope="scope">
          {{ isAdmin(scope.row) ? 'Quản trị viên' : 'Nhân viên' }}
        </template>
      </el-table-column>
      <el-table-column label="" width="180" align="center">
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
  </div>
</template>

<script>
import { handleDelete, getList } from '@/api/account'

export default {
  data() {
    return {
      accounts: null,
      listLoading: true,
      params: {
        email: null,
        username: null
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
        this.accounts = response
        this.listLoading = false
      })
    },
    isAdmin(account) {
      return account.roles.some(role => role.name === 'ROLE_ADMIN')
    },
    addAccount() {
      this.$router.push({ path: '/account/create' })
    },
    handleEdit(row) {
      this.$router.push({
        path: '/account/edit' + '/' + row.id
      })
    },
    handleDelete(row) {
      this.$confirm('This will permanently delete the customer. Continue?', 'Warning', {
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
