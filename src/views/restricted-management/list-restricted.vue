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
          label="类型:"
          prop="contrabandType"
        >
          <el-select
            v-model="formInline.contrabandType"
            clearable
            placeholder="请选择类型"
          >
            <el-option
              v-for="item in optionsType"
              :key="item.name"
              :label="item.value"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="描述:"
          prop="contrabandDesc"
        >
          <el-input
            v-model="formInline.contrabandDesc"
            clearable
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            @click="search"
            round
          >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-upload
            class='image-uploader'
            :multiple='false'
            :auto-upload='true'
            list-type='text'
            :show-file-list='false'
            :before-upload="beforeUpload"
            action='action()'
            :on-exceed="handleExceed"
            :http-request="uploadFile"
          >
            <el-button
              size="small"
              :loading="uploadLoading"
              icon="el-icon-upload2"
              type="primary"
              round
            >导入</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-download"
            @click="exportExcel"
            round
          >导入模板下载</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            @click="add"
            round
          >添加</el-button>
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
        <p>限制品列表</p>
      </div>
      <div style>
        <el-table
          ref="multipleTable"
          :data="prohibitedList"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="序号"
            width="120"
            type="index"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="contrabandType"
            label="类型"
            align="center"
          >
            getrecordstatu
            <template slot-scope="scope">{{ getrecordstatu(scope.row.contrabandType) }}</template>
          </el-table-column>
          <el-table-column
            prop="contrabandDesc"
            label="描述"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="adminName"
            label="创建人"
            align="center"
          >
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
              >修改</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteOpen(scope.row)"
              >删除</el-button>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-button
          type="primary"
          size="small"
          @click="removeBatch()"
          :disabled="this.sels.length === 0||this.disabled"
        >批量删除</el-button>
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
            label="类型"
            prop="contrabandType"
          >
            <el-select
              v-model="form.contrabandType"
              placeholder="请选择类型"
            >
              <el-option
                v-for="item in optionsType"
                :key="item.name"
                :label="item.value"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="物品描述"
            prop="contrabandDesc"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入物品描述"
              v-model="form.contrabandDesc"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="title=='新增进出境物品'"
              type="warning"
              @click="addquarters('form')"
            >确定</el-button>
            <el-button
              v-if="title=='编辑物品'"
              type="success"
              @click="editquarters('form')"
            >确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <!-- 分页 -->
  </div>
</template>

<script>
import {
  addRestrict,
  delRestrict,
  editRestrict,
  exportRestrict,
  importRestrict,
  getRestrict,
  restrictType,
} from '@/api/restrict'
import { dateFormat } from '@/utils/validate'
import { getToken, removeToken } from '@/utils/auth'
// import { channelList } from "@/api/commodity-record";

import { username, validEmail, validphone } from '@/utils/validate'
export default {
  name: 'listRestricted',
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
      formInline: {
        contrabandDesc: '',
        contrabandType: '',
      },
      dialogVisible: false,
      form: {
        contrabandDesc: '',
        contrabandType: '',
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      title: '',
      dltitle: '',
      disabled: true,
      sels: [], //被选中的记录数据-----对应“批量删除”传的参数值
      addOrEdit: 'add',
      prohibitedList: [],
      selectedData: [],
      multipleSelection: [],
      sels: [], //选中显示的值
      uploadLoading: false,
      optionsType: [],
      rules: {
        contrabandType: [
          {
            required: true,
            message: '请输入类型',
            trigger: 'blur',
          },
        ],
        contrabandDesc: [
          {
            required: true,
            message: '请输入请输入物品描述',
            trigger: 'blur',
          },
          // { min: 5, max: 40, message: '请输入5-40字！', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    // this.userlists()
    this.getrestricttype()
    this.getList()
  },
  methods: {
    getList() {
      // console.log(this.formInline)
      getRestrict({
        contrabandDesc: this.formInline.contrabandDesc,
        contrabandType: this.formInline.contrabandType,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((response) => {
          if (response.code == '200') {
            console.log(response, '违禁数据')
            this.prohibitedList = response.data.dataList
            this.total = response.data.total
          }
        })
        .catch((error) => {
          // this.$message.error(error.errmsg);
        })
    },
    handleEdit(row) {
      this.title = '编辑物品'
      this.form = row
      this.form.contrabandType = this.form.contrabandType.toString()
      this.dialogVisible = true
    },

    editquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editRestrict(this.form)
            .then((response) => {
              this.$message({
                type: 'success',
                message: '修改成功!',
              })
              this.dialogVisible = false
              this.getList()
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
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
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    search() {
      this.getList()
    },
    add() {
      this.title = '新增进出境物品'
      this.form = {
        contrabandDesc: '',
        contrabandType: '',
        // decription: '',
        // mapLat: '',
        // mapLon: '',
        // name: '',
        // phone: ''
      }

      this.dialogVisible = true
    },

    addquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.form)

          addRestrict(this.form)
            .then((response) => {
              this.$message({
                type: 'success',
                message: '添加成功!',
              })
              // console.log(response)
              this.dialogVisible = false
              this.getList()
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    deleteOpen(row) {
      const params = {
        ids: row.id,
      }
      // console.log(params)
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delRestrict(params)
          .then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.getList()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      })
    },

    exportExcel() {
      this.exportPicture()
    },
    getrecordstatu(id) {
      for (let index = 0; index < this.optionsType.length; index++) {
        const element = this.optionsType[index]
        if (element.name == id) {
          return element.value
        }
      }
    },
    getrestricttype() {
      restrictType()
        .then((response) => {
          // console.log(response, '类型')
          for (var p in response.data) {
            // 遍历json对象的每个key/value对,p为key
            const list = {
              value: response.data[p],
              name: p,
              // value: p,
              // name: response.data[p]
            }
            // console.log(list, 'list')
            this.optionsType.push(list)
          }
        })
        .catch((error) => {
          // this.$message.error(error.errmsg);
        })
    },

    //选中数据
    handleSelectionChange(sels) {
      this.sels = sels
      //遍历选中的数组
      for (let prohibitedList of this.sels) {
        this.disabled = false
      }
      let length = this.sels.length
    },
    removeBatch() {
      let ids = this.sels.map((item) => item.id).join()
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delRestrict({
            ids: ids,
          }).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getList()
    },

    // excel 导入
    beforeUpload(file) {
      this.uploadLoading = false //判断文件格式
      const isText = file.type === 'application/vnd.ms-excel'
      const isTextComputer =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!(isText || isTextComputer)) {
        this.openMessage('数据导入必须为excel文件xls或者xlsx格式', 'error')
        this.uploadLoading = false
        return false
      }
    },
    // 导入接口
    importPicture(form) {
      importRestrict(form).then((response) => {
        this.$message({
          type: 'success',
          message: response.data,
        })
        this.getList()
        const blob = new Blob([response])
        const fileName = '错误数据.xlsx'
        if ('download' in document.createElement('a')) {
          // 非IE下载
          return
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    },
    // 导出接口
    exportPicture() {
      window.open(
        process.env.VUE_APP_BASE_API +
          '/cont/excel/template/export?token=' +
          getToken()
      )
    },

    // 上传文件个数超过定义的数量
    action() {
      return 'http://192.168.0.147:9502/cont/excel/template/import' //
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`)
    },
    uploadFile(item) {
      // console.log(item)

      const fileObj = item.file // FormData 对象

      const form = new FormData() // 文件对象 这里像后端传参数，file是上传文件，其它是其它参数
      form.append('importFile ', fileObj)

      // form.append("importType", this.formData.importType);

      // console.log(JSON.stringify(form))
      this.importPicture(form)
    },
  },
}
</script>

<style lang='scss' >
.container {
  padding: 20px;
  // min-width: 600px;
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
      color: rgb(36, 53, 65);
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
.el-tooltip__popper {
  font-size: 14px;
  max-width: 20%;
}

.pagination-container {
  background: #ffffff;
  padding: 10px 0;
  margin: 20px;
}
</style>
