<template>
  <div>
    <div style="display: flex; justify-content: end; margin-bottom: 20px">
      <el-button type="danger" size="mini" @click="clearCart">Xoá toàn bộ</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="comics"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
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
      <el-table-column label="Giá gốc">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="" width="75">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">Xoá</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getById } from '@/api/comic'
import { getList as getDetails } from '@/api/comic-detail'

export default {
  data() {
    return {
      comics: [],
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
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
              this.listLoading = false
            }
          })
        })
      }
    },
    handleDelete(row) {
      const index = this.comics.indexOf(row)
      this.comics.splice(index, 1)
      this.$store.dispatch('cart/removeItem', row.id)
    },
    clearCart() {
      this.$store.dispatch('cart/removeAll')
      this.comics = []
    }
  }
}
</script>
