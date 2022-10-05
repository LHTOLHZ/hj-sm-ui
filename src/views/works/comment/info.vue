<template>
  <el-container>
    <el-aside class="main-left" width="260px">
      <div class="headerImg" style="margin-top: 25px;">
        <img :src="commentInfo.userUrl"
             width="105" height="105">

      </div>
      <div v-html="commentInfo.userName"></div>
      <div style="margin-top: 20px">
        <div v-html="'作品:' + commentInfo.name"/>
        <div v-html="'日期:' + commentInfo.createDate"/>
        <!--        <div v-html="'IP:' + commentInfo.ip"/>-->
      </div>
    </el-aside>
    <el-main class="main-right">
      <div class="V_100" style="text-align: left;font-size: 12px;">
        <span>回复 1000</span> <span style="margin-left: 30px;">阅读 10000</span>
        <el-divider></el-divider>
      </div>
      <div style="margin-bottom: 5px;">
        <el-input type="textarea"
                  :autosize="{ minRows: 5, maxRows: 20}"
                  placeholder="作品描叙" v-model="commentInfo.remark"
                  readonly
        >
        </el-input>
      </div>
      <div class="call_comment" style="text-align: left;font-size: 12px; margin-top:8px;">
        <span>回复评价</span>
        <el-divider/>
      </div>
      <div class="from-data" style="text-align: center;">
        <el-form size="small" style="font-size: 12px;">
          <el-form-item style="width: 350px;" label="用户名">
            <el-input style="width: 250px;" v-model="this.userInfo.nickName" readonly/>
          </el-form-item>
          <el-form-item label="Email" style="width: 350px;">
            <el-input style="width: 250px;" v-model="this.userInfo.email" readonly/>

          </el-form-item>
          <el-form-item label="回复内容" style="width: 340px;">
            <el-input type="textarea" id="infoRemark" placeholder="请输入内容,字数限制50字以内"
                      oninput="if(value.length > 50) value=value.slice(0,50)"
                      style="width: 250px; font-size: 12px;" :autosize="{ minRows: 5, maxRows: 10}"
                      v-model="textarea"
            />

          </el-form-item>
          <el-form-item style="text-align: left;margin-left: 80px;">
            <el-button type="primary" icon="el-icon-search" @click="submitInfo()" size="mini">确定</el-button>
            <el-input name="id" type="hidden" v-model="this.commentInfo.id"/>
          </el-form-item>
        </el-form>

      </div>
      <div class="call_comment" style="text-align: left;font-size: 12px; margin-top:8px;">
        <span v-html="'全部评论: ' + total"></span>
        <el-divider/>
      </div>
      <el-table :data="commentDetailList" style="font-size: 12px;" :show-header="false">
        <el-table-column align="left" width="200px;">
          <template slot-scope="scope">
            <div class="headerImg" text-align="left" style="margin-top: 25px;">
              <img :src="scope.row.userUrl" width="105" height="105">
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <div v-html="scope.row.nickName"/>
            <span v-if="scope.row.remark != null">
              <div v-html="'回复' + scope.row.nickName + ':' + scope.row.remark "/>
            </span>
            <div>
              <span v-html="scope.row.createDate"/>

              <a v-if="scope.row.view > 0" @click="updateViewStatus(scope.row,0)"
                 style="margin-left:3px;margin-right: 3px;">隐藏</a>
              <a v-if="scope.row.view < 1" @click="updateViewStatus(scope.row,1)"
                 style="margin-left:3px;margin-right: 3px;">显示</a>
              <a @click="delByCommentCode(scope.row)">删除</a>
            </div>


            <!--            <div v-html="scope.row.createDate +' <a>隐藏</a>' + ' <a @click=“delByCommentCode(scope.row)”></a>'"/>-->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="queryDetailParams.pageNum"
                  :limit.sync="queryDetailParams.pageSize"
                  @pagination="getDetailList"
      />
    </el-main>
  </el-container>
</template>

<script>
import {
  getDetailPage,
  getCommentInfo,
  getLogUserInfo,
  infoSubmit,
  changeViewStatus
} from "@/api/biz/opus-comment/comment";
import {MessageBox} from "element-ui";
import {deleteComment} from "../../../api/biz/opus-comment/comment";

export default {
  name: "commentDetailList",
  props: {
    opusId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: true,
      total: 0,
      showSearch: true,
      queryDetailParams: {
        delFlag: 1,
        main: 1,
        pageNum: 1,
        pageSize: 10,
        code: undefined,
        state: undefined,
        superior: undefined,
        opusId: undefined
      },
      commentDetailList: [],
      textarea: "",
      title: "",
      commentInfo: {},
      userInfo: {},
    }
  },
  created() {
    this.getDetailList();
    this.getInfo();
    this.getUserInfo();
  },
  methods: {
    getDetailList() {
      if (this.opusId != null) {
        this.queryDetailParams.opusId = this.opusId;
        getDetailPage(this.queryDetailParams).then(response => {
          this.commentDetailList = response.rows;
          this.total = response.total;
        })
      }
    },
    getInfo() {
      if (this.opusId != null) {
        getCommentInfo(this.opusId).then(response => {
          this.commentInfo = response.data;
        })
      }
    },
    getUserInfo() {
      getLogUserInfo().then(response => {
        this.userInfo = response.data;
      })
    },
    submitInfo() {
      const length = this.textarea.length;
      const content = this.textarea;
      console.log("length===>" + content);
      if (length < 3) {
        this.$modal.msgSuccess("评论信息不能小于三个字符");
        return;
      }
      MessageBox.confirm("确定要添加评论?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log("ok");
        infoSubmit(this.opusId, this.textarea).then(response => {
          this.$modal.msgSuccess("添加成功");
          this.getDetailList();
          this.textarea = "";
        });
      })
        .catch(() => false);
    },
    delByCommentCode(row) {
      console.log("delByCommentCode===>" + row.commentCode);
      this.$msgbox.confirm("确定删除评论").then(() => {
        deleteComment(row.commentCode).then(response => {
          this.$modal.msgSuccess("删除成功");
          this.getDetailList();
        });

      }).catch(() => false);
    },
    updateViewStatus(row, view) {
      console.log("delByCommentCode===>" + row.commentCode);
      const msg = (view == 0) ? "隐藏" : "显示";
      this.$msgbox.confirm("确定" + msg + "该评论").then(() => {
        changeViewStatus(row.commentCode, view).then(response => {
          this.$modal.msgSuccess(msg + "成功");
          this.getDetailList();
        });

      }).catch(() => false);
    }
  }
}
</script>
<style>
.headerImg {
  border-radius: 100%;
  overflow: hidden;
  margin: 0 auto;
  width: 100px;
  height: 100px;
  border: 1px solid #e1e1e1;
}

.main-left {
  background: #f3f3f3;
  background: #ffffff;
  border-style: solid;
  border-width: 1px;
  border-color: #dcdfe6;
  width: 260px;
  height: 700px;
  text-align: center;
  font-size: 12px;
}

.main-right {
  background: #f3f3f3;
  background: #ffffff;
  border-style: solid;
  border-width: 1px;
  border-color: #dcdfe6;
  height: 700px;
  text-align: center;
}
</style>
