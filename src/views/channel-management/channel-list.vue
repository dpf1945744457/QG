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
          label="通道名称:"
          prop="channelName"
        >
          <el-input
            v-model="formInline.channelName"
            placeholder="请输入通道名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="联系人:"
          prop="contacterName"
        >
          <el-input
            v-model="formInline.contacterName"
            placeholder="请输入联系人"
            clearable
          ></el-input>
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
            class="tools-button"
            @click="addSystem"
            round
          >
            <i class="el-icon-circle-plus-outline"></i> 添加
          </el-button>
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
        <p>通道列表</p>
        <!--右边按钮  -->
        <div class="tools-right">

        </div>
        <!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
      </div>
      <div style>
        <el-table
          :data="systemList"
          class="table"
          border
        >
          <!-- <el-table-column prop="id" label="ID" ></el-table-column> -->
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="channelName"
            label="通道名称"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="contacterName"
            label="联系人"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="contacterPhone"
            label="联系电话"
            align="center"
          ></el-table-column>
          <!-- <el-table-column prop="servicePlatform" label="服务平台" align="center"></el-table-column> -->
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="channelCode"
            label="清关通道Code"
            align="center"
            width="120px"
          ></el-table-column>
          <el-table-column
            prop="updateTime"
            label="修改时间"
            align="center"
            width="120px"
          ></el-table-column>
          <el-table-column
            prop="servicePlatform"
            label="服务平台"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="windowPlatform"
            label="通道窗口平台"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status==1">开启</span>
              <span v-if="scope.row.status==0">关闭</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="handleEdits(scope.row)"
              >详情</el-button>
              <!-- <el-button
                v-if="scope.row.recordStatus!=1&&scope.row.recordStatus!=4"
                type="text"
                size="small"
                @click="resetPassword(scope.row)"
              >备案</el-button>-->
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
        :title="title"
        :visible.sync="dialogVisible"
        width="500px"
        :before-close="handleClose"
        @close="closeDialog"
        :close-on-click-modal="false"
      >
        <el-form
          ref="form"
          :model="form"
          label-width="140px"
          label-position="left"
          :rules="rules"
        >
          <el-form-item
            label="清关通道名称"
            prop="channelName"
          >
            <el-input
              v-model="form.channelName"
              placeholder="清关通道名称"
              :disabled="addOrEdit =='details'"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系人名称"
            prop="contacterName"
          >
            <el-input
              v-model="form.contacterName"
              placeholder="联系人名称"
              :disabled="addOrEdit =='details'"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系人电话"
            prop="contacterPhone"
          >
            <el-input
              v-model="form.contacterPhone"
              placeholder="联系人电话"
              :disabled="addOrEdit =='details'"
              maxlength="11"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            label="清关通道Code"
            prop="channelCode"
          >
            <el-input
              v-model="form.channelCode"
              placeholder="清关通道Code"
              :disabled=" this.addOrEdit != 'add' "
            ></el-input>
          </el-form-item>
          <el-form-item
            label="扩展表表名"
            prop="detailTableName"
            v-if="addOrEdit=='add' || addOrEdit=='edit'"
          >
            <el-input
              v-model="form.detailTableName"
              placeholder="扩展表表名"
              :disabled="addOrEdit =='details' || addOrEdit =='edit'"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="服务平台"
            prop="servicePlatform"
          >
            <el-input
              v-model="form.servicePlatform"
              placeholder="服务平台"
              :disabled="addOrEdit =='details'"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="窗口平台"
            prop="windowPlatform"
          >
            <el-input
              v-model="form.windowPlatform"
              placeholder="服务平台"
              :disabled="addOrEdit =='details'"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="状态"
            prop="status"
          >
            <!-- <el-select v-model="form.status" placeholder="请选择状态">
              <el-option label="关闭" value="0"></el-option>
              <el-option label="开启" value="1"></el-option>
            </el-select>-->
            <el-radio
              v-model="form.status"
              label="1"
              :disabled="addOrEdit =='details'"
            >开启</el-radio>
            <el-radio
              v-model="form.status"
              label="0"
              :disabled="addOrEdit =='details'"
            >关闭</el-radio>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              v-if="addOrEdit !='details'"
            >保存</el-button>
            <!-- <el-button @click="dialogVisible = false">关闭</el-button> -->
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <!-- 分页 -->
  </div>
</template>

<script>
import { channelLists, channeladd, channeledit } from '@/api/channel'
import { dateFormat } from '@/utils/validate'
// import { channelList } from "@/api/commodity-record";

import { username, validEmail, validphone } from '@/utils/validate'
export default {
  name: 'channelList',
  data() {
    var phone = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback(new Error('请输入手机号码'))
      } else if (!validphone(value)) {
        callback(new Error('请输入正确的手机号码'))
      }
      callback()
    }
    return {
      formInline: { channelName: '', contacterName: '' },
      //				platform: '',
      //				platformOptions: [],
      dialogVisible: false,
      form: {
        channelName: '',
        contacterName: '',
        contacterPhone: '',
        detailTableName: '',
        servicePlatform: '',
        status: 0,
        windowPlatform: '',
        channelCode: '',
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      title: '',
      addOrEdit: 'add',
      deatildata: [],
      systemList: [],
      rules: {
        channelName: [
          {
            required: true,
            message: '请输入清关通道名称',
            trigger: 'blur',
          },
        ],
        contacterPhone: [
          {
            required: true,
            message: '请输入联系人电话',
            trigger: 'blur',
          },
        ],
        contacterName: [
          {
            required: true,
            message: '请输入联系人名称',
            trigger: 'blur',
          },
        ],
        detailTableName: [
          {
            required: true,
            message: '请输入扩展表表名',
            trigger: 'blur',
          },
        ],
        servicePlatform: [
          {
            required: true,
            message: '请输入服务平台',
            trigger: 'blur',
          },
        ],
        windowPlatform: [
          {
            required: true,
            message: '请输入窗口平台',
            trigger: 'blur',
          },
        ],
        contacterPhone: [
          {
            required: true,
            validator: phone,
            trigger: 'blur',
          },
        ],
        channelCode: [
          {
            required: true,
            message: '请输入清关通道Code',
            trigger: 'blur',
          },
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
      },
    }
  },
  created() {
    this.userlists()
  },
  methods: {
    addSystem() {
      this.dialogVisible = true
      this.addOrEdit = 'add'
      this.title = '添加通道'
      this.form = {
        channelName: '',
        contacterName: '',
        contacterPhone: '',
        detailTableName: '',
        servicePlatform: '',
        status: '1',
        windowPlatform: '',
      }
    },

    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          //		      	编辑

          if (this.addOrEdit == 'edit') {
            channeledit(this.form)
              .then((response) => {
                if (response.code == '200') {
                  this.$message({
                    message: '编辑成功',
                    type: 'success',
                  })
                  this.dialogVisible = false
                  this.userlists()
                }
              })
              .catch((error) => {
                console.log(error)
              })
          }
          //		      	新增
          else if (this.addOrEdit == 'add') {
            channeladd(this.form)
              .then((response) => {
                if (response.code == '200') {
                  this.$message({
                    message: '新增成功',
                    type: 'success',
                  })
                  this.dialogVisible = false
                  this.userlists()
                }
              })
              .catch((error) => {
                console.log(error)
              })
          }
        } else {
          return false
        }
      })
    },
    userlists() {
      // console.log(this.formInline)
      channelLists({
        channelName: this.formInline.channelName,
        contacterName: this.formInline.contacterName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((response) => {
          if (response.code == '200') {
            // console.log(response, 'response')
            this.systemList = response.data.dataList
            this.total = response.data.total
          }
        })
        .catch((error) => {
          // this.$message.error(error.errmsg);
        })
    },

    search() {
      this.userlists()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    handleEdit(row) {
      this.form = row
      this.form.status = this.form.status.toString()
      this.dialogVisible = true
      this.addOrEdit = 'edit'
      this.title = '编辑通道'
      //
      // this.form = row;
    },
    handleEdits(row) {
      this.form = row
      this.form.status = this.form.status.toString()
      this.dialogVisible = true
      this.addOrEdit = 'details'
      this.title = '通道详情'

      //
      // this.form = row;
    },
    closeDialog() {
      // 点击关闭 数据重置
      this.$refs['form'].resetFields()
    },
    handleClose(done) {
      // this.dialogVisible = false
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
      this.userlists()
    },

    resetPassword(row) {
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
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch(() => {})
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

<style lang='scss' scope>
.container {
  padding: 20px;
  // min-width: 700px;
}
.el-form-item__label {
  text-align: right !important;
}
.container_on {
  padding: 20px;
  // min-width: 1200px;

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
