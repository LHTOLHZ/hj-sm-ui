<template>
    <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-card>
                <el-tabs v-model="activeTab">
                    <el-tab-pane label="作品信息" name="worksInfo">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="作品发布人" prop="author">
                                    <el-select v-model="form.author" placeholder="请选择作品发布人">
                                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                          <el-col :span="8">
                            <el-form-item label="名称">
                              <el-input v-model="form.name" />
                            </el-form-item>
                          </el-col>
                            <el-col :span="8">
                                <el-form-item label="QQ">
                                    <el-input v-model="form.qq" />
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="微信">
                                    <el-input v-model="form.wechat" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="手机">
                                    <el-input v-model="form.mobile" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="作品介绍">
                                  <el-input type="textarea"
                                            :autosize="{ minRows: 5, maxRows: 20}"
                                            placeholder="作品描叙" v-model="form.remark"

                                  />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="作品素材" name="picInfo">
                        <el-col :span="24">
                            <el-form-item label="图片" prop="depositImg">
                                <ImageUpload  v-model="form.depositImg" :limit='20'></ImageUpload>
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
                                <input type="checkbox" value="free" v-model="freeBox" @change="priceCheckboxChange('free')" /> 免费
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="24">
                            <el-form-item prop="free">
                                <input type="checkbox" value="partFree" v-model="partFreeBox" @change="priceCheckboxChange('partFree')" /> 部分收费
                                <el-input :disabled="freeNumDisabled" v-model="form.freeNum" style="width: 200px;padding-left: 40px" placeholder="设置免费张数"
                                />
                                <el-input :disabled="freeNumPriceDisabled" v-model="form.freeNumPrice" style="width: 200px;padding-left: 20px" placeholder="设置作品售价"
                                />
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="24">
                            <el-form-item prop="free">
                                <input type="checkbox" value="charge" v-model="chargeBox" @change="priceCheckboxChange('charge')" /> 全部收费
                                <el-input :disabled="priceDisabled" v-model="form.price" style="width: 400px;padding-left: 40px" placeholder="设置作品售价" />
                            </el-form-item>
                        </el-col>
                    </el-tab-pane>
                    <el-tab-pane label="云盘信息" name="netdiskInfo">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="网盘连接">
                                    <el-input v-model="form.networkUrl" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="网盘提取码">
                                    <el-input v-model="form.networkCode" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="解压码">
                                    <el-input v-model="form.zipCode" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </el-form>

        <div slot="footer" class="dialog-footer" style="text-align: right;padding-top: 10px" v-show="submitButton">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancelDialog">取 消</el-button>
        </div>
    </div>
</template>

<script>
    import { addOpus, getOpus,updateOpus } from "@/api/biz/opus";
    import { allUserList } from "@/api/system/user";

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
            if(this.opType == "view"){
                this.submitButton = false;
            }
            if(this.worksId != null){
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
            getAllUserList() {
                let queryParams = { bizType: 3 };
                allUserList(queryParams).then(response => {
                    this.userList = response.data;
                }
                );
            },
            getWorksInfo(){

            },
            submitForm() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.worksId != null) {
                            updateOpus(this.form).then(response => {
                                this.$modal.msgSuccess("修改成功");
                                this.cancelDialog();
                            });
                        } else {
                            addOpus(this.form).then(response => {
                                this.$modal.msgSuccess("新增成功");
                                this.cancelDialog();
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
