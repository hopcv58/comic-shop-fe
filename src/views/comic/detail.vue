<template>
  <div class="app-container">
    <div style="display: flex; justify-content: end; margin-bottom: 20px">
      <el-button type="primary" size="mini" @click="redirectToCreate">Thêm quyển mới</el-button>
    </div>
    <el-form :inline="true" :model="comic" class="form-search">
      <el-form-item label="Tên truyện">
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
      <el-form-item label="Giá cọc">
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
      :row-class-name="tableRowClassName"
    >
      <el-table-column align="center" label="STT" width="85">
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
          <el-input v-if="scope.row.id === editing.id" ref="input" v-model="scope.row.status" />
          <div v-else>{{ scope.row.status }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Tình trạng thuê" min-width="150">
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.id === editing.id && checkAvailable(scope.row) === true"
            ref="select"
            v-model="scope.row.available"
            placeholder="Select"
          >
            <el-option
              :value="true"
              label="Có thể thuê"
            />
            <el-option
              :value="false"
              label="Không thể thuê"
            />
          </el-select>
          <div v-else>{{ checkAvailable(scope.row) ? 'Có thể thuê' : 'Không thể thuê' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="" width="150" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            :disabled="!checkAvailable(scope.row)"
            @click="handleRent(scope.row)"
          >Thuê
          </el-button>
          <el-button
            v-if="scope.row.id === editing.id"
            type="warning"
            size="mini"
            @click="handleDeselect"
          >Lưu
          </el-button>
          <el-button
            v-else
            type="primary"
            size="mini"
            @click="handleEdit(scope.row)"
          >Sửa
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="Thêm truyện mới"
      :visible.sync="createDialogueVisible"
      width="30%"
    >
      <el-form
        ref="form"
        :model="createForm"
        label-width="120px"
      >
        <el-form-item label="Tình trạng sách" prop="status">
          <el-input v-model="createForm.status" width="100%" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogueVisible = false">Quay lại</el-button>
        <el-button type="primary" @click="addComicDetail">Thêm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { handleUpdate, getList, handleCreate } from '@/api/comic-detail'
import { getById } from '@/api/comic'

export default {
  data() {
    return {
      comicDetails: null,
      comicsInCart: {},
      listLoading: true,
      createDialogueVisible: false,
      createForm: {
        status: 'Sách mới',
        comicId: this.$route.params.id
      },
      editing: {
        id: null,
        status: null,
        available: null
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
    this.getComicsInCart()
  },
  methods: {
    getComicsInCart() {
      const cart = JSON.parse(localStorage.getItem('cart'))
      const comicsInCart = {}
      for (let i = 0; i < cart?.items?.length; i++) {
        comicsInCart[cart.items[i].comicId] = cart.items[i].comicDetailIds
      }
      this.comicsInCart = comicsInCart
    },
    checkAvailable(comicDetail) {
      if (comicDetail.available === false) {
        return false
      }
      if (this.comicsInCart[this.params.comicId]) {
        return !this.comicsInCart[this.params.comicId].includes(comicDetail.id)
      }
      return true
    },
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
      handleUpdate(this.editing.id, this.editing).then(() => {
        this.fetchData()
        this.$message.success('Cập nhật thông tin truyện thành công')
      })
      this.editing = {
        id: null,
        status: null
      }
    },
    redirectToCreate() {
      this.createDialogueVisible = true
    },
    handleRent(row) {
      this.$store.dispatch('cart/addItem', {
        comicId: this.params.comicId,
        comicDetailId: row.id
      }).then(() => {
        this.getComicsInCart()
        this.$message({
          message: 'Thêm vào giỏ hàng thành công',
          type: 'success'
        })
      })
    },
    handleEdit(row) {
      this.handleSelect(row)
    },
    changePage(page) {
      this.params.pageNo = page - 1
      this.fetchData()
    },
    tableRowClassName({ row }) {
      return this.checkAvailable(row) ? 'success-row' : 'danger-row'
    },
    addComicDetail() {
      handleCreate(this.createForm).then(() => {
        this.fetchData()
        this.createDialogueVisible = false
        this.$message.success('Thêm truyện thành công')
      })
    }
  }
}
</script>
