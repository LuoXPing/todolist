<template>
    <div class="main">
        <div class="header"><h2>编辑页面</h2></div>
        <div class="center-content">
            <a-button  @click="flag=false" style="position: absolute; top: 110px; right: 60px;">编辑</a-button>
            <div style="margin-bottom: 18px">
                <a-input addonBefore="标题：" v-model="list.title" :disabled="flag"/>
            </div>
            <div style="margin-bottom: 17px">
                <label>内容：</label>
                <a-textarea :rows="16" v-model="list.content" :disabled="flag"/>
            </div>
            <div style="margin-bottom: 17px">
                <label>截止时间：</label>
                <a-date-picker @change="onChange" :value="list.deadline" :disabled="flag"/> &nbsp;
                <a-time-picker @change="onChange2" :value="list.time" :disabled="flag"/>
            </div>
            <br/>
            <a-button type="primary" @click="showModal" style="margin: 15px 100px 0 400px; width: 100px;">确定</a-button>
            <!--提示框-->
            <a-modal v-model="visible" @ok="modified">
                <p style="font-size: 20px"><a-icon type="question-circle" style="color: orange;"/>  是否确认修改？</p>
            </a-modal>
            <a-button type="primary" @click="reBack" style="width: 100px;">返回</a-button>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        name: "detail",
        data () {
            return {
                list:{},
                itemList:[],
                dateString:'',
                timeString:'',
                flag:true,
                visible:false
            }
        },
        methods :{
            /*确认是否添加 弹出对话框*/
            showModal() {
                this.visible = true
            },
            modified(){
                this.itemList.some((item,i)=>{
                    if (item.id == this.list.id) {
                        this.itemList.splice(i,1,this.list)/*实现修改后替换原来的数据*/
                        localStorage.setItem('ready',JSON.stringify(this.itemList))
                        return true
                    }
                })
                this.flag= true
                this.visible = false
                this.$message.success('成功修改该事件！');
            },/*返回*/
            reBack(){
                this.$router.push('/ready')
            },
            /*处理时间*/
            onChange(date, dateString) {
                this.list.deadline =  date;
                this.list.deadlineStr  =  dateString;
            },
            onChange2(time,timestring){
                this.list.time = time
                this.list.timeStr = timestring
            }
        },
        created(){
            this.itemList = JSON.parse(localStorage.getItem('ready'))
            this.itemList.some((item,i)=>{
                if (item.id == this.$route.query.id) {
                    this.list = this.itemList[i]
                    this.list.deadline = moment(this.list.deadline);
                    this.list.time = moment(this.list.time);
                    return true
                }
            })
        }
    }

</script>
<style scoped>
    label{
        color: rgba(0, 0, 0, 0.65);
        font-size: 16px;
        display: inline-block;
        padding: 0 0 10px 5px;
    }
</style>