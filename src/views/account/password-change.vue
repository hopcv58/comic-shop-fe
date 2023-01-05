<template>
  <div class="app-container" style="">
    <h2>Thay đổi mật khẩu</h2>
    <el-form ref="form" :model="form" label-width="180px" label-position="left">
      <el-form-item label="Mật khẩu cũ">
        <el-input v-model="form.oldPassword" type="password" />
      </el-form-item>
      <el-form-item label="Mật khẩu mới">
        <el-input v-model="form.newPassword" type="password" />
      </el-form-item>
      <el-form-item label="Nhập lại mật khẩu mới">
        <el-input v-model="form.confirmPassword" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Lưu lại</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { handleUpdatePassword } from '@/api/account'

export default {
  data() {
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  created() {
  },
  methods: {
    onSubmit: function() {
      if (this.form.oldPassword === '') {
        this.$message.error('Vui lòng nhập mật khẩu cũ')
        return
      }
      if (this.form.newPassword === '') {
        this.$message.error('Vui lòng nhập mật khẩu mới')
        return
      }
      if (this.form.confirmPassword === '') {
        this.$message.error('Vui lòng nhập lại mật khẩu mới')
        return
      }
      if (this.form.newPassword !== this.form.confirmPassword) {
        this.$message.error('Mật khẩu mới không khớp')
        return
      }
      handleUpdatePassword({
        oldPassword: this.form.oldPassword,
        newPassword: this.form.newPassword
      }).then(res => {
        this.$message.success('Thay đổi mật khẩu thành công')
        this.$router.push({ path: '/dashboard' })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

