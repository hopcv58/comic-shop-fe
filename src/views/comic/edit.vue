<template>
  <div class="app-container" style="">
    <h2>Sửa thông tin truyện</h2>
    <el-form ref="form" :model="form" label-width="120px" label-position="left">
      <el-form-item label="Mã Truyện">
        <el-input v-model="form.comicCode" disabled />
      </el-form-item>
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Lưu lại</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getById, handleUpdate } from '@/api/comic'

export default {
  data() {
    return {
      form: {
        comicCode: null,
        name: null,
        author: null,
        publisher: null,
        category: null,
        position: null,
        price: '0'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getById(this.$route.params.id).then(res => {
        this.form = res
      }).catch(err => {
        console.log(err)
        this.$router.push({ name: 'ComicList' })
      })
    },
    allowOnlyNumeric() {
      // reject non-numeric characters
      this.form.price = this.form.price.replace(/\D/g, '')
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
      if (!this.form.price || this.form.price === '0') {
        this.$message.error('Vui lòng nhập giá tiền')
        return
      }
      handleUpdate(this.$route.params.id, this.form).then(res => {
        this.$message.success('Sửa thông tin thành công')
        this.$router.push({ name: 'ComicList' })
      }).catch(err => {
        console.log(err)
        this.$message.error('Sửa thông tin thất bại')
      })
    }
  }
}
</script>
