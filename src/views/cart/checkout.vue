<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="comics"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column align="center" label="ID" width="135">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Tên đầu sách">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Mã truyện">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="Giá gốc">
        <template slot-scope="scope">
          {{ numberFormat(scope.row.price) }}
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
import { numberFormat } from '@/utils'

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
    numberFormat,
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
    },
    getSummaries({ columns, data }) {
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Tổng tiền cọc'
          return
        }
        if (index === 3) {
          let sum = 0
          for (let i = 0; i < data.length; i++) {
            sum += data[i].price
          }
          sums[index] = numberFormat(sum)
        } else {
          sums[index] = ''
        }
      })

      return sums
    }
  }
}
</script>
