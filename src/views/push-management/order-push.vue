<template>
  <div class="container">
    <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
      </div>
      <el-form
        ref="formInline"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item
          label="企业名称:"
          prop="merchantName"
        >
          <el-input
            v-model="formInline.merchantName"
            placeholder="企业名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="订单编号:"
          prop="orderSn"
        >
          <el-input
            v-model="formInline.orderSn"
            placeholder="订单编号"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          label="创建时间:"
          prop="deta"
        >
          <el-date-picker
            v-model="formInline.deta"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item
          label="订单状态:"
          prop="orderStatus"
        >
          <el-select
            v-model="formInline.orderStatus"
            clearable
            placeholder="请选择订单状态"
          >
            <el-option
              v-for="item in selectList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="订单报关状态:"
          prop="orderRecordStatus"
        >
          <el-select
            v-model="formInline.orderRecordStatus"
            clearable
            placeholder="请选择订单报关状态"
            @change="change()"
          >
            <el-option
              v-for="item in recordstatuslist"
              :key="item.name"
              :label="item.value"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="支付报关状态:"
          prop="paymentRecordStatus"
        >
          <el-select
            v-model="formInline.paymentRecordStatus"
            clearable
            placeholder="请选择支付报关状态"
            @change="change()"
          >
            <el-option
              v-for="item in recordstatuslist"
              :key="item.name"
              :label="item.value"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            @click="search"
            round
          >查询</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="resetForm('formInline')"
            icon="el-icon-circle-close"
            round
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="container_tw">
      <div class="tw_title">
        <p>订单推送列表</p>
      </div>
      <div style="">
        <!-- <el-table
          :data="pushList"
          class="table"
          height="calc(100vh - 450px)"
        > -->
        <el-table
          :data="pushList"
          class="table"
          border
        >
          <!-- <el-table-column prop="id" label="ID" ></el-table-column> -->
          <el-table-column
            label="序号"
            type="index"
            width="55"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="merchantName"
            label="企业名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orderSn"
            label="订单编号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orderStatusStr"
            label="订单状态"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orderPrice"
            label="订单金额"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orderActualPrice"
            label="支付金额"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orderReportStatusStr"
            label="订单报关状态"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="payReportStatusStr"
            label="支付报关状态"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orderCreateTime"
            label="下单时间"
            align="center"
            width="100px"
          ></el-table-column>
          <el-table-column
            prop="payTime"
            label="支付时间"
            align="center"
            width="100px"
          ></el-table-column>
          <el-table-column
            prop="shipSn"
            label="物流单号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="success"
                size="small"
                style="margin-bottom:10px"
                @click="handleDetail(scope.row)"
              >订单详情</el-button>
              <el-button
                type="success"
                size="small"
                style="margin:10px 0 10px 0"
                v-loading="scope.row.sendMsgLoading_one"
                v-if="scope.row.orderReportStatusStr  == '申报失败' ||scope.row.orderReportStatusStr  == '尚未申报'"
                @click="handOrder(scope.row)"
              >手动订单报关</el-button>
              <el-button
                type="success"
                size="small"
                style="margin:0 0 10px 0"
                v-loading="scope.row.sendMsgLoading"
                v-if="scope.row.payReportStatusStr  == '申报失败' ||scope.row.payReportStatusStr  == '尚未申报'"
                @click="handPay(scope.row)"
              >手动支付单报关</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        class="block"
        style="text-align:center; margin-top:2em"
      >
        <el-pagination
          background
          :current-page="pageNum"
          :page-sizes="[5,10,15,20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <!-- 弹出框 -->
      <el-dialog
        title="确定"
        :visible.sync="dialogVisiblePay"
        width="30%"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <span>确定推送支付单报关？</span>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            @click="dialogVisiblePay= false"
            type="info"
          >取 消</el-button>
          <el-button
            type="primary"
            @click="dialogVisiblePay= false"
          >确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="确定"
        :visible.sync="dialogVisibleOrder"
        width="30%"
        :before-close="handleCloseO"
      >
        <span>确定推送订单单报关？</span>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            @click="dialogVisibleOrder = false"
            type="info"
          >取 消</el-button>
          <el-button
            type="primary"
            @click="dialogVisibleOrder = false"
          >确 定</el-button>
        </span>
      </el-dialog>

    </div>

    <!-- 分页 -->
  </div>
</template>

<script>
import {
  getManual,
  getDetail,
  getPush,
  getStatus,
  selectStatus,
} from '@/api/order-push'
import { dateFormat } from '@/utils/validate'
// import { channelList } from '@/api/commodity-record'

import { username, validEmail, validphone } from '@/utils/validate'
export default {
  name: 'orderPush',
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
      formInline: {
        merchantName: '',
        orderSn: '',
        deta: '',
      },
      dialogVisible: false,
      dialogVisiblePay: false,
      dialogVisibleOrder: false,
      form: {},
      pageNum: 1,
      pageSize: 10,
      total: 0,
      statusList: [],
      Payment: 'Payment',
      Order: 'Order',
      pushList: [],
      recordstatuslist: [],
      selectList: [],
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
    if (this.$route.query.signL) {
      this.formInline.orderRecordStatus = this.$route.query.signL
      this.formInline.paymentRecordStatus = this.$route.query.signL
    }
    this.getrecordstatus()
    this.userlists()
    this.getSelect()
  },
  methods: {
    userlists() {
      let endDate = ''
      let startDate = ''
      if (this.formInline.deta ) {
        startDate = dateFormat('YYYY-mm-dd', this.formInline.deta[0])
        endDate = dateFormat('YYYY-mm-dd', this.formInline.deta[1])
      }

      getPush({
        orderRecordStatus: this.formInline.orderRecordStatus,
        paymentRecordStatus: this.formInline.paymentRecordStatus,
        merchantName: this.formInline.merchantName,
        orderStatus: this.formInline.orderStatus,
        orderSn: this.formInline.orderSn,
        endDate: endDate,
        startDate: startDate,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((response) => {
          if (response.code == '200') {
            this.pushList = response.data.dataList
            if (this.pushList.length) {
              this.pushList.map((item) => {
                this.$set(item, 'sendMsgLoading', false)
                this.$set(item, 'sendMsgLoading_one', false)
                return item
              })
            }
            this.total = response.data.total
          }
        })
        .catch((error) => {
          // this.$message.error(error.errmsg);
        })
    },
    handleClose() {
      this.dialogVisiblePay = false
      this.userlists()
    },
    handleCloseO() {
      this.dialogVisibleOrder = false
      this.userlists()
    },
    search() {
      this.userlists()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.formInline = {}
    },
    handPay(row) {
      row.sendMsgLoading = true
      this.$confirm('此操作将推送支付单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          getManual({
            type: 'Payment',
            orderId: row.id,
          })
            .then((response) => {
              if (response.code == '200') {
                this.$message({
                  type: 'success',
                  message: '推送支付单成功!',
                })
                this.userlists()
                row.sendMsgLoading = false
              }
              this.dialogVisiblePay = false
            })
            .catch(() => {
              row.sendMsgLoading = false
            })
        })
        .catch(() => {
          row.sendMsgLoading = false
        })
    },
    handOrder(row) {
      row.sendMsgLoading_one = true
      // console.log(row.id, 'row6666666')
      this.$confirm('此操作将推送订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          getManual({
            type: 'Order',
            orderId: row.id,
          })
            .then((response) => {
              if (response.code == '200') {
                this.$message({
                  type: 'success',
                  message: '推送订单成功!',
                })
                this.userlists()
                row.sendMsgLoading_one = false
              }
              this.dialogVisiblePay = false
            })
            .catch((error) => {
              row.sendMsgLoading_one = false
              this.$message.error(error.errmsg)
            })
        })
        .catch(() => {
          row.sendMsgLoading_one = false
        })
    },
    //获取状态数据
    getSelect() {
      selectStatus().then((response) => {
        // console.log(response.data, 'woshi/order/order/status的数据 ')
        for (let ind in response.data) {
          const list = {
            key: ind,
            name: response.data[ind],
          }
          // console.log(this.selectList, '==========')
          this.selectList.push(list)
        }
      })
    },
    //获取订单下拉数据状态
    getrecordstatus() {
      getStatus().then((response) => {
        // console.log(response, '6666666611111')
        for (let index in response.data) {
          // console.log(index, '--------')
          const list = {
            value: response.data[index],
            name: index,
          }
          this.recordstatuslist.push(list)
        }
        // this.statusList = response.data
        // console.log(this.statusList,'=======');
      })
    },
    change() {
      this.$forceUpdate()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.userlists()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.userlists()
    },
    handleDetail(row) {
      this.$router.push({
        path: '/pushManagement/order-details',
        query: {
          id: row.id,
        },
      })
      this.dialogVisible = true
    },
  },
}
</script>

<style lang='scss'>
.container {
  padding: 20px;
  // min-width: 800px;
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
  }
}

.pagination-container {
  background: #ffffff;
  padding: 10px 0;
  margin: 20px;
}
</style>
