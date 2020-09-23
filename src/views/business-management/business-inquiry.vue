<template>
  <div class="container">
    <div class="container_on">
      <div class="on_title">
        <p>查询条件</p>
      </div>
      <el-form
        :model="formInline"
        ref="formInline"
        :inline="true"
        class="demo-ruleForm"
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
          label="法人姓名:"
          prop="legalPersonName"
        >
          <el-input
            v-model="formInline.legalPersonName"
            placeholder="请输入法人姓名"
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
          label="海关通道"
          prop="customsChannelsCodes"
        >
          <el-select
            v-model="formInline.customsChannelsCodes"
            placeholder="请选择海关通道"
            clearable
          >
            <el-option
              v-for="item in customsChanneList"
              :key="item.channelCode"
              :label="item.channelName"
              :value="item.channelCode"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="审核状态"
          prop="status"
        >
          <el-select
            v-model="formInline.status"
            placeholder="请选择"
            clearable
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
          label="创建时间:"
          prop="deta"
        >
          <el-date-picker
            v-model="formInline.deta"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="审核时间:"
          prop="detas"
        >
          <el-date-picker
            v-model="formInline.detas"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
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
            icon="el-icon-search"
            @click="add"
            round
          >新增商家</el-button>
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
        </div>
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
            prop="contactName"
            label="联系人"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="contactPhone"
            label="联系电话"
            align="center"
            width="120px"
          ></el-table-column>

          <el-table-column
            prop="customsChannelsCodes"
            label="海关通道"
            align="center"
            width="180px"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span
                v-for="(item,index) in scope.row.customsChannelsCodes"
                :key="index"
              >
                {{item}}
              </span>
            </template>

          </el-table-column>

          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            :formatter="createTime"
            width="95px"
          ></el-table-column>
          <el-table-column
            prop="creatorName"
            label="创建人"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="statusStr"
            label="审核状态"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="reviewerName"
            label="审核人"
            align="center"
          >
          </el-table-column>
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
            width="300"
            align="left"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                v-if="scope.row.statusStr == '审核通过'|| scope.row.statusStr == '审核不通过' ||scope.row.statusStr == '退回'"
                @click="handleEdit(scope.row)"
              >修改</el-button>
              <el-button
                type="success"
                size="small"
                @click="details(scope.row)"
              >详情</el-button>
              <el-button
                type="success"
                size="small"
                v-if="scope.row.statusStr == '审核通过'"
                @click="handleChangde(scope.row)"
              >变更口岸</el-button>
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
              :readonly="this.dltitle == '修改商家' || this.dltitle == '商家详情'||this.dltitle == '修改清关口岸'"
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
            label="商户编码"
            prop="merchantCode"
          >
            <el-input
              v-model="form.merchantCode"
              placeholder="请输入商户编码"
              :readonly="this.dltitle == '修改商家' || this.dltitle == '商家详情'|| this.dltitle == '修改清关口岸'"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="经营范围"
            prop="businessScope"
          >

            <el-input
              type="textarea"
              :rows="3"
              placeholder="例如：计算机软件、计算机信息系统软件开发"
              v-model="form.businessScope"
              :readonly='readonly'
              maxlength="300"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="企业经营类别"
            prop="businessType"
          >
            <el-checkbox-group v-model="form.businessType">
              <el-checkbox
                v-for="type in types"
                :label="type.id"
                :key="type.id"
                :disabled="isDisabled"
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
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'')"
              maxlength="20"
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
              type="textarea"
              :rows="2"
              placeholder="例如：服装、鞋帽、化妆品、母婴产品"
              v-model="form.businessGoods"
              :readonly='readonly'
            >
            </el-input>
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
                :disabled="isDisabled1"
              >{{channel.channelName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item
            v-if=" this.dltitle == '添加商家'||  this.dltitle == '修改商家'"
            label="上传照片"
            prop="pics"
            class="change_Img"
          >
            <el-upload
              class="avatar-uploader"
              v-model="form.pics"
              ref="upload"
              :action="action()"
              :before-upload="beforeUpload"
              :on-preview="handlePictureCardPreview"
              list-type="picture-card"
              :data="itemForm"
              :on-error="error"
              :limit="20"
              :file-list="fileList"
              :show-file-list="true"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-success="handleAvatarSuccess"
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
              >
                1、支持的图片格式：BMP、TIFF、GIF、PNG、JPEG <br>

                2、文件大小应该小于100KB <br>

                3、可一次选择多张照片上传、上传的图片数量最多20张<br>

                4、可上传法人身份证正反面、营业热照等 <br>

              </div>
            </el-upload>
            <el-dialog
              :visible.sync="dialogVisibleUp"
              :modal-append-to-body='false'
              :append-to-body="true"
            >
              <img
                width="100%"
                :src="dialogImageUrl"
                alt=""
              >
              <!-- <div v-if="this.dltitle == '修改商家'">
                <img
                  :src="item"
                  v-for="(item,index) in this.form.pics"
                  :key="index"
                  style="width:148px;height:148px;margin-right:10px"
                >
              </div> -->

            </el-dialog>
          </el-form-item>
          <el-form-item
            v-if=" this.dltitle == '商家详情'|| this.dltitle == '修改清关口岸'"
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
            v-if="dltitle == '商家详情'"
          >
            {{ form.statusStr }}
          </el-form-item>
          <el-form-item
            label="审核时间"
            prop="reviewTime"
            v-if="dltitle == '商家详情'"
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
            v-if="dltitle == '商家详情'"
          >
            <el-input
              v-model="form.reviewRemark"
              :readonly='readonly'
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              v-if="dltitle =='添加商家'"
              type="success"
              @click="addquarters('form')"
            >确定添加</el-button>
            <el-button
              v-if="dltitle=='修改商家'"
              type="success"
              @click="editquarters('form')"
            >确定修改</el-button>
            <el-button
              v-if="dltitle=='修改清关口岸'"
              type="success"
              @click="editquarterss('form')"
            >提交</el-button>
            <!-- <el-button
              v-if=" dltitle=='添加商家'"
              @click="cancel('form')"
            >取消</el-button> -->
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 分页 -->
  </div>
</template>

<script>
import {
  getList,
  addMer,
  editMer,
  getDetailMer,
  auditMer,
  getListStatus,
  // uploadFile
} from '@/api/business'
import { uploadFile } from '@/api/uploadfile'
import {
  username,
  validEmail,
  validphone,
  validTaxe,
  validIdCard,
  validURL,
  validWebsite,
  dateFormat,
} from '@/utils/validate'
// import { recordstatus } from '@/api/record'
import { channelList } from '@/api/commodity-record'
const typeOptions = [
  { name: '电商商户', id: '1' },
  { name: '电商平台', id: '2' },
  { name: '电商代理企业', id: '3' },
]

export default {
  name: 'businessInquiry',
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
    //税号
    var Taxe = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback(new Error('请输入企业税号'))
      } else if (!validTaxe(value)) {
        callback(new Error('请输入正确的企业税号'))
      }
      callback()
    }
    // 身份证
    var IdCard = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback(new Error('请输入手机号码'))
      } else if (!validIdCard(value)) {
        callback(new Error('请输入正确的手机号码'))
      }
      callback()
    }
    // 网址
    var website = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback(new Error('请输入网址'))
      } else if (!validWebsite(value)) {
        callback(new Error('请输入正确的网址'))
      }
      callback()
    }
    return {
      readonly: false,
      isDisabled: false,
      isDisabled1: false,
      formInline: {
        merchantName: '',
        legalPersonName: '',
        reviewerName: '',
        customsChannelsCodes: '',
        statusL: '',
        deta: '',
        detas: '',
      },
      dialogVisible: false,
      dialogVisibleUp: false,
      dialogImageUrl: '',
      customsArray: [],
      itemForm: {
        bucketName: 'customs',
        expires: '604800',
        perfixName: '2',
      },
      fd: '', //向服务器进行传递的参数（带有图片formdata）
      // updateUrl: this.serverUrl + '/userInfo/update',
      // bucketName: [],
      // expires: 66666666,
      // perfixName: '',
      uploadUrl: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      merchantList: [], // 商家
      // statusList: [], //状态
      customsChanneList: [], //海关通道
      deptCodes: [],
      // dList:[],
      recordstatuslist: [],
      dengmiQueryForm: '',
      options: [],
      dltitle: '',
      types: typeOptions,
      fileList: [],
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

        // createTime: '', // 创建时间
        // creatorId: '', // 创建人id
        // creatorName: '', // 创建人名称

        customsChannelsCodes: [], // 海关通道 关联customs_channels中的id
        // id: '', // ID
        customsChannelsCodes1: [],
        legalPersonIdCard: '', // 法人身份证
        legalPersonName: '', // 法人姓名

        merchantCode: '', // 商户编码 格式字母加数字

        merchantName: '', // 企业名称
        merchantTaxCode: '', // 企业税号

        pics: [], // 图片集合
        // reviewRemark: '', // 审核备注
        // reviewTime: '', // 审核时间
        // reviewerId: '', // 审核编号
        // reviewerName: '', // 审核人名称
        status: '', // 商家状态
        // updateTime: '', // 修改时间

        webSiteAddress: '', // 网站地址
        webSiteName: '', // 网站名称
      },
      defaultProps: {
        children: 'roleList',
        label: 'name',
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
            message: '必填、由18个英文、数字组成',
            validator: Taxe,
            trigger: 'blur',
          },
        ],

        legalPersonName: [
          {
            // 法人姓名
            required: true,
            message: '必填、由1-32个字符组成',
            // validator: validateusername,
            trigger: 'blur',
          },
        ],
        legalPersonIdCard: [
          {
            // 法人身份证
            required: true,
            message: '必填、由1-18位数字字符组成',
            validator: IdCard,
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
            message: '必填，由1-300个字符组成',
            trigger: 'blur',
          },
        ],
        businessType: [
          {
            // 业经营类型
            required: true,
            message: '必选',
            trigger: 'blur',
          },
        ],
        contactName: [
          {
            // 联系人名称
            required: true,
            message: '必填、由1-32个字符组成',
            // validator: validateusername,
            trigger: 'blur',
          },
        ],
        contactPhone: [
          {
            // 联系电话
            required: true,
            message: '必填、由1-20个字符组成',
            // validator: phone,
            trigger: 'blur',
          },
        ],
        contactAddress: [
          {
            // 联系地址
            message: '选填、由1-150个字符组成',
            trigger: 'blur',
          },
        ],
        contactMail: [
          {
            //联系邮箱
            message: '请填写正确邮箱',
            // validator: validateemail,
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
            message: '请输入网址名称',
            // validator: website,
            trigger: 'blur',
          },
        ],
        merchantCode: [
          {
            // 商户编码
            required: true,
            message: '请输入编码',
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
        ],
        customsChannelsCodes: [
          {
            // 海关通道
            required: true,
            message: '必填',
            trigger: 'blur',
          },
        ],

        encryptKey: [
          {
            // 海关通道
            required: true,
            message: '必填',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    if (this.$route.query.signL) {
      this.formInline.status = this.$route.query.signL
    }
    this.getListMerchant()
    this.getChannelList()
    this.getrecordstatus()
  },
  methods: {
    getListMerchant() {
      let createTimeStar = ''
      let createTimeEnd = ''
      var date = new Date(date)
      if (this.formInline.deta) {
        createTimeStar = dateFormat('YYYY-mm-dd', this.formInline.deta[0])
        createTimeEnd = dateFormat('YYYY-mm-dd', this.formInline.deta[1])
      }
      let reviewTimeStar = ''
      let reviewTimeEnd = ''
      if (this.formInline.detas ) {
        reviewTimeStar = dateFormat('YYYY-mm-dd', this.formInline.detas[0])
        reviewTimeEnd = dateFormat('YYYY-mm-dd', this.formInline.detas[1])
      }

      getList({
        merchantName: this.formInline.merchantName,
        legalPersonName: this.formInline.legalPersonName,
        reviewerName: this.formInline.reviewerName,
        createTimeStar: createTimeStar,
        createTimeEnd: createTimeEnd,
        customsChannelsCodes: this.formInline.customsChannelsCodes,
        reviewTimeStar: reviewTimeStar,
        reviewTimeEnd: reviewTimeEnd,
        status: this.formInline.status,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((response) => {
          if (response.code == '200') {
            // Merchant list
            this.merchantList = response.data.dataList
            this.total = response.data.total
            for (let item = 0; item < this.merchantList.length; item++) {
              this.merchantList[item].customsChannelsCodes = JSON.parse(
                this.merchantList[item].customsChannelsCodes
              )
            }
            // console.log(this.merchantList)
          }
        })
        .catch((error) => {})
    },
    getrecordstatu(id) {
      //状态
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

    //查询
    onSubmit() {
      this.getListMerchant()
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.formInline = {}
    },
    //添加按钮
    add() {
      this.form = {
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

        // createTime: '', // 创建时间
        // creatorId: '', // 创建人id
        // creatorName: '', // 创建人名称

        customsChannelsCodes: [], // 海关通道 关联customs_channels中的id
        customsChannelsCodes1: [],
        // id: '', // ID

        legalPersonIdCard: '', // 法人身份证
        legalPersonName: '', // 法人姓名

        merchantCode: '', // 商户编码 格式字母加数字

        merchantName: '', // 企业名称
        merchantTaxCode: '', // 企业税号

        pics: [], // 图片集合
        // reviewRemark: '', // 审核备注
        // reviewTime: '', // 审核时间
        // reviewerId: '', // 审核编号
        // reviewerName: '', // 审核人名称
        // status: '', // 商家状态
        // updateTime: '', // 修改时间

        webSiteAddress: '', // 网站地址
        webSiteName: '', // 网站名称
      }
      this.dltitle = '添加商家'
      this.dialogVisible = true
      this.isDisabled = false
      this.isDisabled1 = false
      this.readonly = false
    },
    // 详情
    details(row) {
      this.dltitle = '商家详情'
      getDetailMer({
        id: row.id,
      }).then((response) => {
        this.form = response.data
        if (typeof response.data.businessType == 'string') {
          response.data.businessType = JSON.parse(response.data.businessType)
        }
        response.data.customsChannelsCodes = row.customsChannelsCodes
        this.form.customsChannelsCodes1 = response.data.customsChannelsCodes
        this.form.status = this.form.status.toString()
        this.form.pics = JSON.parse(this.form.pics)
      })
      this.dialogVisible = true
      this.isDisabled1 = true
      this.isDisabled = true
      this.readonly = true
    },
    // 编辑按钮
    handleEdit(row) {
      this.dltitle = '修改商家'
      getDetailMer({
        id: row.id,
      }).then((response) => {
        this.form = response.data
        if (typeof response.data.businessType == 'string') {
          response.data.businessType = JSON.parse(response.data.businessType)
        }
        response.data.customsChannelsCodes = row.customsChannelsCodes

        this.form.customsChannelsCodes1 = response.data.customsChannelsCodes
        this.fileList = []
        if (this.form.pics) {
          for (
            let index = 0;
            index < JSON.parse(this.form.pics).length;
            index++
          ) {
            const element = JSON.parse(this.form.pics)[index]
            let data = {
              url: element,
            }
            this.fileList.push(data)
          }
        }
        this.form.pics = JSON.parse(this.form.pics)
      })

      this.dialogVisible = true
      this.isDisabled = false
      this.readonly = false
    },
    // 增加确认按钮
    addquarters(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let businessType = JSON.stringify(this.form.businessType)
          businessType = JSON.parse(businessType)
          let customsChannelsCodes = []
          for (
            let index = 0;
            index < this.form.customsChannelsCodes.length;
            index++
          ) {
            const element = this.form.customsChannelsCodes[index]
            customsChannelsCodes.push(this.getcustomsChannel(element))
          }
          businessType = JSON.stringify(businessType)
          customsChannelsCodes = JSON.stringify(customsChannelsCodes)
          let pics = []
          for (let index = 0; index < this.fileList.length; index++) {
            const element = this.fileList[index]
            pics.push(element.url)
          }
          this.form.pics = pics
          let data = {
            id: this.form.id,
            createTime: this.form.createTime,
            updateTime: this.form.updateTime,
            merchantCode: this.form.merchantCode,
            merchantName: this.form.merchantName,
            merchantTaxCode: this.form.merchantTaxCode,
            legalPersonName: this.form.legalPersonName,
            legalPersonIdCard: this.form.legalPersonIdCard,
            companyAddress: this.form.companyAddress,
            businessScope: this.form.businessScope,
            businessType: businessType,
            contactName: this.form.contactName,
            contactPhone: this.form.contactPhone,
            contactAddress: this.form.contactAddress,
            contactMail: this.form.contactMail,
            webSiteName: this.form.webSiteName,
            webSiteAddress: this.form.webSiteAddress,
            businessGoods: this.form.businessGoods,
            customsChannelsCodes: customsChannelsCodes,
            pics: JSON.stringify(this.form.pics),
            status: this.form.status,
            statusStr: this.form.statusStr,
            creatorName: this.form.creatorName,
            creatorId: this.form.creatorId,
            reviewerName: this.form.reviewerName,
            reviewerId: this.form.reviewerId,
            reviewTime: this.form.reviewTime,
            reviewRemark: this.form.reviewRemark,
            goodsRecordBackUrl: this.form.goodsRecordBackUrl,
            orderReportBackUrl: this.form.orderReportBackUrl,
            encryptKey: this.form.encryptKey,
          }

          addMer(data)
            .then((response) => {
              if (response.code == '200') {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                })
                this.dialogVisible = false
                this.getListMerchant()
              }
            })
            .catch((error) => {
              // debugger
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getcustomsChannel(id) {
      for (let index = 0; index < this.customsChanneList.length; index++) {
        const element = this.customsChanneList[index]
        if (element.channelName == id) {
          return element.channelCode
        }
      }
    },
    // 编辑确认按钮
    editquarters(formName) {
      // debugger
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let businessType = JSON.stringify(this.form.businessType)
          businessType = JSON.parse(businessType)
          let customsChannelsCodes = []
          for (
            let index = 0;
            index < this.form.customsChannelsCodes.length;
            index++
          ) {
            const element = this.form.customsChannelsCodes[index]
            customsChannelsCodes.push(this.getcustomsChannel(element))
          }
          businessType = JSON.stringify(businessType)
          customsChannelsCodes = JSON.stringify(customsChannelsCodes)
          debugger
          let pics = []
          for (let index = 0; index < this.fileList.length; index++) {
            const element = this.fileList[index]
            pics.push(element.url)
          }
          this.form.pics = pics
          let data = {
            id: this.form.id,
            createTime: this.form.createTime,
            updateTime: this.form.updateTime,
            merchantCode: this.form.merchantCode,
            merchantName: this.form.merchantName,
            merchantTaxCode: this.form.merchantTaxCode,
            legalPersonName: this.form.legalPersonName,
            legalPersonIdCard: this.form.legalPersonIdCard,
            companyAddress: this.form.companyAddress,
            businessScope: this.form.businessScope,
            businessType: businessType,
            contactName: this.form.contactName,
            contactPhone: this.form.contactPhone,
            contactAddress: this.form.contactAddress,
            contactMail: this.form.contactMail,
            webSiteName: this.form.webSiteName,
            webSiteAddress: this.form.webSiteAddress,
            businessGoods: this.form.businessGoods,
            customsChannelsCodes: customsChannelsCodes,
            pics: JSON.stringify(this.form.pics),
            status: this.form.status,
            statusStr: this.form.statusStr,
            creatorName: this.form.creatorName,
            creatorId: this.form.creatorId,
            reviewerName: this.form.reviewerName,
            reviewerId: this.form.reviewerId,
            reviewTime: this.form.reviewTime,
            reviewRemark: this.form.reviewRemark,
            goodsRecordBackUrl: this.form.goodsRecordBackUrl,
            orderReportBackUrl: this.form.orderReportBackUrl,
            encryptKey: this.form.encryptKey,
          }
          editMer(data)
            .then((response) => {
              if (response.code == '200') {
                this.$message({
                  type: 'success',
                  message: '操作成功!',
                })
                this.dialogVisible = false
                this.getListMerchant()
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

       //更改确认按钮
    editquarterss(formName) {
      // debugger
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let businessType = JSON.stringify(this.form.businessType)
          businessType = JSON.parse(businessType)
          let customsChannelsCodes = []
          for (
            let index = 0;
            index < this.form.customsChannelsCodes.length;
            index++
          ) {
            const element = this.form.customsChannelsCodes[index]
            customsChannelsCodes.push(this.getcustomsChannel(element))
          }
          businessType = JSON.stringify(businessType)
          customsChannelsCodes = JSON.stringify(customsChannelsCodes)
          // debugger
          // let pics = []
          // for (let index = 0; index < this.fileList.length; index++) {
          //   const element = this.fileList[index]
          //   pics.push(element.url)
          // }
          // this.form.pics = pics
          let data = {
            id: this.form.id,
            createTime: this.form.createTime,
            updateTime: this.form.updateTime,
            merchantCode: this.form.merchantCode,
            merchantName: this.form.merchantName,
            merchantTaxCode: this.form.merchantTaxCode,
            legalPersonName: this.form.legalPersonName,
            legalPersonIdCard: this.form.legalPersonIdCard,
            companyAddress: this.form.companyAddress,
            businessScope: this.form.businessScope,
            businessType: businessType,
            contactName: this.form.contactName,
            contactPhone: this.form.contactPhone,
            contactAddress: this.form.contactAddress,
            contactMail: this.form.contactMail,
            webSiteName: this.form.webSiteName,
            webSiteAddress: this.form.webSiteAddress,
            businessGoods: this.form.businessGoods,
            customsChannelsCodes: customsChannelsCodes,
            pics: JSON.stringify(this.form.pics),
            status: this.form.status,
            statusStr: this.form.statusStr,
            creatorName: this.form.creatorName,
            creatorId: this.form.creatorId,
            reviewerName: this.form.reviewerName,
            reviewerId: this.form.reviewerId,
            reviewTime: this.form.reviewTime,
            reviewRemark: this.form.reviewRemark,
            goodsRecordBackUrl: this.form.goodsRecordBackUrl,
            orderReportBackUrl: this.form.orderReportBackUrl,
            encryptKey: this.form.encryptKey,
          }
          editMer(data)
            .then((response) => {
              if (response.code == '200') {
                console.log(response,'2222222222222222222222');
                this.$message({
                  type: 'success',
                  message: '操作成功!',
                })
                this.dialogVisible = false
                this.getListMerchant()
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

    //变更按钮
    handleChangde(row) {
      this.dltitle = '修改清关口岸'

      getDetailMer({
        id: row.id,
      }).then((response) => {
        this.form = response.data
        if (typeof row.businessType == 'string') {
          response.data.businessType = JSON.parse(response.data.businessType)
        }
        response.data.customsChannelsCodes = row.customsChannelsCodes

        this.form.customsChannelsCodes1 = response.data.customsChannelsCodes
        this.form.pics = JSON.parse(this.form.pics)
      })
      this.isDisabled = true
      this.isDisabled1 = false
      this.readonly = true
      this.dialogVisible = true
    },
    handleClose(done) {
      // this.dialogVisible = false
      this.$confirm('确认关闭？')
        .then((_) => {
          this.$refs['form'].resetFields()
          done()
        })
        .catch((_) => {})
      this.fileList = []
      this.getListMerchant()
    },

    // 上传接口
    action() {
      // return 'http://192.168.3.192:9502/customs/upload/file'
      return 'http://192.168.0.147:9502/customs/upload/file'
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisibleUp = true
      // console.log(file)
    },
    // 图片接口
    fileUp() {
      uploadFile(this.fd).then((response) => {
        if (response.code == '200') {
          this.$message({
            showClose: true,
            type: 'success',
            message: '添加成功',
          })

          // let data = {
          //   url: response.data.fileUrl,
          // }
          // this.fileList.push(data)
          // this.form.pics.push(response.data.fileUrl)

          this.$nextTick(() => {
            let data = {
              url: response.data.fileUrl,
            }
            this.fileList.push(data)
            if (this.fileList.length >= 20) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: '上传照片限制在20张,该张数已经是最大值,不能在加了!',
              })
            }
            // console.log(this.fileList.length, '000000')
          })
        }
      })
    },
    //上传钩子
    beforeUpload(file) {
      const isJPG =
        file.type == 'image/jpeg' ||
        file.type == 'image/png' ||
        file.type == 'image/gif'
      const isLt2M = file.size / 1024 < 100
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
    handleAvatarSuccess(res, file) {
      this.itemForm.upfile = URL.createObjectURL(file.raw)
    },
    beforeRemove(index, fileList) {},
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    error(response, file, fileList) {
      console.log(response)
    },
    getchannel(id) {
      for (let index = 0; index < this.customsChanneList.length; index++) {
        const element = this.customsChanneList[index]
        if (element.value == id) {
          return element.name
        }
      }
    },
    //海关
    getChannelList() {
      channelList()
        .then((response) => {
          this.customsChanneList = response.data
          let ChanneList = []
          for (let index = 0; index < this.customsChanneList.length; index++) {
            ChanneList.push(this.customsChanneList[index])
          }
        })
        .catch((error) => {
          // this.$message.error(error.errmsg);
        })
    },
    change() {
      this.$forceUpdate()
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.getListMerchant()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getListMerchant()
    },

    createTime(row) {
      return row.createTime
    },
  },
}
</script>

<style lang='scss' >
.container {
  padding: 20px;
  // min-width: 1200px;
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
}

// span {
//   display: block;
//   text-align: right;
//   padding-right: 5px;
// }

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

.avatar-uploader .el-upload {
  border: 0px #ffffff;
  max-height: 148px;
  max-width: 148px;
  width: auto;
  height: auto;
}

.myNote {
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>

