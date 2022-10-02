<template>
  <div class="component-upload-video">
    <el-upload class="avatar-uploader" multiple :file-list="fileList" :limit="limit"  :action="uploadVideoUrl"
               :on-progress="uploadVideoProcess" :on-success="handleVideoSuccess"
               :before-upload="beforeUploadVideo" :show-file-list="false" :headers="headers">

      <video v-for="(val,index) in uploadList" class="avatar video-avatar"
             controls="controls"  v-bind:src="val.url">
        您的浏览器不支持视频播放
      </video>
      <div class="el-upload el-upload--video-card" style="margin-left: 8px;">
        <i v-if="uploadList.length < 2" class="el-icon-plus avatar-uploader-icon"></i>
        <el-progress v-if="videoFlag == true" type="circle" v-bind:percentage="videoUploadPercent"
                     style="margin-top: 7px"></el-progress>
      </div>
    </el-upload>


    <!-- 上传提示 -->
    <div class="el-upload__tip" slot="tip" v-if="showTip">
      请上传
      <template v-if="video"> 文件 <b style="color: #f56c6c">{{ video }}</b> 个</template>
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b></template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b></template>
      的文件
    </div>


  </div>

</template>

<script>
  import {getToken} from "@/utils/auth";

  export default {
    props: {
      value: [String, Object, Array],
      // 图片数量限制
      video: {
        type: Number,
        default: 2
      },
      // 大小限制(MB)
      fileSize: {
        type: Number,
        default: 50
      },
      // 文件类型, 例如['png', 'jpg', 'jpeg']
      fileType: {
        type: Array,
        default: () => [
          "mp4",
          "ogg",
          "flv",
          "avi",
          "wmv",
          "rmvb",
          "mov"
        ],
      },
      // 是否显示提示
      isShowTip: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        baseUrl: process.env.VUE_APP_BASE_API,
        uploadVideoUrl: process.env.VUE_APP_BASE_API + "/common/upload",
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        videoFlag: false,
        //是否显示进度条
        videoUploadPercent: "",
        //进度条的进度，
        isShowUploadVideo: false,
        //显示上传按钮
        videoForm: {
          showVideoPath: "", //回显的变量
        },
        number: 0,
        fileList: [],
        uploadList:[],
        limit:2

      };
    },
    watch: {
      value: {
        handler(val) {
          if (val) {
            // 首先将值转为数组
            const list = Array.isArray(val) ? val : this.value.split(',');
            // 然后将数组转为对象数组
            this.fileList = list.map(item => {
              if (typeof item === "string") {
                if (item.indexOf(this.baseUrl) === -1) {
                  item = {name: this.baseUrl + item, url: this.baseUrl + item};
                } else {
                  item = {name: item, url: item};
                }
              }
              return item;
            });
          } else {
            this.fileList = [];
            return [];
          }
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      // 是否显示提示
      showTip() {
        return this.isShowTip && (this.fileType || this.fileSize);
      },
    },
    methods: {
      //上传前回调
      beforeUploadVideo(file) {
        let isVideo = false;
        if (this.fileType.length) {
          let fileExtension = "";
          if (file.name.lastIndexOf(".") > -1) {
            fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
          }
          isVideo = this.fileType.some(type => {
            if (file.type.indexOf(type) > -1) return true;
            if (fileExtension && fileExtension.indexOf(type) > -1) return true;
            return false;
          });
        } else {
          isVideo = file.type.indexOf("video") > -1;
        }
        var fileSize = file.size / 1024 / 1024 < 51; //控制大小  修改50的值即可
        if (
          ["video/mp4", "video/ogg", "video/flv", "video/avi", "video/wmv", "video/rmvb", "video/mov",].indexOf(file.type) == -1 //控制格式
        ) {
          layer.msg("请上传正确的视频格式");
          return false;
        }
        if (fileSize > this.fileSize) {
          layer.msg("视频大小不能超过50MB");
          return false;
        }
        this.isShowUploadVideo = false;
        //this.$modal.loading("正在上传视频，请稍候...");
        this.number++;

      },
      //进度条
      uploadVideoProcess(event, file, fileList) {
        //注意在data中添加对应的变量名
        this.videoFlag = true;
        this.videoUploadPercent = file.percentage.toFixed(0) * 1;
      },
      //上传成功回调
      handleVideoSuccess(res, file) {
        this.isShowUploadVideo = true;
        this.videoFlag = false;
        this.videoUploadPercent = 0;
        console.log("====>" + this.fileList);
        this.videoForm.showVideoPath = res.url;
        this.uploadList.push({ name: res.fileName ,url: res.url });
        for(let item of this.uploadList){
          console.log("===>" ,item);
        }
        this.uploadedSuccessfully();
      },
      // 上传结束处理
      uploadedSuccessfully() {

        this.$modal.closeLoading();



        /*if (this.number > 0 && this.uploadList.length === this.number) {
          this.fileList = this.fileList.concat(this.uploadList);
          this.uploadList = [];
          this.number = 0;
          this.$emit("input", this.listToString(this.fileList));
          this.$modal.closeLoading();
        }*/
      }
    },
  };
</script>

<style scoped>
  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9 !important;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px !important;
    position: relative !important;
    overflow: hidden !important;
  }

  .avatar-uploader .el-upload:hover {
    border: 1px dashed #d9d9d9 !important;
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 300px;
    height: 178px;
    margin-left: 8px;
    /*display: block;*/
  }


</style>
<!--<style scoped lang="scss">
  // .el-upload&#45;&#45;picture-card 控制加号部分
  ::v-deep.hide .el-upload&#45;&#45;picture-card {
    display: none;
  }
  // 去掉动画效果
     ::v-deep .el-list-enter-active,
     ::v-deep .el-list-leave-active {
       transition: all 0s;
     }

  ::v-deep .el-list-enter, .el-list-leave-active {
    opacity: 0;
    transform: translateY(0);
  }
</style>-->
