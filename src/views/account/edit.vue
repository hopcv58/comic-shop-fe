<template>
  <div class="app-container" style="">
    <h2>Nhập thông tin tài khoản</h2>
    <el-form ref="form" :model="form" label-width="120px" label-position="left">
      <el-form-item label="Tên">
        <el-input ref="phoneNumber" v-model="form.email" />
      </el-form-item>
      <el-form-item label="Tên đăng nhập">
        <el-input :value="form.username" disabled />
      </el-form-item>
      <el-form-item label="Vai trò">
        <el-select v-model="form.roles" placeholder="Bấm vào để chọn">
          <el-option label="Quản trị viên" value="admin" />
          <el-option label="Nhân viên" value="user" />
        </el-select>
      </el-form-item>
      <el-form-item label="Mật khẩu">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Lưu lại</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getById, handleUpdate } from '@/api/account'

export default {
  data() {
    return {
      form: {
        email: '',
        username: '',
        roles: '',
        password: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getById(this.$route.params.id).then(res => {
        if (res.roles && res.roles[0] && res.roles[0].name === 'ROLE_ADMIN') {
          res.roles = 'admin'
        } else {
          res.roles = 'user'
        }
        res.password = ''
        this.form = res
      }).catch(err => {
        console.log(err)
      })
    },
    onSubmit: function() {
      if (!this.form.email) {
        this.$message.error('Vui lòng nhập tên')
        return
      }
      if (!this.form.username) {
        this.$message.error('Vui lòng nhập tên đăng nhập')
        return
      }
      if (this.form.username.length < 4) {
        this.$message.error('Tên đăng nhập phải có ít nhất 4 ký tự')
        return
      }
      if (!this.form.roles) {
        this.$message.error('Vui lòng chọn vai trò')
        return
      }
      if (!this.form.password) {
        this.$message.error('Vui lòng nhập mật khẩu')
        return
      }
      if (this.form.password.length < 4) {
        this.$message.error('Mật khẩu phải có ít nhất 4 ký tự')
        return
      }
      handleUpdate(this.$route.params.id, {
        id: this.$route.params.id,
        username: this.form.username,
        email: this.form.email,
        password: this.form.password,
        roles: this.form.roles === 'admin' ? [{ id: 1, name: 'ROLE_ADMIN' }] : [{ id: 2, name: 'ROLE_USER' }]
      }).then(res => {
        this.$message.success('Cập nhật khách hàng thành công')
        this.$router.push({ name: 'CustomerList' })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

