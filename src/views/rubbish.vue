<template>
    <div>
        <div class="header">
            <h2>回收站</h2>
            <div class="buttonGroups">
                <a-button type="primary" style="margin:0 30px;" @click="emptyRubbishData">清空回收站</a-button>
                <a-button type="primary"  @click="showModal('1')">删除</a-button><br/>
            </div>
        </div>
        <div class="center-content">
            <div class="WithoutContent" v-show="flag">回收站空空如也~~</div> <br/>
            <a-modal v-model="SelectVisible" @ok="deleteSelected">
                <p style="font-size: 20px"><a-icon type="question-circle" style="color: orange;"/>  是否确认删除？</p>
            </a-modal>
            <a-modal v-model="RubblishVisible" @ok="deleteItem(id)">
                <p style="font-size: 20px"><a-icon type="question-circle" style="color: orange;"/>  是否确认删除？</p>
            </a-modal>
            <ul>
                <li v-for="item in rubbishs" :key="item.id" class="ItemList">
                    <a-icon type="check-circle"
                            :class="{'checkIcon':true,'checkIconfocus':item.checkIcon}"
                            @click=" checkIconTest(item) "/>
                    <a-card hoverable :title="item.title" :class="{'card':true,'hightlight':item.checkIcon }">
                        <router-link :to="'/detail?id='+item.id+'&url=rubbish'"><a class="detail">查看详情</a></router-link>
                        <span v-if="item.content.length>170">{{item.content.slice(0,170)}}<span class="moreWords"> . . . . . .</span></span>
                        <span v-else>{{item.content}}</span><!--内容长度判断，当超过时截取-->
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
        name: "rubbish",
        data(){
            return{
                rubbishs:[],
                flag:false,
                SelectVisible:false,
                RubblishVisible:false,
                id:''
            }
        },
        methods: {
            /*确认是否添加 弹出对话框*/
            showModal(methodName,id) {
                switch (methodName) {
                    case '1': this.SelectVisible= true;break;
                    case '2': {  this.RubblishVisible = true;  this.id = id } break;
                }
            },
            /*删除一个*/
            deleteItem(id){
                this.rubbishs.some( (item,i)=>{
                    if (item.id === id){/*完成事件的删除：对本地存储进行更新*/
                        this.rubbishs.splice(i,1)
                        localStorage.setItem('rubbish',JSON.stringify(this.rubbishs))
                        return true
                    }
                })
                this.RubblishVisible =false  //隐藏确认框
                this.$message.success('成功删除该事件！');
                this.refreshPage()
            },
            /*删除选中的项*/
            deleteSelected(){
                let count =0
                for(let i=this.rubbishs.length-1;i>=0;i--){
                    if (this.rubbishs[i].checkIcon == true){
                        count++
                        this.rubbishs.splice(i, 1)
                    }
                }
                if(count == 0){
                    this.$message.error('没有选中的项目，请选中后在操作');
                }else{
                    localStorage.setItem('rubbish', JSON.stringify(this.rubbishs))
                    this.$message.success('成功操作'+count+'项！');
                }
                this.SelectVisible =false
                this.refreshPage()
            },
            /*选中单个时改变样式*/
            checkIconTest(t){
                this.rubbishs.some((item, i) => {
                    if (item.id === t.id) {
                        this.rubbishs[i].checkIcon = !this.rubbishs[i].checkIcon
                        return true
                    }
                })
            },
            /*清空回收站*/
            emptyRubbishData(){
                this.rubbishs = []
                localStorage.setItem('rubbish','')
                this.refreshPage()
                this.$message.success('回收站已清空！');
            },
            refreshPage(){
                this.rubbishs.length == 0?this.flag = true:this.flag = false
                /*按照截止时间进行排序*/
                this.rubbishs.sort((a, b)=>
                {
                    let aTime = new Date(a.deadlineStr+' '+a.timeStr)
                    let bTime = new Date(b.deadlineStr+' '+b.timeStr)
                    return aTime.getTime() - bTime.getTime()
                })
            }
        },
        created(){
            this.rubbishs = JSON.parse(localStorage.getItem('rubbish')||'[]')
            this.refreshPage()
        }
    }
</script>

<style scoped>
    .hightlight{
        background-color: #f0f2f5;
    }

</style>