<template>
  <div class="put">
    <h2>在区块链上埋下时间胶囊</h2>
    <el-row>
      <el-input type="textarea" :rows="4" v-model="content" placeholder="请输入胶囊内容"></el-input>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-switch
          v-model="isEncrypt"
          inactive-text="公开"
          active-text="加密">
        </el-switch>
      </el-col>
      <el-col :span="12">
        <el-input type="password" v-show="isEncrypt" v-model="pwd" placeholder="请输入密码"></el-input>
      </el-col>
    </el-row>

    <el-row>
      <el-input v-model="tips" placeholder="请输入未到期提示信息"></el-input>
    </el-row>

    <el-row>
      <el-date-picker
        v-model="time"
        type="datetime"
        placeholder="选择胶囊打开的日期时间"
        value-format="timestamp"
        :picker-options="pickerOptions1">
      </el-date-picker>
    </el-row>

    <el-row>
      <el-button type="primary" @click="put">添加胶囊</el-button>
    </el-row>
  </div>
</template>

<script>
import contract from "../contract";
import CryptoJS from "crypto-js";

export default {
  data() {
    return {
      pickerOptions1: {
        shortcuts: [
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一年后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 365);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      pwd: '',
      content: "",
      tips: "",
      time: "",
      isEncrypt: false
    };
  },
  methods: {
    put() {
      var content = this.content;
      if (this.isEncrypt) {
        content = CryptoJS.AES.encrypt(this.content, this.pwd).toString();
      }
      contract
        .then(([, timeCapsule, account]) => {
          return timeCapsule.buried(
            content,
            this.tips,
            this.time / 1000,
            this.isEncrypt,
            { from: account },
          );
        })
        .then(() => {
          this.$notify({
            title: '提示',
            message: '你成功在区块链上埋下一颗时间胶囊'
          });
        })
        .catch(() => {
          this.$notify.error({
            title: '错误',
            message: '请检查你的网络选择，暂时只支持Rinkeby测试网'
          });
        })

    }
  }
};
</script>

<style>
.put {
  width: 450px;
  margin: 0 auto;
}
.el-row {
  margin-bottom: 20px;
}
.el-date-editor {
  width: 100% !important;
}
.el-switch {
  height: 40px;
}
</style>

