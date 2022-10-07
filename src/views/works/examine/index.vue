<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="输入搜索" prop="code">
        <el-input v-model="queryParams.code" placeholder="作品名称\作品编号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="examineList">
      <el-table-column label="编号" align="center" prop="code" :show-overflow-tooltip="true"/>
      <el-table-column label="作品封面" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover" min-width="70" height="70"/>
        </template>
      </el-table-column>
      <el-table-column label="作品名称/关键字" align="left">
        <template slot-scope="scope">
          <div v-html="scope.row.name + '<br/>'+ '关键字:' + scope.row.keyword">
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="作品名称/关键词" align="center" prop="keyword" :show-overflow-tooltip="true" /> -->
      <el-table-column label="价格" align="center" prop="price" :show-overflow-tooltip="true"/>
      <el-table-column label="审核状态" align="center" prop="code">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.works_audit_status" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)"
                     >查看
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)"
                     >审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" v-if="open" width="1000px" append-to-body>
      <info :cancel="cancel" :worksId="worksId" :opType="opType"/>
    </el-dialog>

    <el-dialog  :title="title" :visible.sync="examineOpen" v-if="examineOpen" width="1000px" append-to-body >
      <examine :cancel="examineCancel"  :worksId="worksId" :opType="examineType"/>
    </el-dialog>


  </div>
</template>

<script>
import info from "./info";
import examine from "./examine";
import {examinePage} from "../../../api/biz/opus-examine/examine";

export default {
  name: "examineList",
  dicts: ['works_audit_status'],
  components: {info, examine},
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
      examineList: [],
      open: false,
      examineOpen:false,
      title: "",
      worksId: undefined,
      opType: "view",
      examineType:"view"
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      examinePage(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.examineList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },


    handleView(row) {
      this.title = '作品详情';
      this.open = true;
      this.worksId = row.id;


    },

    handleEdit(row) {
      this.title = '审核';
      this.examineOpen = true;
      this.worksId = row.id;
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
    examineCancel(){
      this.examineOpen = false;
      this.handleQuery();
    }
  }
}
</script>
