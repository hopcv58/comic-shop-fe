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
      console.log(this.form)
    }
  }
}
</script>

