<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="输入搜索" prop="code">
                <el-input v-model="queryParams.code" placeholder="作品名称\作品编号" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="提交时间">
                <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期"
                    end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="审核状态" prop="state">
                <el-select v-model="queryParams.state" placeholder="审核状态" clearable>
                    <el-option v-for="dict in dict.type.works_audit_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上/下架" prop="superior">
                <el-select v-model="queryParams.superior" placeholder="上/下架" clearable>
                    <el-option v-for="dict in dict.type.works_publish_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                </el-select>
            </el-form-item>



            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['biz:opus:add']">新增作品</el-button>
            </el-col>
        </el-row>

        <el-table v-loading="loading" :data="worksList">
            <el-table-column label="编号" align="center" prop="code" :show-overflow-tooltip="true" />
            <el-table-column label="作品封面" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.cover" min-width="70" height="70" />
                </template>
            </el-table-column>
            <el-table-column label="作品名称/关键字" align="left" >
                <template slot-scope="scope">
                     <div v-html="scope.row.name + '<br/>'+ '关键字:' + scope.row.keyword">
                     </div>
                </template>
            </el-table-column>
            <!-- <el-table-column label="作品名称/关键词" align="center" prop="keyword" :show-overflow-tooltip="true" /> -->
            <el-table-column label="价格" align="center" prop="price" :show-overflow-tooltip="true" />
            <el-table-column label="是否上架" align="center">
                <template slot-scope="scope">
                    <el-switch v-model.number="scope.row.superior" :active-value="1" :inactive-value="0" @change="handleSuperiorChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="是否推荐" align="center">
                <template slot-scope="scope">
                    <el-switch v-model.number="scope.row.selected" :active-value="1" :inactive-value="0" @change="handleSelectedChange(scope.row)"></el-switch>
                </template>
            </el-table-column>

          <el-table-column label="销量/收藏/浏览数" align="center" prop="trString" />
            <!-- <el-table-column label="销量/收藏/浏览" align="center" :show-overflow-tooltip="true" /> -->
            <el-table-column label="审核状态" align="center" prop="code">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.works_audit_status" :value="scope.row.state" />
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" >查看</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)" >编辑</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"
        />

        <el-dialog :title="title" :visible.sync="open" v-if="open" width="1000px" append-to-body>
            <addWorks :cancel="cancel" :worksId="worksId" :opType="opType" />
        </el-dialog>
    </div>
</template>

<script>
    import { listOpus, changeSuperiorStatus, changeSelectedStatus, delOpus } from "@/api/biz/opus";
    import addWorks from "./add_works";

    export default {
        name: "worksList",
        dicts: ['works_audit_status', 'works_publish_status'],
        components: { addWorks },
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
                    code:undefined,
                    state:undefined,
                    superior:undefined
                },
                // 日期范围
                dateRange: [],
                worksList: [],
                open: false,
                title: "",
                worksId: undefined,
                opType: "view"
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                listOpus(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                    this.worksList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                }
                );
            },
            handleSuperiorChange(row) {
                let text = row.superior === "1" ? "上架" : "下架";
                this.$modal.confirm('确认要"' + text + row.code + '"作品吗？').then(function () {
                    return changeSuperiorStatus(row.id, row.superior);
                }).then(() => {
                    this.$modal.msgSuccess(text + "成功");
                }).catch(function () {
                    row.superior = row.superior === "1" ? "0" : "1";
                });
            },
            handleSelectedChange(row) {
                let text = row.selected === 1 ? "推荐" : "不推荐";
                this.$modal.confirm('确认要设置"' + row.code + '"作品为' + text + '吗？').then(function () {
                    return changeSelectedStatus(row.id, row.selected);
                }).then(() => {
                    this.$modal.msgSuccess("设置" + text + "成功");
                }).catch(function () {
                    row.selected = row.selected === 1 ? 0 : 1;
                });
            },
            handleAdd() {
                this.title = '新增作品';
                this.open = true;
                this.worksId = undefined;
                this.opType = "add";
            },
            handleView(row) {
                this.title = '作品详情';
                this.open = true;
                this.worksId = row.id;
            },
            handleEdit(row) {
                this.title = '修改作品';
                this.open = true;
                this.worksId = row.id;
                this.opType = "edit";
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                this.$modal.confirm('是否确认删除作品"' + row.code + '"的数据项？').then(function () {
                    return delOpus(row.id);
                }).then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                }).catch(() => { });
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
        }
    }
</script>
