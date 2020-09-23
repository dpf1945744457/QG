<template>
  <div class="container">
    <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
      </div>
      <el-form
        :model="formInline"
        ref="formInline"
        class="demo-ruleForm"
        :inline="true"
      >
        <el-form-item
          label="企业名称:"
          prop="merchantName"
        >
          <el-input
            v-model="formInline.merchantName"
            placeholder="请输入企业名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="提交人:"
          prop="creatorName"
        >
          <el-input
            v-model="formInline.creatorName"
            placeholder="请输入提交人"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="审核人:"
          prop="reviewerName"
        >
          <el-input
            v-model="formInline.reviewerName"
            placeholder="请输入审核人"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="审核状态"
          prop="status"
        >
          <el-select
            v-model="formInline.status"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in recordstatuslist"
              :key="item.name"
              :label="item.value"
              :value="item.name"
              :disabled="item.value==='待审核'?false:true"
              clearable
            >
              <!-- disabled="item.value == '退回' || '审核通过'|| '审核不通过'" -->
            </el-option>

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
            @click="onSubmit('formInline')"
            icon="el-icon-search"
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
        <p>商家列表</p>
        <!--右边按钮  -->
        <div class="tools-right">
          <!-- <el-button
            type="primary"
            class="tools-button"
            @click="addSystem"
          >
            <i class="el-icon-circle-plus-outline"></i> 添加
          </el-button> -->
        </div>
        <!--<el-button type="primary" icon="el-icon-circle-plus" size="small">搜索</el-button>-->
      </div>
      <div class="tw_form">
        <el-table
          :data="merchantList"
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
            prop="merchantName"
            label="企业名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="legalPersonName"
            label="法人姓名"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="creatorName"
            label="提交人"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="status"
            label="审核状态"
            align="center"
          >
            <template slot-scope="scope">{{ getrecordstatu(scope.row.status) }}</template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="reviewerName"
            label="审核人"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="reviewTime"
            label="审核时间"
            align="center"
            width="95px"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.reviewTime.length>0">
                {{scope.row.reviewTime}}
              </span>
              <span v-else>{{""}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="400"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="auditShop(scope.row)"
              >审核</el-button>
              <el-button
                type="success"
                size="small"
                @click="details(scope.row)"
              >详情</el-button>
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
        :title="dltitle"
        :visible.sync="dialogVisible"
        width="800px"
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
            label="企业名称"
            prop="merchantName"
          >
            <el-input
              v-model="form.merchantName"
              placeholder="请输入企业名称"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="企业税号"
            prop="merchantTaxCode"
          >
            <el-input
              v-model="form.merchantTaxCode"
              placeholder="请输入企业税号"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="加密KEY"
            prop="encryptKey"
          >
            <el-input
              v-model="form.encryptKey"
              placeholder="请输入加密KEY"
              :readonly='readonly'
            ></el-input>
          </el-form-item>

          <el-form-item
            label="商品备案回调url"
            prop="goodsRecordBackUrl"
          >
            <el-input
              v-model="form.goodsRecordBackUrl"
              placeholder="请输入商品备案回调url"
              :readonly='readonly'
            ></el-input>
          </el-form-item>

          <el-form-item
            label="订单报关回调url"
            prop="orderReportBackUrl"
          >
            <el-input
              v-model="form.orderReportBackUrl"
              placeholder="请输入订单报关回调url"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="法人姓名"
            prop="legalPersonName"
          >
            <el-input
              v-model="form.legalPersonName"
              placeholder="请输入法人姓名"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="法人身份证"
            prop="legalPersonIdCard"
          >
            <el-input
              v-model="form.legalPersonIdCard"
              placeholder="请输入法人身份证"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="工商注册地址"
            prop="companyAddress"
          >
            <el-input
              v-model="form.companyAddress"
              placeholder="请输入工商注册地址"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="经营范围"
            prop="businessScope"
          >
            <!-- <el-input
              v-model="form.businessScope"
              placeholder="例如：计算机软件、计算机信息系统软件开发"
            ></el-input> -->
            <el-input
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 2}"
              placeholder="例如：服装、鞋帽、化妆品、母婴产品"
              v-model="form.businessScope"
              :readonly='readonly'
              maxlength="300"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item label="企业经营类别">
            <el-checkbox-group
              v-model="form.businessType"
              :disabled="isDisabled"
            >
              <!-- <el-checkbox label="1">电商商户</el-checkbox>
              <el-checkbox label="2">电商平台</el-checkbox>
              <el-checkbox label="3">电商代理企业</el-checkbox> -->
              <el-checkbox
                v-for="type in types"
                :label="type.id"
                :key="type.id"
              >{{type.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label="联系人"
            prop="contactName"
          >
            <el-input
              v-model="form.contactName"
              placeholder="请输入联系人"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="contactPhone"
          >
            <el-input
              v-model="form.contactPhone"
              placeholder="请输入联系电话"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系地址"
            prop="contactAddress"
          >
            <el-input
              v-model="form.contactAddress"
              placeholder="请输入联系地址"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系人邮箱"
            prop="contactMail"
          >
            <el-input
              v-model="form.contactMail"
              placeholder="请输入联系地址"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="网站名称"
            prop="webSiteName"
          >
            <el-input
              v-model="form.webSiteName"
              placeholder="请输入网站名称"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="网址"
            prop="webSiteAddress"
          >
            <el-input
              v-model="form.webSiteAddress"
              placeholder="请输入网址"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="经营商品"
            prop="businessGoods"
          >
            <el-input
              v-model="form.businessGoods"
              placeholder="例如：服装、鞋帽、化妆品、母婴产品"
              :readonly='readonly'
            ></el-input>

          </el-form-item>
          <el-form-item
            label="海关通道"
            prop="customsChannelsCodes"
          >
            <el-checkbox-group v-model="form.customsChannelsCodes">
              <el-checkbox
                v-for="channel in customsChanneList"
                :label="channel.channelName"
                :key="channel.channelCode"
                :disabled="isDisabled"
              >{{channel.channelName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            v-if=" this.dltitle == '商家审核' || this.dltitle == '商家详情' "
            label="预览图片"
            prop="pics"
            class="change_Img"
          >

            <img
              :src="item"
              v-for="(item,index) in this.form.pics"
              :key="index"
              style="width:148px;height:148px;margin-right:10px"
            >

          </el-form-item>

          <el-form-item
            label="审核状态"
            prop="status"
            v-if="dltitle == '商家详情' "
          >
            <!-- {{ getrecordstatu(form.status) }} -->
            {{ form.statusStr }}
          </el-form-item>
          <el-form-item
            label="审核时间"
            prop="reviewTime"
            v-if="dltitle == '商家详情' "
          >
            <el-input
              v-model="form.reviewTime"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="审核人"
            prop="reviewerName"
            v-if="dltitle == '商家详情'"
          >
            <el-input
              v-model="form.reviewerName"
              :readonly='readonly'
            ></el-input>
          </el-form-item>
          <el-form-item
            label="审核备注"
            prop="reviewRemark"
          >
            <el-input
              type="textarea"
              :rows="4"
              v-model="form.reviewRemark"
              :readonly="dltitle =='商家详情'"
            >
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              v-if="dltitle =='商家审核'"
              type="success"
              @click="pass('form', 2)"
            >审核通过</el-button>
            <el-button
              v-if="dltitle =='商家审核'"
              type="success"
              @click="unPass('form' ,3)"
            >不通过并结束</el-button>
            <el-button
              v-if="dltitle =='商家审核'"
              type="success"
              @click="back('form', 1)"
            >退回修改</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 分页 -->
  </div>
</template>

<script>
import {
  getAuditList,
  addMer,
  editMer,
  getDetailMer,
  auditMer,
  // uploadFile,
  getListStatus,
} from '@/api/business'
import {
  username,
  validEmail,
  validphone,
  dateFormat,
  validURL,
} from '@/utils/validate'
import { channelList } from '@/api/commodity-record'
import { recordstatus } from '@/api/record'
const typeOptions = [
  { name: '电商商户', id: '1' },
  { name: '电商平台', id: '2' },
  { name: '电商代理企业', id: '3' },
]
export default {
  name: 'businessAudit',
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
    //商品备案回调url
    var backUrl = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback(new Error('请输入正确的URL地址'))
      } else if (!validURL(value)) {
        callback(new Error('请输入正确的URL地址'))
      }
      callback()
    }
    return {
      itemForm: {
        bucketName: 'customs',
        expires: '10000',
        perfixName: '2',
      },
      readonly: false,
      isDisabled: false,
      dialogVisibleup: false,
      fd: '', //向服务器进行传递的参数（带有图片formdata）
      formInline: {
        status: '0',
        merchantName: '',
        legalPersonName: '',
        reviewerName: '',
        creatorName: '',
        deta: '',
      },
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      value1: '',
      MenuList: [],
      merchantList: [], // 商家
      customsChanneList: [], //海关通道
      deptCodes: [],

      options: [],
      businessType: [],
      creatorId: [],
      recordstatuslist: [],
      value: '',
      dltitle: '',
      types: typeOptions,
      addOrEdit: 'add',
      form: {
        businessGoods: '', // 经营商品
        businessScope: '', // 业务范围
        businessType: [], // 业经营类型
        companyAddress: '', // 工商注册地址
        contactAddress: '', // 联系地址
        contactMail: '', // 联系邮箱
        contactName: '', // 联系人名称
        contactPhone: '', // 联系电话
        encryptKey: '', // 加密KEY
        goodsRecordBackUrl: '', // 商品备案回调url
        orderReportBackUrl: '', // 订单报关回调url
        customsChannelsCodes1: [],
        // createTime: '', // 创建时间
        // creatorId: '', // 创建人id
        // creatorName: '', // 创建人名称

        customsChannelsIds: [], // 海关通道 关联customs_channels中的id

        // id: '', // ID

        legalPersonIdCard: '', // 法人身份证
        legalPersonName: '', // 法人姓名

        // merchantCode: '', // 商户编码 格式字母加数字

        merchantName: '', // 企业名称
        merchantTaxCode: '', // 企业税号

        pics: [], // 图片集合
        // reviewRemark: '', // 审核备注
        // reviewTime: '', // 审核时间
        // reviewerId: '', // 审核编号
        // reviewerName: '', // 审核人名称
        // status: '', // 商家状态
        // // updateTime: '', // 修改时间

        // webSiteAddress: '', // 网站地址
        // webSiteName: '', // 网站名称

        id: '',
        reviewRemark: '',
        reviewTime: '',
        reviewerId: '',
        reviewerName: '',
        status: 'num',
      },
      rules: {
        merchantName: [
          {
            // 企业名称
            required: true,
            message: '必填、由1-50个中文、英文、数字及字符组成',
            trigger: 'blur',
          },
        ],
        merchantTaxCode: [
          {
            // 企业税号
            required: true,
            message: '必填、由1-18个英文、数字组成',
            trigger: 'blur',
          },
        ],
        legalPersonName: [
          {
            // 法人姓名
            required: true,
            message: '必填、由1-32个字符组成',
            trigger: 'blur',
          },
        ],
        legalPersonIdCard: [
          {
            // 法人身份证
            required: true,
            message: '必填、由1-18个英文、数字字符组成',
            trigger: 'blur',
          },
        ],
        companyAddress: [
          {
            // 工商注册地址
            required: true,
            message: '必填，由1-150个字符组成',
            trigger: 'blur',
          },
        ],
        businessScope: [
          {
            // 业务范围
            required: true,
            message: '必填，由1-150个字符组成',
            trigger: 'blur',
          },
        ],
        businessType: [
          {
            // 业经营类型
            required: true,
            message: '必选',
            trigger: 'change',
          },
        ],
        contactName: [
          {
            // 联系人名称
            required: true,
            message: '必填、由1-32个字符组成',
            trigger: 'blur',
          },
        ],
        contactPhone: [
          {
            // 联系电话
            required: true,
            message: '必填、由1-20个数字字符组成',
            trigger: 'blur',
          },
        ],
        contactAddress: [
          {
            // 联系电话
            message: '选填、由1-150个字符组成',
            trigger: 'blur',
          },
        ],
        contactMail: [
          {
            required: false,
            message: '选填',
            trigger: 'blur',
          },
        ],
        webSiteName: [
          {
            //网站名称
            required: true,
            message: '必填、由1-30个字符组成',
            trigger: 'blur',
          },
        ],
        webSiteAddress: [
          {
            // 网站地址
            required: false,
            message: '请输入小区名称',
            trigger: 'blur',
          },
        ],

        businessGoods: [
          {
            // 经营商品
            required: true,
            message: '必填、由1-150个字符组成',
            trigger: 'blur',
          },
          //          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        customsChannelsIds: [
          {
            // 海关通道
            required: true,
            message: '必填',
            trigger: 'change',
          },
          //          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        // goodsRecordBackUrl: [
        //   {
        //     // 商品备案回调url
        //     required: false,
        //     message: '请填写正确的URL',
        //     validator: backUrl,
        //     trigger: 'change',
        //   },
        // ],
        // orderReportBackUrl: [
        //   {
        //     // 订单报关回调url
        //     required: false,
        //     validator: backUrl,
        //     message: '请填写正确的URL',
        //     trigger: 'change',
        //   },
        // ],
        encryptKey: [
          {
            // KEY
            required: true,
            message: '必填',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    // this.userlists()
    // this.getusergetDeptTree()
    this.getListMerchant()
    this.getChannelList()
    this.getrecordstatus()
    this.getcustomsChannel()
    // this.fileUp()
  },
  methods: {
    getListMerchant() {
      var date = new Date(date)
      let createTimeStar = ''
      let createTimeEnd = ''

      if (this.formInline.deta != '') {
        createTimeStar = dateFormat('YYYY-mm-dd', this.formInline.deta[0])
        createTimeEnd = dateFormat('YYYY-mm-dd', this.formInline.deta[1])
      }
      getAuditList({
        merchantName: this.formInline.merchantName,
        creatorName: this.formInline.creatorName,
        reviewerName: this.formInline.reviewerName,
        status: this.formInline.status,
        createTimeStar: createTimeStar,
        createTimeEnd: createTimeEnd,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((response) => {
          if (response.code == '200') {
            this.merchantList = response.data.dataList
            this.total = response.data.total
            for (let item = 0; item < this.merchantList.length; item++) {
              this.merchantList[item].customsChannelsCodes = JSON.parse(
                this.merchantList[item].customsChannelsCodes
              )
            }
          }
        })
        .catch((error) => {
          // this.$message.error(error.errmsg);
        })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    action() {
      return 'http://192.168.3.175:9502/customs/upload/file'
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
      getListStatus()
        .then((response) => {

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
    // 预览
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 图片上传
    fileUp() {
      // debugger
      uploadFile(this.fd).then((response) => {
        if (response.code == '200') {
          this.$message({
            showClose: true,
            type: 'success',
            message: '设置成功',
          })
          // this.initPage()
        }
        this.pics.push(response.data.fileUrl)
        // this.dialogImageUrl = file.url
      })
    },
    beforeUpload(file) {
      // debugger
      const isJPG =
        file.type == 'image/jpeg' ||
        file.type == 'image/png' ||
        file.type == 'image/gif'
      const isLt2M = file.size / 1024 / 100
      if (!isJPG) {
        this.$message.warning('上传头像图片只能是 JPG/PNG/GIF 格式!')
        return isJPG
      }
      if (!isLt2M) {
        this.$message.warning('上传头像图片大小不能超过 100KB!')
        return isLt2M
      }
      this.multfileImg = file
      // return isJPG && isLt2M
      this.fd = new FormData()
      //   //传其他参数
      this.fd.append('bucketName', this.itemForm.bucketName)
      this.fd.append('expires', this.itemForm.expires)
      this.fd.append('perfixName', this.itemForm.perfixName)
      this.fd.append('upfile', file)
      this.fileUp()
    },
    // successResave(res, file) {
    //   this.itemForm.upfile = URL.createObjectURL(file.raw)
    // },
    //失败钩子
    error(response, file, fileList) {
      console.log(response)
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
      this.getListMerchant()
    },

    onSubmit() {
      this.getListMerchant()
    },
    getcustomsChannel(id) {
      for (let index = 0; index < this.customsChanneList.length; index++) {
        const element = this.customsChanneList[index]
        if (element.channelCode == id) {
          return element.channelName
        }
      }
    },
    // 审核
    auditShop(row) {
      this.dltitle = '商家审核'
      getDetailMer({
        id: row.id,
      }).then((response) => {
        if (response.code == '200') {
          this.form = response.data
          if (typeof response.data.businessType == 'string') {
            response.data.businessType = JSON.parse(response.data.businessType)
          }
          response.data.customsChannelsCodes = row.customsChannelsCodes

          this.form.customsChannelsCodes1 = response.data.customsChannelsCodes
          if (this.form.pics != null) {
            this.form.pics = JSON.parse(this.form.pics)
          }
        }
      })
      this.readonly = true
      // this.isDisabled = true
      this.dialogVisible = true

      // this.dltitle = '商家审核'
      // this.form = row
      // if (typeof row.businessType == 'string') {
      //   row.businessType = JSON.parse(row.businessType)
      //   row.customsChannelsCodes1 = row.customsChannelsCodes
      // }
      // console.log(this.form.pics, 88888888888888)
      // if (this.form.pics != null) {
      //   this.form.pics = JSON.parse(this.form.pics)
      //   console.log(this.form.pics, '666666111111116666')
      // }
      // this.readonly = true
      this.isDisabled = true
      // this.dialogVisible = true
    },
    // 详情
    details(row) {
      this.dltitle = '商家详情'
      getDetailMer({
        id: row.id,
      }).then((response) => {
        if (response.code == '200') {
          this.form = response.data
          if (typeof response.data.businessType == 'string') {
            response.data.businessType = JSON.parse(response.data.businessType)
          }
          response.data.customsChannelsCodes = row.customsChannelsCodes
          this.form.customsChannelsCodes1 = response.data.customsChannelsCodes
          this.form.status = this.form.status.toString()
          if (this.form.pics != null) {
            this.form.pics = JSON.parse(this.form.pics)
          }
        }
      })
      this.readonly = true
      this.isDisabled = true
      this.dialogVisible = true

      //  this.dltitle = '商家详情'
      // this.form = row
      // console.log(this.form, 666666666)
      // this.form.status = this.form.status.toString()
      // if (typeof row.businessType == 'string') {
      //   row.businessType = JSON.parse(row.businessType)
      //   row.customsChannelsCodes1 = row.customsChannelsCodes
      // }
      // if (this.form.pics != null) {
      //   this.form.pics = JSON.parse(this.form.pics)
      // }
      // this.readonly = true
      // this.isDisabled = true
      // this.dialogVisible = true
    },

    // 通过
    pass(formName, num) {
      this.form.businessType = JSON.stringify(this.form.businessType)

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('审核通过?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              const params = {
                id: this.form.id,
                reviewRemark: this.form.reviewRemark,
                reviewTime: this.form.reviewTime,
                reviewerId: this.form.reviewerId,
                reviewerName: this.form.reviewerName,
                status: num,
              }
              auditMer(params)
                .then((response) => {
                  // console.log(response, '这是通过的信息参数+++++++++++++++')
                  this.dialogVisible = false
                  this.$router.push({
                    path: '/businessManagement/business-inquiry',
                  })
                  this.$message({
                    type: 'success',
                    message: '审核成功!',
                  })
                  this.getListMerchant()
                })
                .catch((error) => {
                  console.log(error)
                })
            })
            .catch(() => {
              this.$message({
                type: 'success',
                message: '已取消',
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    unPass(formName, num) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否确认结束该商家的审核流程?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              const params = {
                id: this.form.id,
                reviewRemark: this.form.reviewRemark,
                reviewTime: this.form.reviewTime,
                reviewerId: this.form.reviewerId,
                reviewerName: this.form.reviewerName,
                status: num,
              }
              auditMer(params)
                .then((response) => {
                  // console.log(response, '这是通过的信息参数+++++++++++++++')
                  this.dialogVisible = false
                  this.getListMerchant()
                  this.$router.push({
                    path: '/businessManagement/business-inquiry',
                  })
                  this.$message({
                    type: 'success',
                    message: '已结束!',
                  })
                })
                .catch((error) => {
                  console.log(error)
                })
            })
            .catch(() => {
              this.$message({
                type: 'success',
                message: '已取消',
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    back(formName, num) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确定退回修改吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              const params = {
                id: this.form.id,
                reviewRemark: this.form.reviewRemark,
                reviewTime: this.form.reviewTime,
                reviewerId: this.form.reviewerId,
                reviewerName: this.form.reviewerName,
                status: num,
              }
              auditMer(params)
                .then((response) => {
                  // console.log(response, '这是通过的信息参数+++++++++++++++')
                  this.dialogVisible = false
                  this.getListMerchant()
                  this.$router.push({
                    path: '/businessManagement/business-inquiry',
                  })
                  this.$message({
                    type: 'success',
                    message: '退回成功!',
                  })
                })
                .catch((error) => {
                  console.log(error)
                })
            })
            .catch(() => {
              this.$message({
                type: 'success',
                message: '已取消',
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    handleRemove(file, fileList) {
      console.log(file, fileList)
    },

    getChannelList() {
      channelList().then((response) => {
        this.customsChanneList = response.data
        // console.log(response, '海关')
      })
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.getListMerchant()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getListMerchant()
    },

    // renderTime(row) {
    //   function addDateZero(num) {
    //     return num < 10 ? '0' + num : num
    //   }
    //   let d = new Date(row.reviewTime)
    //   let formatdatetime =
    //     d.getFullYear() +
    //     '-' +
    //     addDateZero(d.getMonth() + 1) +
    //     '-' +
    //     addDateZero(d.getDate()) +
    //     ' ' +
    //     addDateZero(d.getHours() - 8) +
    //     ':' +
    //     addDateZero(d.getMinutes()) +
    //     ':' +
    //     addDateZero(d.getSeconds())
    //   return formatdatetime
    // },
  },
}
</script>
<style lang='scss' >
.container {
  padding: 20px;
  // min-width: 1000px;
}
.container_on {
  padding: 20px;
  // height: 200px;
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
  // margin-top: 30px;
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
  .tw_form {
    box-sizing: border-box;
    .el-table {
      box-sizing: border-box;
      // padding: 0 20px;
    }
  }
}

.pagination-container {
  background: #ffffff;
  padding: 10px 0;
  margin: 20px;
}
</style>
