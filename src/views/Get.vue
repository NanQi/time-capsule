<template>
  <div class="get">
    <h2>时间胶囊也可以当漂流瓶</h2>
    <el-button type="success" @click="get">挖一个</el-button>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{tips}}</span>
      </div>
      <el-input type="textarea" readonly :rows="8" v-model="content"></el-input>
    </el-card>
  </div>
</template>


<script>
import contract from "../contract";
import helper from "../helper";

export default {
  data() {
    return {
      tips: "",
      content: ""
    };
  },
  methods: {
    get() {
      contract
        .then(([, timeCapsule, from]) => {
          return timeCapsule.dug({ from });
        })
        .then(res => {
          var code = parseInt(res[0]);
          var timestamp = res[2];
          var time = helper.formatTime(timestamp)
          if (code == 0) {
            this.tips = "你挖到一个[" + time + "]埋下的胶囊";
            this.content = res[1]
          } else if (code == 1) {
            this.tips = "你挖到一个[" + time + "]到期的胶囊";
            this.content = res[1]
          } else if (code == 2) {
            this.$notify.error({
              title: '错误',
              message: res[1]
            });
          }
        });
    }
  }
};
</script>

<style>
.box-card {
  width: 450px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  padding: 10px;
}
.el-textarea, textarea {
  width: 100%;
  height: 100%;
}
</style>
