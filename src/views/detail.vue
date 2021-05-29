<template>
    <div class="main">
        <div class="header"><h2>详情页面</h2></div>
        <div class="center-content">
            <div style="margin-bottom: 18px">
                <a-input addonBefore="标题：" v-model="list.title" disabled/>
            </div>
            <div style="margin-bottom: 17px">
                <label>内容：</label>
                <a-textarea :rows="12" v-model="list.content" disabled style="font-size: 20px"/>
            </div>
            <a-input addonBefore="截止时间：" v-model="deadline" disabled/>
            <a-button type="primary"  block @click="reBack" style="margin: 10px 0">返回</a-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "detail",
        data () {
            return {
                uri:'',
                list:{},
                deadline:''
            }
        },
        methods :{
            reBack(){
                this.$router.push('/'+this.uri)
            }
        },
        created(){
            this.uri = this.$route.query.url
            let itemList = JSON.parse(localStorage.getItem(this.uri))
            itemList.some((item,i)=>{
                if (item.id == this.$route.query.id) {
                    this.list = itemList[i]
                    return true
                }
            })
            this.deadline = this.list.deadlineStr+'  '+this.list.timeStr
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