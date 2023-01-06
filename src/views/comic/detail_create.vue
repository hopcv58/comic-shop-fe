<template>
  <div class="app-container" style="">
    <h2>Nhập thông tin truyện</h2>
    <el-form ref="form" :model="form" label-width="120px" label-position="left">
      <el-form-item label="Tên">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Tác giả">
        <el-input v-model="form.author" />
      </el-form-item>
      <el-form-item label="Thể loại">
        <el-input v-model="form.category" />
      </el-form-item>
      <el-form-item label="Nhà xuất bản">
        <el-input v-model="form.publisher" />
      </el-form-item>
      <el-form-item label="Vị trí">
        <el-input v-model="form.position" />
      </el-form-item>
      <el-form-item label="Giá tiền">
        <el-input v-model="form.price" @input="allowOnlyNumeric" />
      </el-form-item>
      <el-form-item label="Số lượng">
        <el-input v-model="form.quantity" @input="allowOnlyNumeric" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Lưu lại</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { handleCreate } from '@/api/comic'

export default {
  data() {
    return {
      form: {
        name: null,
        author: null,
        publisher: null,
        category: null,
        position: null,
        price: '0',
        quantity: '0'
      }
    }
  },
  methods: {
    allowOnlyNumeric() {
      // reject non-numeric characters
      this.form.price = this.form.price.replace(/\D/g, '')
      this.form.quantity = this.form.quantity.replace(/\D/g, '')
    },
    onSubmit: function() {
      if (!this.form.name) {
        this.$message.error('Vui lòng nhập tên khách hàng')
        return
      }
      if (!this.form.author) {
        this.$message.error('Vui lòng nhập tên tác giả')
        return
      }
      if (!this.form.publisher) {
        this.$message.error('Vui lòng nhập tên nhà xuất bản')
        return
      }
      if (!this.form.category) {
        this.$message.error('Vui lòng nhập tên thể loại')
        return
      }
      // if (!this.form.position) {
      //   this.$message.error('Vui lòng nhập vị trí')
      //   return
      // }
      if (!this.form.price) {
        this.$message.error('Vui lòng nhập giá tiền')
        return
      }
      if (!this.form.quantity) {
        this.$message.error('Vui lòng nhập số lượng')
        return
      }
      handleCreate(this.form).then(res => {
        this.$message.success('Thêm mới thành công')
        this.$router.push({ name: 'ComicList' })
      }).catch(err => {
        console.log(err)
        this.$message.error('Thêm mới thất bại')
      })
    }
  }
}
</script>
