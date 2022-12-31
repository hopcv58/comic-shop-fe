<template>
  <div class="app-container" style="">
    <h2>Sửa thông tin khách hàng</h2>
    <el-form ref="form" :model="form" label-width="120px" label-position="left">
      <el-form-item label="Tên">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Giới tính">
        <el-select v-model="form.gender" placeholder="Bấm vào để chọn">
          <el-option label="Nam" value="Nam" />
          <el-option label="Nữ" value="Nữ" />
        </el-select>
      </el-form-item>
      <el-form-item label="Số điện thoại">
        <el-input ref="phoneNumber" v-model="form.phoneNumber" @input="allowOnlyNumeric" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Lưu lại</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validatePhoneNumber } from '@/utils/validate'
import { getCustomer, updateCustomer } from '@/api/customer'

export default {
  data() {
    return {
      form: {
        name: '',
        gender: '',
        phoneNumber: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getCustomer(this.$route.params.id).then(res => {
        this.form = res
      }).catch(err => {
        console.log(err)
        this.$router.push({ name: 'CustomerList' })
      })
    },
    allowOnlyNumeric() {
      // reject non-numeric characters
      this.form.phoneNumber = this.form.phoneNumber.replace(/\D/g, '')
    },
    onSubmit: function() {
      if (!this.form.name) {
        this.$message.error('Vui lòng nhập tên khách hàng')
        return
      }
      if (!validatePhoneNumber(this.form.phoneNumber)) {
        this.$message.error('Vui lòng nhập số điện thoại hợp lệ')
        return
      }
      if (!this.form.gender) {
        this.$message.error('Vui lòng chọn giới tính')
        return
      }
      updateCustomer(this.$route.params.id, this.form).then(res => {
        this.$message.success('Cập nhật khách hàng thành công')
        this.$router.push({ name: 'CustomerList' })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

