<template>
  <div class="container">
    <!-- <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
      </div>
    </div> -->

    <div class="container_tw">
      <div class="tw_title">
        <p>商品信息</p>
        <div class="tools-right">
          <el-button
            type="primary"
            class="tools-button"
            @click="back"
            round
          >
            <i class="el-icon-d-arrow-left"></i> 返回
          </el-button>
        </div>
      </div>

      <div style="">
        <el-table
          :data="detailList"
          class="table"
          min-height='80px'
        >
          <el-table-column
            prop="goodsName"
            label="商品名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="goodsSn"
            label="商品编号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="typeSpecification"
            label="规格"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="unit"
            label="计量单位"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="number"
            label="数量"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="unitPrice"
            label="单价/RMB"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orderGoodsTotal"
            label="总价"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="country"
            label="原产国"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="barCode"
            label="条形码"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="brandName"
            label="品牌"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
    </div>

    <!-- <div> -->
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>订单信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <p class="title">订单编号：{{allList.orderSn}}</p>
        </el-col>
        <el-col
          :span="6"
          :offset="4"
        >
          <p class="title">订单时间：{{allList.orderCreateTime}}</p>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <p class="title">订单状态：{{allList.orderStatusStr}}</p>
        </el-col>
        <el-col
          :span="6"
          :offset="4"
        >
          <p class="title">订单金额：{{allList.orderPrice}}</p>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>收货人信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="4">
          <p class="title">收货人：{{allList.consigneeName}}</p>
        </el-col>
        <el-col
          :span="6"
          :offset="6"
        >
          <p class="title">地址：{{allList.consigneeAddress}}</p>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <p class="title">手机号码：{{allList.consigneeMobile}}</p>
        </el-col>
        <el-col
          :span="6"
          :offset="4"
        >
          <p class="title">收货人所在国：{{allList.consigneeCountry}}</p>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>费用信息</span>
        <span>（商品总价+快递费用+税费-优惠减免-积分减免=实际费）</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="4">
          <p class="title">商品总价：{{allList.goodsPrice}}</p>
        </el-col>
        <el-col
          :span="6"
          :offset="6"
        >
          <p class="title">快递费用：{{allList.freightPrice}}</p>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <p class="title">税费：{{allList.taxPrice}}</p>
        </el-col>
        <el-col
          :span="6"
          :offset="4"
        >
          <p class="title">优惠减免：{{allList.preferentialPrice}}</p>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <p class="title">积分减免：{{allList.integralPrice}}</p>
        </el-col>
        <el-col
          :span="6"
          :offset="4"
        >
          <p class="title">实际费用：{{allList.orderActualPrice}}</p>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>支付信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="4">
          <p
            class="title"
            v-if="allList.payTransferId=='1'"
          >支付渠道：快捷</p>
          <p
            class="title"
            v-if="allList.payTransferId=='2'"
          >支付渠道：微信</p>
          <p
            class="title"
            v-if="allList.payTransferId=='3'"
          >支付渠道：支付宝</p>
        </el-col>
        <el-col
          :span="6"
          :offset="6"
        >
          <p class="title">支付时间：{{allList.payTime}}</p>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <p class="title">支付人姓名：{{allList.payRealName}}</p>
        </el-col>
        <el-col
          :span="6"
          :offset="4"
        >
          <p class="title">支付人电话：{{allList.payMobile}}</p>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <p
            class="title"
            v-if="allList.payCertType=='01'"
          >支付人证件类型：身份证</p>
          <p
            class="title"
            v-if="allList.payCertType=='02'"
          >支付人证件类型：护照</p>
           <p
            class="title"
            v-if="allList.payCertType=='03'"
          >支付人证件类型：其他</p>
        </el-col>
        <el-col
          :span="6"
          :offset="4"
        >
          <p class="title">支付人证件号码：{{allList.payCertId}}</p>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <p class="title">支付金额：{{allList.orderActualPrice}}</p>
        </el-col>

      </el-row>
    </el-card>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>快递信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="4">
          <p class="title">快递公司：{{allList.shipChannel}}</p>
        </el-col>
        <el-col
          :span="6"
          :offset="6"
        >
          <p class="title">快递单号：{{allList.shipSn}}</p>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <p class="title">发货时间：{{allList.shipTime}}</p>
        </el-col>
        <el-col
          :span="6"
          :offset="4"
        >
          <p class="title">确认收货时间：{{allList.shipReceivedTime}}</p>
        </el-col>
      </el-row>
    </el-card>

    <!-- 分页 -->
  </div>
</template>

<script>
import { recordList, recordstatus, recordids, recorddeatil } from '@/api/record'
import { getDetail } from '@/api/order-push'

import { username, validEmail, validphone } from '@/utils/validate'
export default {
  name: 'orderDetails',
  data() {
    var validateusername = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback(new Error('请输入登录账号'))
      } else if (!username(value)) {
        callback(new Error('只能包含字母和数字'))
      }
      callback()
    }
    var validateemail = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback(new Error('请输入邮箱'))
      } else if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      }
      callback()
    }
    var phone = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback(new Error('请输入手机号码'))
      } else if (!validphone(value)) {
        callback(new Error('请输入正确的手机号码'))
      }
      callback()
    }
    return {
      dialogVisible: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      detailList: [],
      allList: [],
      rules: {
        account: [
          {
            required: true,
            validator: validateusername,
            trigger: 'blur',
          },
          //          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            validator: validateemail,
            trigger: 'blur',
          },
        ],
        mobilePhone: [
          {
            required: true,
            validator: phone,
            trigger: 'blur',
          },
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
      },
    }
  },
  created() {
    this.detailData()
    // this.getchannelList()
    // this.getrecordstatus()
  },
  methods: {
    detailData() {
      const param = {
        id: this.$route.query.id,
      }
      getDetail(param).then((response) => {
        if (response.code == '200') {
          this.allList = response.data
          this.detailList = response.data.orderGoodsList
        }
      })
    },
    back() {
      window.history.go(-1)
    },

    search() {
      this.userlists()
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.userlists()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.userlists()
    },
  },
}
</script>

<style lang='scss'>
.container {
  padding: 20px;
  // min-width: 1200px;
}
.el-form-item__label {
  text-align: right !important;
}
.container_on {
  padding: 20px;

  background: white;
  .on_title {
    margin-bottom: 20px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    // padding: 0 10px;
    border-bottom: 1px solid rgb(231, 234, 236);
    & > p:nth-child(1) {
      color: rgb(104, 107, 109);
      font-size: 14px;
      font-weight: bold;
    }
    & > p:nth-child(2) {
      color: rgb(1, 123, 255);
      font-size: 14px;
    }
    & > p:nth-child(2):hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .on_input {
    .el-row {
      display: flex;
      justify-content: space-around;
    }
  }
}
.container_tw {
  .tw_title {
    height: 50px;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    border-bottom: 1px solid rgb(231, 234, 236);
    & > p {
      color: rgb(104, 107, 109);
      font-size: 14px;
      font-weight: bold;
    }
    .el-button:hover {
      background: rgb(27, 179, 148);
    }
    .table {
      th {
        padding: 0 !important;
        height: 30px;
        line-height: 30px;
      }
      td {
        padding: 0 !important;
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
.el-card {
  margin-top: 20px;
  margin-bottom: 20px;
}

.pagination-container {
  background: #ffffff;
  padding: 10px 0;
  margin: 20px;
}
</style>
