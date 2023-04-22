<template>
  <div style="margin-top: 20px">
    <table id="table">
      <tr class="tr">
        <th class="th">用户名</th>
        <td class="td">{{this.userName}}</td>
        <th class="th">用户id</th>
        <td class="td">{{this.userId}}</td>
        <th class="th">公司网站</th>
        <td class="td">{{user_info.website}}</td>
      </tr>
      <tr class="tr">
        <th class="th">资质</th>
        <td class="td">{{user_info.user_quality}}</td>
        <th class="th">一级行业</th>
        <td class="td">{{user_info.first_industry}}</td>
        <th class="th">二级行业</th>
        <td class="td">{{user_info.second_industry}}</td>
      </tr>
      <tr class="tr">
        <th class="th">用户类型</th>
        <td class="td">{{user_info.user_type}}</td>
        <th class="th">批注</th>
        <td colspan="3" class="td">{{user_info.annotation_comment}}</td>
      </tr>
    </table>
    <br>
    <div id="buttons">
      <el-button type="primary" @click="pass">通过所选</el-button>
      <el-button type="danger" @click="reject">拒绝所选</el-button>
      <el-button type="danger" @click="rejectUser">拒绝账户</el-button>
      <el-button type="warning" @click="shelver">搁置</el-button>
      <el-button type="success" @click="this.renew">下一个任务</el-button>
    </div>
    <br>
    <el-table
        ref="multipleTable"
        id="info_table"
        :data="detail_data"
        border
        :cell-style="{padding:'0',margin:'0'}"
        :span-method="objectSpanMethod"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="40px">
      </el-table-column>
      <el-table-column
          prop="title"
          label="标题"
          header-align="center"
          style="padding: 0"
          width="120px">
      </el-table-column>
      <el-table-column
          prop="describe"
          label="描述"
          width="300px"
          header-align="center"
          align="left">
      </el-table-column>
      <el-table-column
          prop="pic"
          label="图片"
          width="250px"
          header-align="center">
        <template scope="scope">
          <div class="pic_div">
            <el-image class="image" :src="scope.row.pic"></el-image>
            <el-image class="image" :src="scope.row.pic"></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          header-align="center"
          width="60px">
        <template slot-scope="scope">
          <el-button id="passOne" type="text" @click="passOne(scope.row)">通过</el-button>
          <el-button id="rejectOne" type="text" @click="rejectOne(scope.row)">拒绝</el-button>
        </template>
      </el-table-column>
      <el-table-column
          header-align="center"
          style="padding: 0"

          label="落地页">
        <template slot-scope="scope" >
          <div>
            <p style="margin: 0;"><a :href="scope.row.land_page" target="_blank">{{scope.row.land_page}}</a></p>
            <div id="landPage1">
              <div id="landPage2">
                <iframe id="iframe" :src="scope.row.land_page"></iframe>
              </div>
            </div>
            <div style="display: inline-block; width: 5%;vertical-align: middle;margin-left: 5px">
              <el-button id="passAll" type="text" @click="passAll">通过</el-button>
              <el-button id="rejectAll" type="text" @click="rejectAll">拒绝</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "detailView",
  data(){
    return{
      multipleSelection:[],
      user_info:{},
      detail_data:[],
      userName:"",
      userId:"",
    }
  },
  mounted(){
    axios.get("https://mock.apifox.cn/m1/2617753-0-default/task_detail",{
      params: {
        id:this.$route.query.id,
      },
    }).then( res => {
      console.log(res)
      this.user_info = res.data
      this.detail_data = res.data.detail
    })
    this.userName = this.$route.query.name
    this.userId = this.$route.query.id
  },
  methods:{
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    renew(){
      let config ={
        headers: {'Content-Type': 'multipart/form-data'}
      }
      axios.get("https://mock.apifox.cn/m1/2617753-0-default/new_task_detail", config).then( res => {
        console.log(res)
        this.user_info = res.data
        this.detail_data = res.data.detail
        this.userName = res.data.name
        this.userId = res.data.id
      })
    },
    pass(){
      if(this.multipleSelection.length === 0) alert("请先选择通过的数据！！！")
      else{
        let selectedItem = ""
        this.multipleSelection.forEach((value, index) => {
          selectedItem = selectedItem + value.id + " "
        })
        alert("成功通过id为：" + selectedItem + "的数据")
      }
    },
    reject(){
      if(this.multipleSelection.length === 0) alert("请先选择拒绝的数据！！！")
      else{
        let selectedItem = ""
        this.multipleSelection.forEach((value, index) => {
          selectedItem = selectedItem + value.id + " "
        })
        alert("成功拒绝id为：" + selectedItem + "的数据")
      }
    },
    rejectUser(){
      alert("成功拒绝id为" + this.$route.query.id + "的用户的申请")
    },
    shelver(){
      if(this.multipleSelection.length === 0) alert("请先选择搁置的数据！！！")
      else{
        let selectedItem = ""
        this.multipleSelection.forEach((value, index) => {
          selectedItem = selectedItem + value.id + " "
        })
        alert("成功搁置id为：" + selectedItem + "的数据")
        this.renew()
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 5) {    //用于设置要合并的列
        if (rowIndex === 0) {   //用于设置合并开始的行号
          return {
            rowspan: 5,　　　　　//合并的行数
            colspan: 1          //合并的列数，设为０则直接不显示
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    passOne(row){
      alert("成功通过id为：" + row.id + "的数据")
    },
    rejectOne(row){
      alert("成功拒绝id为：" + row.id + "的数据")
    },
    passAll(){
      let selectedItem = ""
      this.detail_data.forEach((value, index) => {
        selectedItem = selectedItem + value.id + " "
      })
      alert("成功通过id为：" + selectedItem + "的数据")
    },
    rejectAll(){
      let selectedItem = ""
      this.detail_data.forEach((value, index) => {
        selectedItem = selectedItem + value.id + " "
      })
      alert("成功拒绝id为：" + selectedItem + "的数据")
    }

  }
}
</script>

<style>
#table{
  width: 60%;
  margin: auto;
  border: black solid 1px;
  border-collapse: collapse;
}
.th,.td{
  border: black solid 1px;
  text-align: center;
  line-height: 40px;
  width: 15%;
}
#buttons{
  margin: auto;
  width: 60%;
  display:-webkit-flex;
  display: flex;
  justify-content: space-around;
}
.pic_div{
  margin: auto;
  display:-webkit-flex;
  display: flex;
  justify-content: space-between;
}

#info_table tbody tr:hover > td {
  background-color: transparent
}


#info_table{
  width: 1200px;
  margin: auto;
}
.image{
  width: 100px;
  height: 100px;
  display: inline-block
}
#passOne{
  display: block;
  margin: auto;
  padding-bottom: 20px;
}
#rejectOne{
  display: block;
  margin: auto;
  padding: 0;
}
#landPage1{
  display: inline-block;
  width: 90%;
  vertical-align: middle;
}
#landPage2{
  height: 600px;
  width: 100%;
}
#iframe{
  height: 100%;
  width: 100%;
}
#passAll{
  display: block;
  margin: auto;
  padding-bottom: 20px;
  padding-left: 5px;
}
#rejectAll{
  display: block;
  margin: auto;
  padding: 5px;
}
</style>