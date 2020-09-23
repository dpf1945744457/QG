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
          label="商品名称:"
          prop="goodsName"
        >
          <el-input
            v-model="formInline.goodsName"
            clearable
            placeholder="商品名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="商品序号:"
          prop="goodsNo"
        >
          <el-input
            v-model="formInline.goodsNo"
            clearable
            placeholder="商品序号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="企业名称:"
          prop="merchantName"
        >
          <el-input
            v-model="formInline.merchantName"
            clearable
            placeholder="企业名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="备案状态:"
          prop="recordStatus"
        >
          <el-select
            v-model="formInline.recordStatus"
            clearable
            placeholder="请选择备案状态"
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
          label="海关通道:"
          prop="channelId"
        >
          <el-select
            v-model="formInline.channelId"
            clearable
            placeholder="请选择海关通道"
          >
            <el-option
              v-for="item in channellist"
              :key="item.id"
              :label="item.channelName"
              :value="item.id"
            ></el-option>
          </el-select>
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
        <p>备案列表</p>
        <!--右边按钮  -->
        <!-- <div class="tools-right">
          <el-button type="primary" class="tools-button" @click="addSystem">
            <i class="el-icon-circle-plus-outline"></i> 添加
          </el-button>
        </div>-->
        <!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
      </div>
      <div style="">
        <el-table
          :data="systemList"
          class="table"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50px"
          ></el-table-column>
          <el-table-column
            prop="goodsNo"
            label="商品序号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="customsChannelName"
            label="海关通道名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="goodsName"
            label="商品名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="goodsPrice"
            label="价格"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="unit"
            label="计量单位"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="merchantCode"
            label="企业编码"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="merchantName"
            label="企业名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="recordFailRemark"
            label="备案失败原因"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="recordStatusStr"
            label="备案状态"
            align="center"
          >
            <!-- <template slot-scope="scope">{{ getrecordstatu(scope.row.recordStatus) }}</template> -->
          </el-table-column>
          <el-table-column
            prop="recordTime"
            label="备案时间"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="left"
          >
            <template slot-scope="scope">
              <el-button
                type="success"
                size="small"
                @click="handleEdit(scope.row)"
              >详情</el-button>
              <el-button
                v-if="scope.row.recordStatus!=1&&scope.row.recordStatus!=4&&scope.row.recordStatus!=2"
                type="success"
                size="small"
                v-loading="scope.row.sendMsgLoading"
                @click="resetPassword(scope.row)"
              >备案</el-button>
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
        title="商品备案详情"
        :visible.sync="dialogVisible"
        width="800px"
        @close="closeDialog"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form
          ref="form"
          :model="form"
          label-position="left"
          style="padding: 10px"
        >
          <el-form-item
            v-for="(item,index) in deatildata "
            :key="index"
            :label="item.value.desc"
            label-position="left"
            label-width="150px"
            style="width:49%;display: inline-block;"
            :class="item.value.required==1?'redItem':''"
          >
            <el-input
              type="textarea"
              v-model="item.value.value"
              autosize
              readonly
              style="width:200px"
              class="resizeNone"
            ></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-button @click="dialogVisible = false">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <!-- 分页 -->
  </div>
</template>

<script>
import { recordList, recordstatus, recordids, recorddeatil } from '@/api/record'
import { dateFormat } from '@/utils/validate'
import { channelList } from '@/api/commodity-record'

import { username, validEmail, validphone } from '@/utils/validate'
import { log } from 'util'
export default {
  name: 'commodityRecord',
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
        goodsName: '',
        goodsNo: '',
        merchantName: '',
        recordStatus: '',
        channelId: '',
        deta: '',
      },
      //				platform: '',
      //				platformOptions: [],
      dialogVisible: false,
      form: {
        account: '',
        code: '',
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      channellist: [],
      deatildata: [],
      systemList: [],
      recordstatuslist: [],
      rules: {
        fieldName: [{ required: true, message: '年龄不能为空' }],
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
      this.formInline.recordStatus = this.$route.query.signL
    }
    this.userlists()
    this.getchannelList()
    this.getrecordstatus()
  },
  methods: {
    getchannelList() {
      channelList()
        .then((response) => {
          this.channellist = response.data
        })
        .catch((error) => {
          // this.$message.error(error.errmsg);
        })
    },
    getrecordstatu(id) {
      for (let index = 0; index < this.recordstatuslist.length; index++) {
        const element = this.recordstatuslist[index]
        if (element.name == id) {
          return element.value
        }
      }
    },
    getrecordstatus() {
      recordstatus()
        .then((response) => {
          // console.log(response)
          for (var p in response.data) {
            // 遍历json对象的每个key/value对,p为key
            const list = {
              value: response.data[p],
              name: p,
            }
            this.recordstatuslist.push(list)
          }
        })
        .catch((error) => {
          // this.$message.error(error.errmsg);
        })
    },
    userlists() {
      let endDate = ''
      let startDate = ''
      if (this.formInline.deta) {
        startDate = dateFormat('YYYY-mm-dd', this.formInline.deta[0])
        endDate = dateFormat('YYYY-mm-dd', this.formInline.deta[1])
      }
      recordList({
        channelId: this.formInline.channelId,
        endDate: endDate,
        goodsName: this.formInline.goodsName,
        goodsNo: this.formInline.goodsNo,
        merchantName: this.formInline.merchantName,
        recordStatus: this.formInline.recordStatus,
        startDate: startDate,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((response) => {
          if (response.code == '200') {
            this.systemList = response.data.dataList
            if (this.systemList.length) {
              this.systemList.map((item) => {
                this.$set(item, 'sendMsgLoading', false)
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
    closeDialog() {
      // 点击关闭 数据重置
      this.$refs['form'].resetFields()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
      this.getchannelList()
    },

    search() {
      this.userlists()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.formInline = {}
    },

    handleEdit(row) {
      recorddeatil(row.id)
        .then((response) => {
          // console.log(response, 66666666)
          this.deatildata = []
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index]
            for (var p in element) {
              // 遍历json对象的每个key/value对,p为key
              const list = {
                value: element[p],
                name: p,
              }
              this.deatildata.push(list)
              // console.log(this.deatildata, 333333333333333)
            }
          }
          this.dialogVisible = true
          //  this.userlists();
        })
        .catch((error) => {
          console.log(error)
        })

      //
      // this.form = row;
    },

    resetPassword(row) {
      row.sendMsgLoading = true
      this.$confirm('确定商品备案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          recordids(row.id)
            .then((response) => {
              this.$notify({
                type: 'success',
                title: '提示',
                message: '商品备案成功',
                duration: 1000,
              })
              this.userlists()
              row.sendMsgLoading = false
            })
            .catch((error) => {
              row.sendMsgLoading = false
              console.log(error)
            })
        })
        .catch(() => {
          row.sendMsgLoading = false
        })
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

<style lang='scss' >
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
.redItem .el-form-item__label {
  color: red;
}
.pagination-container {
  background: #ffffff;
  padding: 10px 0;
  margin: 20px;
}
.resizeNone{
   .el-textarea__inner{ 
         resize: none;  
     }
     
 }
</style>
