<template>
  <el-container>
    <el-aside class="main-left" width="260px">
      <div class="headerImg" style="margin-top: 25px;">
        <img src="http://localhost:8080/profile/upload/2022/10/02/1664810282134.jpg"
             width="105" height="105">

      </div>
      <span>erewrew</span>
      <div class="" style="margin-top: 20px">
        <span>作品: lsklkfldsfkld <br/></span>
        <span>日期: 2019-09-10 <br/></span>
        <span>IP: 127.0.0.1</span>
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
                  placeholder="作品描叙"
        />
      </div>
      <div class="call_comment" style="text-align: left;font-size: 12px; margin-top:8px;">
        <span>回复评价</span>
        <el-divider/>
      </div>
      <div class="from-data" style="text-align: center;">
        <el-form size="small" style="font-size: 12px;">
          <el-form-item style="width: 350px;" label="用户名">
            <el-input style="width: 250px;" readonly/>
          </el-form-item>
          <el-form-item label="Email" style="width: 350px;">
            <el-input style="width: 250px;" readonly/>
          </el-form-item>
          <el-form-item label="回复内容" style="width: 340px;">
            <el-input type="textarea" placeholder="请输入内容"
                      style="width: 250px; font-size: 12px;" :autosize="{ minRows: 5, maxRows: 10}"
                      v-model="textarea"
            />
          </el-form-item>
          <el-form-item style="text-align: left;margin-left: 80px;">
            <el-button type="primary" icon="el-icon-search" size="mini">确定</el-button>
          </el-form-item>
        </el-form>

      </div>
      <div class="call_comment" style="text-align: left;font-size: 12px; margin-top:8px;">
        <span v-html="'全部评论: ' + total"></span>
        <el-divider/>
      </div>
      <el-table :data="commentDetailList" style="font-size: 12px;"  :show-header="false">
        <el-table-column align="left" width="200px;">
          <template slot-scope="scope">
            <div class="headerImg" text-align="left" style="margin-top: 25px;">
              <img :src="scope.row.userUrl"  width="105" height="105">
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <div v-html="scope.row.nickName"/>
            <span v-if="scope.row.remark != null">
              <div v-html="'回复' + scope.row.nickName + ':' + scope.row.remark "/>
            </span>
            <div v-html="scope.row.createDate +' <a>隐藏</a>  <a>删除</a>'"/>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="queryDetailParams.pageNum" :limit.sync="queryDetailParams.pageSize"
                  @pagination="getDetailList"
      />
    </el-main>
  </el-container>
</template>

<script>
import {getDetailPage} from "@/api/biz/opus-comment/comment";

export default {
  name: "commentDetailList",
  props: {
    opusId: {
      type: Number,
      default: null
    },
    /*nickName:{
      type: String,
      default: null
    }*/
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
      title: ""
    }
  },
  created() {
    //this.textarea = "";
    this.getDetailList();
  },
  methods: {
    getDetailList() {
      console.log("this.opusId:" + this.opusId);
      if (this.opusId != null) {
        this.queryDetailParams.opusId = this.opusId;
        getDetailPage(this.queryDetailParams).then(response => {
          this.commentDetailList = response.rows;
          this.total = response.total;
        })
      }
    },

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
