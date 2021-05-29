<template>
    <div class="completed">
        <div class="header">
            <h2>完成事件</h2>
            <!--按钮组-->
            <div class="buttonGroups">
                <a-button type="primary"  @click="SelectedAll" v-show="!flag">
                    <span v-if="SelectedAllFlag" >全选</span>
                    <span v-else>取消全选</span>
                </a-button>
                <a-button type="primary"  @click="showModal('1')">删除</a-button>
            </div>
        </div>
        <div class="center-content">
            <!--提示框-->
            <a-modal v-model="SelectVisible" @ok="deleteSelected">
                <p style="font-size: 20px"><a-icon type="question-circle" style="color: orange;"/>  是否确认删除？</p>
            </a-modal>
            <a-modal v-model="RubblishVisible" @ok="deleteItem(id)">
                <p style="font-size: 20px"><a-icon type="question-circle" style="color: orange;"/>  是否确认删除？</p>
            </a-modal>
            <!-- 如果没有内容时显示提示信息 -->
            <div class="WithoutContent" v-show="flag">没有已完成事件~~</div><br/>
            <!--有内容则以列表形式显示-->
            <br/>
            <ul>
                <li v-for="item in completeList" :key="item.id" class="ItemList">
                    <a-icon type="check-circle"
                            :class="{'checkIcon':true,'checkIconfocus':item.checkIcon}"
                            @click=" checkIconTest(item) "/>
                    <a-card hoverable :title="item.title" :class="{ hightlight:item.checkIcon }">
                        <router-link :to="'/detail?id='+item.id+'&url=complete'"><a class="detail">查看详情</a></router-link>
                        <!--内容长度判断，当超过170时截取-->
                        <span v-if="item.content.length>170">{{item.content.slice(0,170)}}<span class="moreWords"> . . . . . .</span></span>
                        <span v-else>{{item.content}}</span>
                        <span style="position: absolute; right: 10px; bottom: 5px;">
                         <span style="font-size: 16px">截止时间：{{item.deadlineStr}}&nbsp;{{item.timeStr}} </span>
                        <a-icon  class="deleteIcon" type="delete" @click="showModal('2',item.id)" title="删除" />
                    </span>
                    </a-card>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "completeData",
        data() {
            return {
                completeList:[],
                flag:false,
                SelectedAllFlag:true,
                SelectVisible:false,
                RubblishVisible:false,
                id:'',
                selecctCount:'0'
            }
        },
        methods: {
            /*确认是否添加 弹出对话框*/
            showModal(methodName,id) {
                switch (methodName) {
                    case '1': this.SelectVisible= true;break;
                    case '2': {  this.RubblishVisible = true;  this.id = id;} break;
                }
            },
            /*全选*/
            SelectedAll(){
                this.completeList.forEach((item)=>{
                    item.checkIcon = this.SelectedAllFlag
                })
                this.SelectedAllFlag = !this.SelectedAllFlag
                this.SelectedAllFlag==false?this.selecctCount = this.completeList.length:this.selecctCount = 0
            },
            /*删除一个事件*/
            deleteItem(id){
                this.completeList.some((item, i) => {
                    if (item.id === id) {
                        var comList = JSON.parse(localStorage.getItem('rubbish') || '[]' )
                        comList.push(this.completeList[i])
                        localStorage.setItem('rubbish', JSON.stringify(comList))
                        /*删除相应的代办事件，并并对本地存储进行更新*/
                        this.completeList.splice(i, 1)
                        localStorage.setItem('complete', JSON.stringify(this.completeList))
                        return true
                    }
                })
                this.$message.success('成功删除该事件！');
                this.RubblishVisible =false
                this.refreshPage()
            },
            /*删除选中的事件*/
            deleteSelected(){
                var comList = JSON.parse(localStorage.getItem('rubbish') || '[]' )
                for(let i=this.completeList.length-1;i>=0;i--){
                    if (this.completeList[i].checkIcon == true){
                        this.completeList[i].checkIcon  = false
                        comList.push(this.completeList[i])
                        this.completeList.splice(i, 1)
                    }
                }
                if(this.selecctCount  == 0){
                    this.$message.error('没有选中的事件，请选中后在操作');
                }else{
                    localStorage.setItem('complete', JSON.stringify(this.completeList))
                    localStorage.setItem('rubbish', JSON.stringify(comList))
                    this.$message.success('成功操作'+this.selecctCount +'项！');
                }
                this.SelectVisible =false
                this.refreshPage()
            },

            /*选中单个时改变样式*/
            checkIconTest(t){
                this.completeList.some((item, i) => {
                    if (item.id === t.id) {
                        this.completeList[i].checkIcon = !this.completeList[i].checkIcon
                        return true
                    }
                })
                /*用于计数选中了几项*/
                this.selecctCount = 0
                this.completeList.forEach((item)=>{
                    if (item.checkIcon == true){
                        this.selecctCount = parseInt( this.selecctCount )+1
                    }
                })
                /*判断选中了几项,全部选中时改变按钮的样式*/
                this.selecctCount == this.completeList.length?this.SelectedAllFlag = false:this.SelectedAllFlag = true
            },
            /*功能：用来刷新页面，检查页面是否还有内容*/
            refreshPage(){
                this.completeList.length == 0?this.flag = true:this.flag = false
                this.completeList.sort((a, b)=>
                {
                    let aTime = new Date(a.deadlineStr+' '+a.timeStr)
                    let bTime = new Date(b.deadlineStr+' '+b.timeStr)
                    return aTime.getTime() - bTime.getTime()
                })
            }
        },
        /*在created生命周期对完成事件进行初始化*/
        created (){
            this.completeList = JSON.parse(localStorage.getItem('complete') || '[]')
            this.refreshPage()
        }
    }
</script>

<style scoped>

    .buttonGroups>.ant-btn{
        margin-left: 25px;
    }
/*点击选择时，图标和列表的样式 的改变-----------*/
    .hightlight{
        background-color: #f0f2f5;
    }
</style>