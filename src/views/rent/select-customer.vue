<template>
  <div class="app-container">
    <div style="display: flex; justify-content: end; margin-bottom: 20px">
      <el-button type="danger" size="mini" :disabled="!comics.length" @click="clearCart">Xoá toàn bộ</el-button>
    </div>
    <el-table
      v-loading="cartLoading"
      :data="comics"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="margin-bottom: 50px"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Tên đầu sách">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Mã sách">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="Giá cọc">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="" width="75">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDeleteItem(scope.row)">Xoá</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form :inline="true" :model="params" class="form-search">
      <el-form-item label="Tên KH">
        <el-input v-model="params.name" placeholder="Tên KH" @input="fetchCartData" />
      </el-form-item>
      <el-form-item label="Số ĐT">
        <el-input v-model="params.phoneNumber" placeholder="Số ĐT" @input="fetchCartData" />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="cartLoading"
      :data="customers"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ listProps.currentPage * params.pageSize - params.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Tên Khách hàng">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Giới tính" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Số điện thoại" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.phoneNumber }}
        </template>
      </el-table-column>
      <el-table-column label="" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" :disabled="!comics.length" @click="handleSelect(scope.row)">Chọn</el-button>
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
import { getById } from '@/api/comic'
import { getList as getDetails } from '@/api/comic-detail'
import { getList } from '@/api/customer'

export default {
  data() {
    return {
      comics: [],
      cartLoading: false,
      customers: null,
      listLoading: true,
      params: {
        name: null,
        phoneNumber: null,
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
    this.fetchCartData()
    this.fetchData()
  },
  methods: {
    fetchCartData() {
      let cartItems = []
      const cart = JSON.parse(localStorage.getItem('cart'))
      if (cart) {
        cartItems = cart.items || []
      } else {
        this.$router.push({ name: 'ComicList' })
      }
      for (let i = 0; i < cartItems?.length; i++) {
        let comic = null
        let comicDetail = []
        getById(cartItems[i].comicId).then(res => {
          comic = res
          getDetails({
            comicId: cartItems[i].comicId
          }).then(res => {
            comicDetail = res.filter(item => cartItems[i].comicDetailIds.includes(item.id))
            for (let j = 0; j < comicDetail.length; j++) {
              this.comics.push({
                id: comicDetail[j].id,
                name: comic.name,
                code: comicDetail[j].comicDetailCode,
                price: comic.price
              })
              this.cartLoading = false
            }
          })
        })
      }
    },
    handleDeleteItem(row) {
      const index = this.comics.indexOf(row)
      this.comics.splice(index, 1)
      this.$store.dispatch('cart/removeItem', row.id)
    },
    clearCart() {
      this.$store.dispatch('cart/removeAll')
      this.comics = []
    },
    fetchData() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.customers = response.content
        this.listProps = {
          total: response.totalElements,
          totalPage: response.totalPages,
          currentPage: response.number + 1
        }
        this.listLoading = false
      })
    },
    addCustomer() {
      this.$router.push({ path: '/customer/create' })
    },
    handleEdit(row) {
      this.$router.push({
        path: '/customer/edit' + '/' + row.id
      })
    },
    changePage(page) {
      this.params.pageNo = page - 1
      this.fetchData()
    },
    handleSelect(row) {
      this.$store.dispatch('cart/setCustomerId', row.id)
      this.$router.push({ path: '/rent/checkout' })
    }
  }
}
</script>
