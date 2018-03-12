<template>
  <div class="home">
    <img src="../assets/logo.jpg">
    <h2>区块链上的时间胶囊</h2>
    <router-link to="/about">如何使用时间胶囊</router-link>
    <div>{{networkName}}</div>
  </div>
</template>

<script>
import contract from "../contract";

export default {
  name: "home",
  data() {
    return {
      networkName: "None"
    };
  },
  created() {
    contract.then(([web3]) => {
      this.networkName = web3.network.networkName;
    })
  }
};
</script>
