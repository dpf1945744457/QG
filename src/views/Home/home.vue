<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div
          class="grid-content bg-purple point_ll"
          @click="jump_one()"
        >
          <p>{{dataList.merchantAuditTotal }}个</p>
          <p>商家待审核</p>

        </div>
      </el-col>
      <el-col :span="6">
        <div
          class="grid-content bg-purple point_ll"
          @click="jump_two()"
        >
          <p>{{dataList.merchantBackTotal}}个</p>
          <p>商家退回待修改</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div
          class="grid-content bg-purple point_ll"
          @click="jump_three()"
        >
          <p>{{dataList.orderPendingTotal}}个</p>
          <p>订单待推送</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div
          class="grid-content bg-purple point_ll"
          @click="jump_four()"
        >
          <p>{{dataList.goodsPendingTotal}}个</p>
          <p>商品待备案</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDashboard } from '@/api/home'
export default {
  data() {
    return {
      dataList: [],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getDashboard().then((response) => {
        this.dataList = response.data
        console.log(response, 'response6666666')
      })
    },
    jump_one() {
      this.$router.push({
        path: '/businessManagement/business-audit',
      })
    },
    jump_two() {
      this.$router.push({
        path: '/businessManagement/business-inquiry',
        query: { sign: 'A',signL:'1' },
      })
    },
    jump_three() {
      this.$router.push({
        path: '/pushManagement/order-push',
        query: { sign: 'A' ,signL:'0'},
      })
    },
    jump_four() {
      this.$router.push({
        path: '/recordManagement/commodity-record',
        query: { sign: 'A' ,signL:'0'},
      })
    },
  },
}
</script>

<style lang='scss' >
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & > p:nth-of-type(1) {
    font-size: 20px;
    font-weight: bold;
  }
  & > p:nth-of-type(2) {
    font-size: 20px;
    font-weight: bold;
  }
}
.point_ll {
  cursor: pointer;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>