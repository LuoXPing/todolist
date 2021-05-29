<template>
    <div class="overdue">
        <div class="header">
            <h2>逾期事件</h2>
            <!--按钮组：全选、删除-->
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
            <!--如果没有内容时显示这个提示-->
            <div class="WithoutContent" v-show="flag">没有逾期事件~~</div> <br/>
            <ul>
                <li v-for="item in overdueList" :key="item.id" class="ItemList">
                    <a-icon type="check-circle"
                            :class="{'checkIcon':true,'checkIconfocus':item.checkIcon}"
                            @click=" checkIconTest(item) "/>
                    <a-card hoverable :title="item.title" :class="{ 'hightlight':item.checkIcon }">
                        <router-link :to="'/detail?id='+item.id+'&url=overdue'"><a class="detail">查看详情</a></router-link>
                        <span v-if="item.content.length>170">{{item.content.slice(0,170)}}<span class="moreWords"> . . . . . .</span></span>
                        <span v-else>{{item.content}}</span><!--内容长度判断，当超过时截取-->
                        <span style="position: absolute; right: 5px; bottom: 5px;">
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
        data() {
            return {
                flag:false,//是否有内容
                SelectedAllFlag:true,//是否全选
                overdueList:[],
                SelectVisible:false,
                RubblishVisible:false,
                id:'',
                selecctCount:'0'
            }
        },
        methods: {
            showModal(methodName,id) {
                switch (methodName) {
                    case '1': this.SelectVisible= true;break;
                    case '2': {  this.RubblishVisible = true;  this.id = id;} break;
                }
            },
            SelectedAll(){
                this.overdueList.forEach((item)=>{
                    item.checkIcon = this.SelectedAllFlag
                })
                this.SelectedAllFlag =!this.SelectedAllFlag
                this.SelectedAllFlag==false?this.selecctCount = this.overdueList.length:this.selecctCount = 0
            },
            /*删除单个事件，加入到回收站*/
            deleteItem(id){
                this.overdueList.some((item, i) => {
                    if (item.id === id) {
                        var comList = JSON.parse(localStorage.getItem('rubbish') || '[]' )
                        comList.push(this.overdueList[i])
                        localStorage.setItem('rubbish', JSON.stringify(comList))
                        /*删除相应的事件，并对本地存储进行更新*/
                        this.overdueList.splice(i, 1)
                        localStorage.setItem('overdue', JSON.stringify(this.overdueList))
                        return true
                    }
                })
                this.RubblishVisible =false
                this.$message.success('已成功删除该事件！');
                this.refreshPage()
            },
            /*删除选中的事件*/
            deleteSelected(){
                var comList = JSON.parse(localStorage.getItem('rubbish') || '[]' )
                for(let i=this.overdueList.length-1;i>=0;i--){
                    if (this.overdueList[i].checkIcon == true){
                        this.overdueList[i].checkIcon  = false
                        comList.push(this.overdueList[i])
                        this.overdueList.splice(i, 1)
                    }
                }
                if(this.selecctCount == 0){
                    this.$message.error('没有选中的项目，请选中后在操作');
                }else{
                    localStorage.setItem('overdue', JSON.stringify(this.overdueList))
                    localStorage.setItem('rubbish', JSON.stringify(comList))
                    this.$message.success('成功操作'+this.selecctCount+'项！');
                }
                this.SelectVisible =false
                this.refreshPage()
            },
            /*选中单个时改变样式*/
            checkIconTest(t){
                this.overdueList.some((item, i) => {
                    if (item.id === t.id) {
                        this.overdueList[i].checkIcon = !this.overdueList[i].checkIcon
                        return true
                    }
                })
                this.selecctCount = 0
                this.overdueList.forEach((item)=>{
                    if (item.checkIcon == true){
                        this.selecctCount = parseInt( this.selecctCount )+1
                    }
                })
                /*判断选中了几项,全部选中时改变按钮的样式*/
                this.selecctCount == this.overdueList.length?this.SelectedAllFlag = false:this.SelectedAllFlag = true
            },
            /*功能：用来刷新页面，检查页面是否还有内容*/
            refreshPage(){
                this.overdueList.length == 0?this.flag = true:this.flag = false
                this.overdueList.sort((a, b)=>
                {
                    let aTime = new Date(a.deadlineStr+' '+a.timeStr)
                    let bTime = new Date(b.deadlineStr+' '+b.timeStr)
                    return aTime.getTime() - bTime.getTime()
                })
            }
        },
        /*在created生命周期对待办事件进行初始化*/
        created (){
            this.overdueList = JSON.parse( localStorage.getItem('overdue')|| '[]' )
            this.refreshPage()
        }
    }
</script >

<style scoped>

    .buttonGroups>.ant-btn{
        margin-left: 25px;
    }
    .hightlight{/*列表高亮的显示*/
        background-color: #f0f2f5;
    }
</style>