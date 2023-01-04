<template>
  <div class="app-container">
    <div style="display: flex; justify-content: end; margin-bottom: 20px">
      <el-button type="primary" size="mini" @click="redirectToCreate">Thêm truyện</el-button>
    </div>
    <el-form :inline="true" :model="params" class="form-search">
      <el-form-item label="Tên truyện">
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
      row-class-name="clickable-row"
      @current-change="handleSelect"
    >
      <el-table-column align="center" label="ID" width="55">
        <template slot-scope="scope">
          {{ listProps.currentPage * params.pageSize - params.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Mã truyện " min-width="180">
        <template slot-scope="scope">
          {{ scope.row.comicCode }}
        </template>
      </el-table-column>
      <el-table-column label="Tên truyện " min-width="250">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Còn lại" width="80">
        <template slot-scope="scope">
          {{ calcRemainQuantity(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="Giá cọc" width="80">
        <template slot-scope="scope">
          {{ numberFormat(scope.row.price) }}
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
      <el-table-column label="Nhà xuất bản" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.publisher }}
        </template>
      </el-table-column>
      <el-table-column label="Vị trí" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.position }}
        </template>
      </el-table-column>
      <el-table-column label="" width="210" align="center" fixed="right">
        <template slot-scope="scope">
<!--          <el-button-->
<!--            type="success"-->
<!--            size="mini"-->
<!--            :disabled="calcRemainQuantity(scope.row) === 0"-->
<!--            @click.stop.prevent="handleAddToCart(scope.row)"-->
<!--          >Thuê</el-button>-->
          <el-button
            type="primary"
            size="mini"
            @click.stop.prevent="handleEdit(scope.row)"
          >Sửa</el-button>
          <el-button
            type="danger"
            size="mini"
            @click.stop.prevent="handleDelete(scope.row)"
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
import { getList as getComicDetailList } from '@/api/comic-detail'

export default {
  name: 'ComicList',
  data() {
    return {
      comics: null,
      listLoading: true,
      comicsInCart: {},
      params: {
        name: null,
        category: null,
        author: null,
        comicCode: null,
        pageSize: 5,
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
    this.getComicsInCart()
  },
  methods: {
    numberFormat,
    getComicsInCart() {
      const cart = JSON.parse(localStorage.getItem('cart'))
      const comicsInCart = {}
      for (let i = 0; i < cart?.items?.length; i++) {
        comicsInCart[cart.items[i].comicId] = cart.items[i].comicDetailIds
      }
      this.comicsInCart = comicsInCart
    },
    calcRemainQuantity(comic) {
      return comic.quantity - (this.comicsInCart[comic.id]?.length || 0)
    },
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
    },
    handleAddToCart(row) {
      // get first available comicDetail
      getComicDetailList({
        comicId: row.id,
        available: true
      }).then(response => {
        for (let i = 0; i < response.length; i++) {
          if (this.comicsInCart[row.id]) {
            if (!this.comicsInCart[row.id].includes(response[i].id)) {
              this.addToCartAndRefreshCartData(row.id, response[i].id)
              break
            }
          } else {
            this.addToCartAndRefreshCartData(row.id, response[i].id)
            break
          }
        }
      })
    },
    addToCartAndRefreshCartData(comicId, comicDetailId) {
      this.$store.dispatch('cart/addItem', {
        comicId,
        comicDetailId
      })
      this.getComicsInCart()
    }
  }
}
</script>
