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
          label="商品税号:"
          prop="taxCode"
        >
          <el-input
            v-model="formInline.taxCode"
            placeholder="请输入商品税号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="商品类目:"
          prop="taxHsName"
        >
          <el-input
            v-model="formInline.taxHsName"
            placeholder="请输入商品类目"
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
        <p>CC类目列表</p>
      </div>
      <div style>
        <el-table
          ref="multipleTable"
          :data="prohibitedList"
          tooltip-effect="dark"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50px"
          ></el-table-column>F
          <el-table-column
            label="商品税号"
            prop="taxCcCode"
            align="center"
          >

          </el-table-column>
          <el-table-column
            prop="taxHsName"
            label="商品类目"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="unit"
            label="单位"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="priceAfterTax"
            label="完税价格RMB(元)"
            align="center"
            width="160px"
          >
          </el-table-column>
          <el-table-column
            prop="ccTaxNew"
            label="新税率15%30%60%三档"
            align="center"
            width="160px"
          >
            <!-- <template slot-scope="scope">
            <span>{{scope.row.ccTaxNew+'%'}}</span>
            
          </template> -->
          </el-table-column>
          <el-table-column
            prop="ccTaxOld"
            label="旧税率10%20%30%50%三档"
            align="center"
            width="180px"
          >
            <!-- <template slot-scope="scope">
            <span>{{scope.row.ccTaxOld+'%'}}</span>
          </template> -->
          </el-table-column>
          <el-table-column
            prop="unitCode"
            label="单位代码"
            align="center"
          >
          </el-table-column>

          <el-table-column
            prop="remark"
            label="备注"
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
            label="商品税号"
            prop="taxCcCode"
          >
            <el-input
              v-model="form.taxCcCode"
              placeholder="请输入商品税号"
              maxlength="11"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'')"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="商品类目"
            prop="taxHsName"
          >
            <el-input
              type="textarea"
              autosize
              v-model="form.taxHsName"
              placeholder="请输入商品类目"
              maxlength="32"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="单位"
            prop="unit"
          >
            <el-input
              v-model.number="form.unit"
              placeholder="请输入单位"
              maxlength="10"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'')"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="完税价格"
            prop="priceAfterTax"
          >
            <el-input
              v-model.number="form.priceAfterTax"
              placeholder="请输入完税价格"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="新税率"
            prop="ccTaxNew"
          >
            <el-input
              v-model.number="form.ccTaxNew"
              placeholder="请输入完税价格"
              type="number"
            ></el-input>
            <!-- <el-select
              v-model="form.ccTaxNew"
              clearable
              placeholder="请选择新税率"
            >
              <el-option
                v-for="item in newTax"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item
            label="旧税率"
            prop="ccTaxOld"
          >
            <el-input
              v-model.number="form.ccTaxOld"
              placeholder="请输入完税价格"
              type="number"
            ></el-input>
            <!-- <el-select
              v-model="form.ccTaxOld"
              clearable
              placeholder="请选择旧税率"
            >
              <el-option
                v-for="item in oldTax"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> -->
          </el-form-item>

          <el-form-item
            label="单位代码"
            prop="unitCode"
          >
            <el-input
              v-model.number="form.unitCode"
              placeholder="请输入单位代码"
              maxlength="10"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'')"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              type="textarea"
              :rows="2"
              v-model="form.remark"
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="title=='添加CC商品类目及税号'"
              type="warning"
              @click="addquarters('form')"
            >确定</el-button>
            <el-button
              v-if="title=='修改CC商品类目及税号'"
              type="success"
              @click="editquarters('form')"
            >确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

  </div>
</template>

<script>
// import { channelLists, channeladd, channeledit } from '@/api/channel'
import {
  getAdd,
  getDelete,
  getExport,
  getDataList,
  importRestrict,
  exportRestrict,
  getEdit,
} from '@/api/cc.js'
import { dateFormat } from '@/utils/validate'
import { getToken, removeToken } from '@/utils/auth'
// import { channelList } from "@/api/commodity-record";

import { username, validEmail, validphone } from '@/utils/validate'
export default {
  name: 'ccCategory',
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
        taxCode: '',
        taxHsName: '',
      },
      dialogVisible: false,
      newTax: [
        {
          value: 0,
          label: '15%',
        },
        {
          value: 1,
          label: '30%',
        },
        {
          value: 2,
          label: '60%',
        },
      ],
      oldTax: [
        {
          value: 0,
          label: '10%',
        },
        {
          value: 1,
          label: '20%',
        },
        {
          value: 2,
          label: '30%',
        },
        {
          value: 3,
          label: '50%',
        },
      ],
      form: {
        ccTaxNew: '',
        ccTaxOld: '',
        priceAfterTax: '',
        remark: '',
        taxCcCode: '',
        taxHsName: '',
        unit: '',
        unitCode: '',
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      title: '',
      dltitle: '',
      disabled: true,
      textarea: '',
      sels: [], //被选中的记录数据-----对应“批量删除”传的参数值
      addOrEdit: 'add',
      prohibitedList: [],
      selectedData: [],
      multipleSelection: [],
      sels: [], //选中显示的值
      uploadLoading: false,
      optionsType: [],
      rules: {
        taxCcCode: [
          {
            required: true,
            message: '请输入商品税号',
            trigger: 'blur',
          },
        ],
        taxHsName: [
          {
            required: true,
            message: '请输入商品类目',
            trigger: 'blur',
          },
        ],
        unit: [
          {
            required: true,
            message: '请输入单位',
            trigger: 'blur',
          },
        ],
        priceAfterTax: [
          {
            required: true,
            message: '请输入完税价格',
            trigger: 'blur',
          },
        ],
        ccTaxNew: [
          {
            required: true,
            message: '请输入新税率',
            trigger: 'blur',
          },
        ],
        ccTaxOld: [
          {
            required: true,
            message: '请输入旧税率',
            trigger: 'blur',
          },
        ],
        unitCode: [
          {
            required: true,
            message: '请输入单位代码',
            trigger: 'blur',
          },
        ],
        remark: [
          {
            required: true,
            message: '请输入备注',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    // this.userlists()
    // this.getrestricttype()
    this.getList()
  },
  methods: {
    getList() {
      // console.log(this.formInline)
      getDataList({
        taxCode: this.formInline.taxCode,
        taxHsName: this.formInline.taxHsName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((response) => {
          if (response.code == '200') {
            // console.log(response, 'cC数据')
            this.prohibitedList = response.data.dataList
            this.total = response.data.total
          }
        })
        .catch((error) => {
          // this.$message.error(error.errmsg);
        })
    },
    search() {
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      location.reload()
    },
    add() {
      this.title = '添加CC商品类目及税号'
      this.form = {
        ccTaxNew: '',
        ccTaxOld: '',
        priceAfterTax: '',
        remark: '',
        taxCcCode: '',
        taxHsName: '',
        unit: '',
        unitCode: '',
      }

      this.dialogVisible = true
    },
    handleEdit(row) {
      this.title = '修改CC商品类目及税号'
      this.form = row
      // this.form.contrabandType = this.form.contrabandType.toString()
      this.dialogVisible = true
    },

    addquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getAdd(this.form)
            .then((response) => {
              if (response.code == '200') {
                this.dialogVisible = false
                this.getList()
              }
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

    editquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getEdit(this.form)
            .then((response) => {
              if (response.code == '200') {
                this.$message({
                  type: 'success',
                  message: '修改成功',
                })
                this.dialogVisible = false
                this.getList()
              }
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
    // 导出接口
    exportPicture() {
      window.open(
        process.env.VUE_APP_BASE_API +
          '/ccTax/importTem/export?token=' +
          getToken()
      )
    },

    exportExcel() {
      this.exportPicture()
    },

    deleteOpen(row) {
      const params = {
        id: row.id,
      }
      // console.log(params)
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        getDelete(params)
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
         if (response.code == '200') {
          this.$message({
            type: 'success',
            message: response.data,
          })
        }else{
          this.$message({
            type: 'error',
            message: response.data,
          })
        }
        this.getList()
        const blob = new Blob([response])
        const fileName = '错误数据.xlsx'
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          return
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

    // 上传文件个数超过定义的数量
    action() {
      return 'http://192.168.0.147:9502/ccTax/import' //
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`)
    },
    uploadFile(item) {
      // console.log(item)

      const fileObj = item.file // FormData 对象

      const form = new FormData() // 文件对象 这里像后端传参数，file是上传文件，其它是其它参数
      form.append('file', fileObj)

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
  // min-width: 700px;
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
