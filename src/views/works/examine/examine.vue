<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-card>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="作品信息" name="worksInfo">
            <el-row>
              <el-col :span="8">
                <el-form-item label="作品发布人" prop="author">
                  <el-select v-model="form.author" :disabled="true"  placeholder="请选择作品发布人">
                    <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                               :value="item.userId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="名称">
                  <el-input readonly  v-model="form.name"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="QQ">
                  <el-input v-model="form.qq"/>
                </el-form-item>
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="微信">
                  <el-input v-model="form.wechat"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机">
                  <el-input v-model="form.mobile"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="作品介绍">
                  <editor v-model="form.remark" :min-height="192"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="作品素材" name="picInfo">
            <el-col :span="24">
              <el-form-item label="图片" prop="depositImg">
                <div class="imgs"  v-show="imgsShow">
                  <u v-for="src of form.depositImgs" class="oneImage">
                    <img :src="src" :width="146" :height="146">
                  </u>
                </div>
              </el-form-item>

            </el-col>
            <el-col :span="24">
              <el-form-item label="视频" prop="depositVideo">
                <VideoUpload v-model="form.depositVideo" :limit='2'></VideoUpload>
              </el-form-item>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="定价信息" name="priceInfo">
            <el-col :span="24">
              <el-form-item prop="free">
                <input type="checkbox" value="free" v-model="freeBox" @change="priceCheckboxChange('free')"/> 免费
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="free">
                <input type="checkbox" value="charge" v-model="chargeBox" @change="priceCheckboxChange('charge')"/> 全部收费
                <el-input :disabled="priceDisabled" v-model="form.price" style="width: 400px;padding-left: 40px"
                          placeholder="设置作品售价"/>
              </el-form-item>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="云盘信息" name="netdiskInfo">
            <el-row>
              <el-col :span="24">
                <el-form-item label="网盘连接">
                  <el-input v-model="form.networkUrl" readonly/>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="网盘提取码">
                  <el-input v-model="form.networkCode" readonly/>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="解压码">
                  <el-input v-model="form.zipCode"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-form>

    <div slot="footer" class="dialog-footer" style="text-align: right;padding-top: 10px">
      <el-button type="primary" @click="submitForm">审核通过</el-button>
      <el-button @click="cancelDialog">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {getOpus,updateState,examinePage} from "@/api/biz/opus-examine/examine";
import {allUserList} from "@/api/system/user";

export default {
  name: "addWorks",
  props: {
    cancel: {
      type: Function,
      default: null
    },
    worksId: {
      type: Number,
      default: null
    },
    opType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      activeTab: "worksInfo",
      submitButton: true,
      uploadImgShow: true,
      imgsShow: false,
      userList: [],
      form: {},
      freeBox: true,
      partFreeBox: false,
      chargeBox: false,
      freeNumDisabled: true,
      freeNumPriceDisabled: true,
      priceDisabled: true,
      rules: {}
    }
  },
  created() {
    if (this.opType == "view") {
      this.submitButton = false;
      this.uploadImgShow = false;
      this.imgsShow = true;

    }
    if (this.worksId != null) {
      getOpus(this.worksId).then(response => {
        this.form = response.data;
      })
    }
    this.getAllUserList();
  },
  methods: {
    priceCheckboxChange(type) {
      if (type == "free") {
        this.partFreeBox = false;
        this.chargeBox = false;
        this.form.price = "";
        this.priceDisabled = true;
      } else {
        this.freeBox = false;
        this.partFreeBox = false;
        this.freeNumDisabled = true;
        this.freeNumPriceDisabled = true;
        this.priceDisabled = false;
        this.form.freeNum = "";
        this.form.freeNumPrice = "";
      }
    },
   getList() {
     this.$emit('examineCancel');
     /* examinePage(this.queryParams, this.dateRange).then(response => {
          this.worksList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );*/
    },
    getAllUserList() {
      let queryParams = {bizType: 3};
      allUserList(queryParams).then(response => {
          this.userList = response.data;
        }
      );
    },
    getWorksInfo() {

    },

    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.worksId != null) {
            updateState(this.worksId).then(response => {
              this.$modal.msgSuccess("审核通过");
              this.cancelDialog();
              this.$emit('examineCancel');
              //parent.location.reload();
            });
          }
        }
      });
    },
    cancelDialog() {
      this.cancel();
    }
  }
}
</script>
<style>
 .oneImage{
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  margin: 0 8px 8px 0;
  display: inline-block;

}
</style>
