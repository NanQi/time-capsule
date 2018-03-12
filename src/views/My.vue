<template>
  <div class="get">
    <h2>时间是一种解药</h2>
    <div class="content">
      <el-table
        :data="capsuleList">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="索引">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="胶囊内容">
                <span>{{ props.row.content }}</span>
              </el-form-item>
              <el-form-item label="未到期提示">
                <span :title="props.row.tips">{{ props.row.tips }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createAt }}</span>
              </el-form-item>
              <el-form-item label="到期时间">
                <span>{{ props.row.expireAt }}</span>
              </el-form-item>
              <el-button size="small" round @click="get(props.row.id)">打开胶囊</el-button>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="索引"
          prop="id">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createAt">
        </el-table-column>
        <el-table-column
          label="到期时间"
          prop="expireAt">
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="胶囊内容" :visible.sync="dialogVisible">
      <el-input type="textarea" readonly :rows="8" v-model="content"></el-input>
    </el-dialog>
  </div>
</template>


<script>
import contract from "../contract";
import helper from "../helper";
import CryptoJS from "crypto-js";

export default {
  data() {
    return {
      dialogVisible: false,
      tips: "",
      capsuleList: [],
      content: ""
    };
  },
  created() {
    contract.then(([, timeCapsule, from]) => {
      return timeCapsule
        .getAllCapsules({ from })
        .then(idList => {
          return Promise.all(
            idList.map(id => {
              return timeCapsule.getCapsuleById(parseInt(id), { from });
            })
          );
        })
        .then(list => {
          var idx = 1;
          this.capsuleList = list
          .filter(item => item[2] != 0)
          .map(item => {
            var id = idx++;
            var content = item[0];
            var tips = item[1];
            var createAt = helper.formatTime(item[2]);
            var expireAt = helper.formatTime(item[3]);
            var encrypt = item[4];
            return {
              id,
              content,
              tips,
              createAt,
              expireAt,
              encrypt
            };
          });
        });
    });
  },
  methods: {
    get(id) {
      var capsule = this.capsuleList[id - 1];
      if (capsule.encrypt) {
        this.$prompt('请输入胶囊密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          var bytes  = CryptoJS.AES.decrypt(capsule.content, value);
          this.content = bytes.toString(CryptoJS.enc.Utf8);
          this.dialogVisible = true;
        })
      } else {
        this.content = capsule.content;
        this.dialogVisible = true;
      }
    }
  }
};
</script>

<style>
.content {
  width: 450px;
  margin: 0 auto;
}
.el-table {
  text-align: left;
}
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }

  .demo-table-expand .el-button{
    width: 150px;
    margin-left: 100px;
  }

  .demo-table-expand .el-form-item span {
    display:block;
    white-space:nowrap; 
    overflow:hidden; 
    text-overflow:ellipsis;
  }
</style>
