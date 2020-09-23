<template>
  <div class="container">
    <div class="container_tw">
      <div class="tw_title">
        <p>税费限额查询</p>
      </div>
      <div style>
        <el-table
          ref="multipleTable"
          :data="dataSet"
          tooltip-effect="dark"
        >
          <el-table-column
            prop="customsType"
            label="清关模式"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="singleLimit"
            label="包裹单笔限额RMB（元）"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="yearLimit"
            label="年度限额RMB"
            align="center"
          >
          </el-table-column>

          <el-table-column
            prop="taxCalculateFormula"
            label="税金计算公式"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="nounExplanation"
            label="名称解释"
            align="center"
            :show-overflow-tooltip="true"
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
            label="清关模式"
            prop="customsType"
          >
            <el-input
              v-model="form.customsType"
              placeholder="请输入清关模式"
              :disabled="this.title = '税费限额修改'"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="包裹单笔限额RMB"
            prop="singleLimit"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入包裹单笔限额RMB"
              v-model="form.singleLimit"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="年度限额RMB"
            prop="yearLimit"
          >
            <el-input
              v-model="form.yearLimit"
              placeholder="请输入年度限额RMB"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="税金计算公式"
            prop="taxCalculateFormula"
            :show-overflow-tooltip="true"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入税金计算公式"
              v-model="form.taxCalculateFormula"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="名称解释"
            prop="nounExplanation"
            :show-overflow-tooltip="true"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入名称解释"
              v-model="form.nounExplanation"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="title=='税费限额修改'"
              type="warning"
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
// import { channelLists, channeladd, channeledit } from '@/api/channel'
import { getDataList, getEdit } from '@/api/quota'
import { dateFormat } from '@/utils/validate'
// import { channelList } from "@/api/commodity-record";

import { username, validEmail, validphone } from '@/utils/validate'
export default {
  name: 'taxInquiry',
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
      dataSet: [],
      selectedData: [],
      multipleSelection: [],
      sels: [], //选中显示的值
      uploadLoading: false,
      optionsType: [],
      rules: {
        customsType: [
          {
            required: true,
            message: '请输入清关模式',
            trigger: 'blur',
          },
        ],
        singleLimit: [
          {
            required: true,
            message: '请输入包裹单笔限额RMB',
            trigger: 'blur',
          },
        ],
        yearLimit: [
          {
            required: true,
            message: '请输入年度限额RMB',
            trigger: 'blur',
          },
        ],
        taxCalculateFormula: [
          {
            required: true,
            message: '请输入税金计算公式',
            trigger: 'blur',
          },
        ],
        nounExplanation: [
          {
            required: true,
            message: '请输入名称解释',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // console.log(this.formInline)
      getDataList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((response) => {
          if (response.code == '200') {
            // console.log(response, '限额数据') //Data set
            this.dataSet = response.data.dataList
            this.total = response.data.total
          }
        })
        .catch((error) => {
          // this.$message.error(error.errmsg);
        })
    },

    editquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getEdit(this.form)
            .then((response) => {
              this.$message({
                type: 'success',
                message: '操作成功!',
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

    search() {
      this.getList()
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
      this.getList()
    },

    handleEdit(row) {
      this.title = '税费限额修改'
      this.form = row
      // this.form.contrabandType = this.form.contrabandType.toString()
      this.dialogVisible = true
      // this.addOrEdit = 'edit'

      //
      // this.form = row;
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
      this.uploadLoading = true //判断文件格式
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
        const blob = new Blob([response])
        const fileName = '错误数据.xlsx'
        if ('download' in document.createElement('a')) {
          // 非IE下载
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
      window.open(process.env.VUE_APP_BASE_API1 + '/cont/excel/template/export')
    },

    // 上传文件个数超过定义的数量
    action() {
      return 'http://192.168.3.175:9502/cont/excel/template/import' //
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
