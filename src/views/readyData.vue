<template>
    <div class="ready">
        <div class="header">
            <h2>待办事件</h2>
            <!--按钮组:全选、完成、删除-->
            <div class="buttonGroups">
                <a-button type="primary"  @click="SelectedAll" v-show="!flag">
                    <span v-if="SelectedAllFlag" >全选</span>
                    <span v-else>取消全选</span>
                </a-button>
                <a-button type="primary"  @click="showModal('1')">完成</a-button>
                <a-button type="primary"  @click="showModal('2')">删除</a-button>
            </div>
        </div>
        <div class="center-content">
            <!--警告窗口的显示-->
            <a-modal v-model="SeclectedVisible" @ok="wrappedSelCompDel(callUrl)">
                <p style="font-size: 20px"><a-icon type="question-circle" style="color: orange;"/>  是否确认{{info}}？</p>
            </a-modal>
            <a-modal v-model="SingleVisible" @ok="wrappedComDel(id,callUrl)">
                <p style="font-size: 20px"><a-icon type="question-circle" style="color: orange;"/>  是否确认{{info}}？</p>
            </a-modal>
            <!-- 如果没有内容时显示提示信息 -->
            <div class="WithoutContent" v-show="flag">没有待办事件~~</div><br/>
            <!--有内容则以列表形式显示-->
            <ul>
                <li v-for="item in readyList" :key="item.id" class="ItemList">
                    <a-icon type="check-circle"
                            :class="{'checkIcon':true,'checkIconfocus':item.checkIcon}"
                            @click=" checkIconTest(item) "/>
                    <a-card hoverable :title="item.title" :class="{hightlight:item.checkIcon}">
                        <!--点击时，使用路由跳到编辑界面修改，通过query传参-->
                        <router-link :to="'/edit?id='+item.id"><a-icon type="edit" class="edit" title="编辑"/></router-link>
                        <router-link :to="'/detail?id='+item.id+'&url=ready'"><a class="detail">查看详情</a></router-link>
                        <!--内容长度判断，当超过170时截取 ，并显示为 ...-->
                        <span v-if="item.content.length>170">{{item.content.slice(0,170)}}<span class="moreWords"> . . . . . .</span></span>
                        <span v-else>{{item.content}}</span>
                        <span style="position: absolute; right: 5px; bottom: 5px;">
                        <span style="font-size: 16px">截止时间：{{item.deadlineStr}}&nbsp;{{item.timeStr}} </span>
                        <a-icon  class="deleteIcon" type="delete" @click="showModal('4',item.id)" title="删除" />
                        <a-icon type="check-square"  title="完成" class="complete" @click="showModal('3',item.id)"/>
                    </span>
                    </a-card>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "readyData",
        data() {
            return {
                readyList: [],
                selecctCount: '0',//用来判断选中了几个
                flag:false,/*用于判断有无内容*/
                SelectedAllFlag:true,/*用于判断当前为全选还是取消*/
                callUrl:'',//用于标记进行的操作：complete为完成，rubbish为删除
                SeclectedVisible:false,//1-完成；2-删除
                SingleVisible:false,//3-完成；4-删除
                info:'',//用于显示提示的消息
                id:'',//当前 被操作项 的id
            }
        },
        methods: {
            /*确认是否添加 弹出对话框*/
            showModal(methodName,id) {
                this.id=id
                if (methodName == '1' || methodName == '3') {
                    this.callUrl='complete';
                    this.info='完成'
                }else{
                    this.callUrl='rubbish';
                    this.info='删除'
                }
                (methodName == '1' || methodName == '2')?this.SeclectedVisible = true:this.SingleVisible = true
            },
            /*全选的处理方法*/
            SelectedAll(){
                this.readyList.forEach((item)=>{//遍历数组，改变checkIcon的值
                    item.checkIcon = this.SelectedAllFlag
                })
                this.SelectedAllFlag =!this.SelectedAllFlag
                this.SelectedAllFlag==false?this.selecctCount = this.readyList.length:this.selecctCount = 0
            },
            /*功能：删除选中 或 完成选中。opera：所要进行的操作*/
            wrappedSelCompDel(opera){
                var comList = JSON.parse(localStorage.getItem(opera) || '[]' )
                for(let i=this.readyList.length-1;i>=0;i--){
                    if (this.readyList[i].checkIcon == true){
                        this.readyList[i].checkIcon  = false
                        comList.push(this.readyList[i])
                        this.readyList.splice(i, 1)
                    }
                }
                if(this.selecctCount == 0){
                    this.$message.error('没有选中的项目，请选中后再操作');
                }else{/*操作完成，放回本地存储中*/
                    localStorage.setItem('ready', JSON.stringify(this.readyList))
                    localStorage.setItem(opera, JSON.stringify(comList))
                    this.$message.success('成功'+this.info+ this.selecctCount +'项！');
                }
                this.SeclectedVisible = false
                this.refreshPage()
            },
            /*功能：删除或者完成 单项事件。参数id：待处理的项的id，opera：所要进行的操作，msg：处理完的提示信息*/
            wrappedComDel(id,opera){
                this.readyList.some((item, i) => {
                    if (item.id === id) {
                        /*将已完成的事件加入到本地存储complete中*/
                        var comList = JSON.parse(localStorage.getItem(opera) || '[]')
                        comList.push(this.readyList[i])
                        localStorage.setItem(opera, JSON.stringify(comList))
                        /*把相应的 待办事件 删除，并对本地存储进行更新*/
                        this.readyList.splice(i, 1)
                        localStorage.setItem('ready', JSON.stringify(this.readyList))
                        return true
                    }
                })
                this.$message.success('已经成功'+this.info+'该事件！');
                this.SingleVisible = false
                this.refreshPage()
            },
            /*功能：点击时高亮显示被点击的list*/
            checkIconTest(t){
                this.readyList.some((item, i) => {
                    if (item.id === t.id) {
                        this.readyList[i].checkIcon = !this.readyList[i].checkIcon
                        return true
                    }
                })
                /*用于计数选中了几项*/
                this.selecctCount = 0
                this.readyList.forEach((item)=>{
                    if (item.checkIcon == true){
                        this.selecctCount = parseInt( this.selecctCount )+1
                    }
                })
                /*判断选中了几项,全部选中时改变按钮的样式*/
                this.selecctCount == this.readyList.length?this.SelectedAllFlag = false:this.SelectedAllFlag = true
            },
            /*功能：用来刷新页面，检查页面是否还有内容*/
            refreshPage(){
                this.readyList.length == 0?this.flag = true:this.flag = false
                /*按照截止时间进行排序*/
                this.readyList.sort((a, b)=>
                {
                    let aTime = new Date(a.deadlineStr+' '+a.timeStr)
                    let bTime = new Date(b.deadlineStr+' '+b.timeStr)
                    return aTime.getTime() - bTime.getTime()
                })
            }
        },
        /*在created生命周期对待办事件进行初始化*/
        created (){
            this.readyList = JSON.parse( localStorage.getItem('ready')|| '[]' )
            let overdueList = JSON.parse( localStorage.getItem('overdue')|| '[]' )
            let now, readyList
            /*计时器：每10秒监测一次，是否有超过时间未完成的事件*/
            setInterval(function () {
                readyList = JSON.parse( localStorage.getItem('ready')|| '[]' );
                now = new Date()//获取当前事件，并转换成毫秒
                for(let i= readyList.length-1;i>=0;i--){
                    let ItemDeadline = new Date(readyList[i].deadlineStr+' '+readyList[i].timeStr)//根据时间生成Date对象
                    if (  ItemDeadline.getTime() - now.getTime() <= 0) {//设定的时间超过当前时间
                        overdueList.push(readyList[i])
                        readyList.splice(i, 1)
                        localStorage.setItem('overdue',JSON.stringify(overdueList))
                        localStorage.setItem('ready', JSON.stringify(readyList))
                    }
                }},10000)
            this.refreshPage()
        }
    }
</script >

<style scoped>
 .buttonGroups >.ant-btn{
     margin-left: 25px;
 }
.ready{
    background-color: #f0f2f5;
}

 /*点击选择时，列表高亮的显示-----------*/
 .hightlight{
     background-color: #f0f2f5;
 }
/*编辑、详情、完成、删除图标*/
 .edit{
     position: absolute;
     right: 30px;
     top: 20px;
 }
 .detail{
     right: 80px;
 }
 .deleteIcon , .complete ,.edit{
     font-size: 20px;
     color: cornflowerblue;
     margin-right: 10px;
 }
</style>