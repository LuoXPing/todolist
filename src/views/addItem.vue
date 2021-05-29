<template>
  <div class="add">
      <div class="header"><h2>添加备忘事件</h2></div><br/>
      <div class="center-content">
          <div class="inputBox">
              <a-input addonBefore="标题：" placeholder="title" v-model="title"/>
              <!--如果没有输入标题，则显示警告-->
              <a-alert message="请输入标题" banner style="margin-top: 5px;" v-show="hasTitle"/>
          </div>
          <div class="inputBox">
              <label>内容：</label>
              <a-textarea :rows="16" placeholder="content" v-model="content"/>
              <a-alert message="请输入内容" banner style="margin-top: 5px;" v-show="hasContent"/>
          </div>
          <div class="inputBox">
              <label>截止时间：</label>
              <a-date-picker @change="onChange" :value="deadline"/>&nbsp;
              <a-time-picker @change="onChange2" :value="time"/>
              <a-alert message="请选择截止时间" banner style="margin-top: 5px;" v-show="hasDate"/>
          </div>
          <br/>
          <a-button block @click="showModal"  style="margin-bottom: 20px;" type="primary">添加</a-button>
          <!--提示框：‘创建’按钮被点击时触发-->
          <a-modal v-model="visible" @ok="add">
              <p style="font-size: 20px"><a-icon type="question-circle" style="color: orange;"/>   你确定是否添加该事件?</p>
          </a-modal>
      </div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'add',
    data (){
        return {
            title:'',
            content:'',
            deadline:null,
            deadlineStr:'',
            time: null,
            timeStr:'00:00:00',
            overdueList:[],
            hasTitle:false,//确认是否有标题
            hasContent:false,
            hasDate:false,
            visible: false//确认是否创建
        }
    },
    methods: {
      /*确认是否添加 弹出对话框*/
        showModal() {
            /*判断内容是否为空，空则显示警告，非空显示提醒窗口*/
            if (this.title == '' || this.content == ''||this.deadlineStr == ''){
                this.title === ''?this.hasTitle = true:this.hasTitle = false
                this.content === ''?this.hasContent = true:this.hasContent = false
                this.deadlineStr === ''?this.hasDate = true:this.hasDate = false
            }else {
                this.visible = true
            }
        },
        /*添加备忘事项*/
        add() {
            this.visible = false
            if (this.time==null){
                this.time = moment('00:00:00','hh:mm:ss')
            }
            //从localStorage中获取数据
            let list = JSON.parse(localStorage.getItem('ready') || '[]' )
            let item = {'id': new Date(), 'title': this.title, 'content': this.content,'checkIcon':false,
                'deadlineStr': this.deadlineStr,'timeStr':this.timeStr,'deadline':this.deadline,'time':this.time}
            list.push(item)
            console.log(this.deadline);
            localStorage.setItem('ready', JSON.stringify(list))
            this.refreshData()
            this.title = this.content = this.deadlineStr = ''
            this.time = this.deadline=null
            this.hasTitle = this.hasContent =this.hasDate = false
            this.$message.success('已成功添加到待办事件，请点击待办事件进行查看');
        },
        /*更新列表显示的数据*/
        refreshData(){
            let items = localStorage.getItem('ready') || '[]'
            this.overdueList = JSON.parse( items )
        },
        /*处理时间*/
        onChange(date, dateString) {
            this.deadlineStr =  dateString;
            this.deadline =  date;
        },
        onChange2(time,timeStr){
            this.time = time
            this.timeStr = timeStr
        }

    }
}
</script>
<style scoped>
    label{
        font-size: 16px;
        display: inline-block;
        padding: 0 0 10px 5px;
    }
    .inputBox{
        margin-bottom: 18px
    }
</style>
