<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="输入搜索" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="关键字/作品名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="用户昵称" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="用户昵称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="commentList">
      <el-table-column label="编号" align="center" prop="commentCode" :show-overflow-tooltip="true"/>
      <el-table-column label="用户昵称" align="center" prop="userName">

      </el-table-column>
      <el-table-column label="作品名称" align="center" prop="name"/>
      <el-table-column label="评论" align="left" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div v-html="scope.row.remark"/>
        </template>
      </el-table-column>

      <el-table-column label="IP" align="center" prop="ip">
      </el-table-column>
      <el-table-column label="是否显示" align="center">
        <template slot-scope="scope">
          <el-switch v-model.number="scope.row.view" :active-value="1" :inactive-value="0"
                     @change="handleSelectedChange(scope.row)"></el-switch>
        </template>
      </el-table-column>


      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)"
                     v-hasPermi="['biz:opus:view']">查看
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDelete(scope.row)"
                     v-hasPermi="['biz:opus:edit']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" v-if="open" width="1000px" append-to-body>
      <info :cancel="cancel" :opusId="opusId" :opType="opType"/>
    </el-dialog>


  </div>
</template>

<script>
import {commentPage, changeViewStatus,deleteComment} from "@/api/biz/opus-comment/comment";
import info from "./info";
export default {
  name: "commentList",
  dicts: ['works_audit_status'],
  components: {info},
  data() {
    return {
      loading: true,
      total: 0,
      showSearch: true,
      queryParams: {
        delFlag: 1,
        main: 1,
        pageNum: 1,
        pageSize: 10,
        code: undefined,
        state: undefined,
        superior: undefined
      },
      // 日期范围
      dateRange: [],
      commentList: [],
      open: false,

      title: "",
      commentId: undefined,
      opusId:undefined,
      opType: "view"
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      commentPage(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.commentList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },

    handleView(row) {
      this.title = '查看';
      this.open = true;
      this.opusId = row.id;
    },

    handleEdit(row) {
      this.title = '审核';
      /* this.examineOpen = true;*/
      this.commentId = row.id;
    },
    handleDelete(row){
      this.$modal.confirm('是否确认删除作品评论"' + row.commentCode + '"的数据项？').then(function () {
        return deleteComment(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

    handleSelectedChange(row) {
      console.log('view:===>' + row.view);
      let text = (row.view == 1) ? "显示" : "不显示";
      this.$modal.confirm('确认要设置编号' + row.commentCode + '评论' + text + '吗？').then(function () {
        return changeViewStatus(row.id, row.view);
      }).then(() => {
        this.$modal.msgSuccess("设置" + text + "成功");
      }).catch(function () {
        row.view = row.view == 1 ? 1 : 0;
      });
    },

    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    cancel() {
      this.open = false;
      this.handleQuery();
    },
    examineCancel() {
      this.examineOpen = false;
      this.handleQuery();
    }
  }
}
</script>
