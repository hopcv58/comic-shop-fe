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
    <el-form :inline="true" :model="customerSearchQuery" class="form-search" style="position: relative">
      <el-form-item label="Tên KH">
        <el-input v-model="customerSearchQuery.name" placeholder="Tên KH" @input="fetchCustomerData" />
      </el-form-item>
      <el-form-item label="Số ĐT">
        <el-input v-model="customerSearchQuery.phoneNumber" placeholder="Số ĐT" @input="fetchCustomerData" />
      </el-form-item>
      <el-button
        type="primary"
        size="mini"
        style="position: absolute; right: 0; top: 5px"
        @click="createCustomerDialogueVisible = true"
      >Tạo KH</el-button>
    </el-form>
    <el-dialog title="Shipping address" :visible.sync="createCustomerDialogueVisible">
      <el-form :model="createCustomerForm">
        <el-form-item label="Tên" label-width="120px">
          <el-input v-model="createCustomerForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="SDT" label-width="120px">
          <el-input v-model="createCustomerForm.phoneNumber" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Giới tính" label-width="120px">
          <el-select v-model="createCustomerForm.gender">
            <el-option label="Nam" value="Nam" />
            <el-option label="Nữ" value="Nữ" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createCustomerDialogueVisible = false">Quay lại</el-button>
        <el-button type="primary" @click="handleCreateCustomer">Tạo KH</el-button>
      </span>
    </el-dialog>
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
          {{ listProps.currentPage * customerSearchQuery.pageSize - customerSearchQuery.pageSize + scope.$index + 1 }}
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
        :page-size="customerSearchQuery.pageSize"
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
import { createCustomer, getList as getCustomerList } from '@/api/customer'

export default {
  data() {
    return {
      comics: [],
      cartLoading: false,
      customers: null,
      listLoading: true,
      createCustomerDialogueVisible: false,
      createCustomerForm: {
        name: '',
        phoneNumber: '',
        gender: 'Nam'
      },
      customerSearchQuery: {
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
    this.fetchCustomerData()
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
            }
            this.cartLoading = false
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
    fetchCustomerData() {
      this.listLoading = true
      getCustomerList(this.customerSearchQuery).then(response => {
        this.customers = response.content
        this.listProps = {
          total: response.totalElements,
          totalPage: response.totalPages,
          currentPage: response.number + 1
        }
        this.listLoading = false
      })
    },
    handleCreateCustomer() {
      if (this.createCustomerForm.name === '') {
        this.$message.error('Tên khách hàng không được để trống')
        return
      }
      if (this.createCustomerForm.phoneNumber === '') {
        this.$message.error('Số điện thoại không được để trống')
        return
      }
      createCustomer(this.createCustomerForm).then(res => {
        this.createCustomerDialogueVisible = false
        this.customerSearchQuery.name = this.createCustomerForm.name
        this.customerSearchQuery.phoneNumber = this.createCustomerForm.phoneNumber
        this.fetchCustomerData()
        this.$message.success('Tạo khách hàng thành công')
      }).catch(err => {
        if (err?.response?.data?.message) {
          this.$message.error(err.response.data.message)
        } else {
          this.$message.error('Tạo khách hàng thất bại')
        }
      })
    },
    handleEdit(row) {
      this.$router.push({
        path: '/customer/edit' + '/' + row.id
      })
    },
    changePage(page) {
      this.customerSearchQuery.pageNo = page - 1
      this.fetchCustomerData()
    },
    handleSelect(row) {
      this.$store.dispatch('cart/setCustomerId', row.id)
      this.$router.push({ path: '/rent/checkout' })
    }
  }
}
</script>
