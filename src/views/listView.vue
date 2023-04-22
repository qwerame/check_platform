<template>
  <div style="margin-top: 20px">
    <div id="search" >
      <el-form ref="form" :model="form" label-width="100px" >
        <el-form-item label="用户名:" class="form1">
          <el-input v-model="form.name" class="input1"></el-input>
        </el-form-item>
        <el-form-item label="产品线:" class="form1">
          <el-input v-model="form.product" class="input1"></el-input>
        </el-form-item>
        <el-form-item label="行业:" class="form1">
          <el-input v-model="form.industry" class="input1"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="任务创建时间:" class="form2">
          <el-col :span="11">
            <el-date-picker type="datetime" placeholder="开始时间" v-model="form.date_start" style="width: 100%;" class="input2"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">~</el-col>
          <el-col :span="11">
            <el-date-picker type="datetime" placeholder="结束时间" v-model="form.date_end" style="width: 100%;" class="input2"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-button type="primary" @click="onSubmit" class="submit">搜索</el-button>
      </el-form>
    </div>
    <el-table
        :data="showData"
        border
        :cell-style="{padding: '0'}"
        size="medium"
        style="width: 850px;margin: auto">
      <el-table-column
          prop="name"
          label="用户名"
          width="180">
      </el-table-column>
      <el-table-column
          prop="product"
          label="产品线"
          width="180">
      </el-table-column>
      <el-table-column
          prop="industry"
          label="行业"
          width="180">
      </el-table-column>
      <el-table-column
          prop="time"
          label="创建时间">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="toDetail(scope.row)">审核</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div id="bottom">
      <p id="sum">共{{ this.selectedData.length }}条数据</p>
      <el-pagination
          background
          id="pagination"
          layout="prev, pager, next"
          :total="this.selectedData.length"
          @current-change="handleCurrentChange"
          :current-page="this.current_page">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "listView",
  data() {
    return {
      form: {
        name: '',
        product: '',
        industry: '',
        date_start: '',
        date_end: '',
      },
      rawData: [],
      selectedData: [],
      current_page:1,
    }
  },
  computed:{
    showData(){
        return this.selectedData.slice((this.current_page - 1) * 10,(this.current_page - 1) * 10 + 10);
    },
  },
  methods:{
    sendAsk(){
      let config ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.get("https://mock.apifox.cn/m1/2617753-0-default/get_list", config).then( res => {
        console.log(res)
        this.rawData = res.data.data
        this.selectedData = res.data.data
      })
    },
    toDetail(row){
        this.$router.push({path:'/detailView',query:{id:row.id , name:row.name}});
    },
    onSubmit() {
      let year_start = null,
          month_start = null,
          day_start = null,
          hour_start = null,
          min_start = null,
          sec_start = null,
          year_end = null,
          month_end = null,
          day_end = null,
          hour_end = null,
          min_end = null,
          sec_end = null,
          newTime_start = null,
          newTime_end = null;
      if(this.form.date_start !== '' && this.form.date_start !== null){
        year_start = this.form.date_start.getFullYear()
        month_start = this.form.date_start.getMonth() + 1//月份是从0开始的
        day_start = this.form.date_start.getDate()
        hour_start = this.form.date_start.getHours()
        min_start = this.form.date_start.getMinutes()
        sec_start = this.form.date_start.getSeconds()
        newTime_start = year_start + '-' +
            month_start + '-' +
            day_start + ' ' +
            hour_start + ':' +
            min_start + ':' +
            sec_start
      }
      if(this.form.date_end !== null && this.form.date_end !== ''){
        year_end = this.form.date_end.getFullYear()
        month_end = this.form.date_end.getMonth() + 1//月份是从0开始的
        day_end = this.form.date_end.getDate()
        hour_end = this.form.date_end.getHours()
        min_end = this.form.date_end.getMinutes()
        sec_end = this.form.date_end.getSeconds()
        newTime_end = year_end + '-' +
            month_end + '-' +
            day_end + ' ' +
            hour_end + ':' +
            min_end + ':' +
            sec_end;
      }
      this.selectedData = this.rawData
      if(this.form.name !== '') {
        console.log("收到新名字")
        this.selectedData = this.selectedData.filter((value, index) => {
          return value.name.indexOf(this.form.name.trim()) !== -1
        })
      }
      if(this.form.product !== '') {
        this.selectedData = this.selectedData.filter((value, index) => {
          return value.product.indexOf(this.form.product.trim()) !== -1
        })
      }
      if(this.form.industry !== '') {
        this.selectedData = this.selectedData.filter((value, index) => {
          return value.industry.indexOf(this.form.industry.trim()) !== -1
        })
      }
      if(newTime_start !== null) {
        this.selectedData = this.selectedData.filter((value, index) => {
          return value.time >= newTime_start
        })
      }
      if(newTime_end !== null) {
        this.selectedData = this.selectedData.filter((value, index) => {
          return value.time <= newTime_end
        })
      }
      this.current_page = 1
      console.log(newTime_start + ' ' + newTime_end);
      if(newTime_start > newTime_end) console.log("戳啦~~~")

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current_page = val;
    },
    handleDelete(row){
      console.log(row)
      this.rawData = this.rawData.filter(item => { return item.id !== row.id; })
      this.selectedData = this.selectedData.filter(item => { return item.id !== row.id; })
      if((this.current_page - 1) * 10 >= this.selectedData.length) this.current_page = this.current_page - 1
    }
  },
  mounted(){
    this.sendAsk()
  }
}
</script>

<style scoped>
.input1{
  display: inline-block;
  padding-right: 40px;
  width: 160px;
}
.form1{
  display: inline-block;
}
.input2{
  display: inline-block;
}
.form2{
  display: inline-block;
  vertical-align: top;

}
.submit{
  width: 100px;
  margin-left: 140px;
}
#bottom{
  vertical-align: top;
  margin: auto;
  width: 860px;
}
#bottom:after{
  clear: both;
  content:"";
  display:block;
}
#sum{
  vertical-align: center;
  display: inline-block;
  margin:0;
  padding-left: 10px;
  line-height: 32px;
  float: left
}
#pagination{
  display: inline-block;
  vertical-align: center;
  float: right
}
</style>