<template>
  <div class="box">
    <div style="width: 100%; height: 100%; position: fixed; left:0; background-color: #f0f2f5;"></div>
    <!--侧边栏-->
      <div class="sidebar">
        <div class="logo"><span class="titleWord">TodoList</span></div>
        <!--按钮选项-->
        <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['1']">
          <a-menu-item key="1">
            <router-link to='/'><a-icon type="plus-circle" /><span class="nav-text">添加备忘事件</span></router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link to='/ready'><a-icon type="clock-circle" /><span class="nav-text">待办事件</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link to='/complete'><a-icon type="check-circle" /><span class="nav-text">已完成事件</span></router-link >
          </a-menu-item>
          <a-menu-item key="4">
            <router-link to='/overdue'><a-icon type="close-circle" /><span class="nav-text">逾期事件</span></router-link>
          </a-menu-item>
          <a-menu-item key="5">
            <router-link to='/rubbish'><a-icon type="delete" /><span class="nav-text">回收站</span></router-link>
          </a-menu-item>
        </a-menu>
      </div>
      <!--主体内容-->
      <div class="main-content">
          <router-view></router-view>
      </div>
      <!--尾部-->
      <div class="footer">
        TodoList ©2019
      </div>
  </div>
</template>
<style>
  /*中间的内容*/
  .sidebar{
    width:200px;
    height:100%;
    overflow: auto;
    position: fixed;
    left: 0;
    top:0;
    background-color: #001529;
    z-index: 99;
  }
   .logo {
    height: 32px;
    margin: 16px;
  }
  .titleWord{
    font-weight: bolder;
    font-size: 20px;
    color: #fff;
    display: block;
    position: absolute;
    left: 50px;
    top: 17px;
  }
  .main-content{
    width: 85%;
    margin-left: 200px;
    position: absolute;
    }
  /*-----------------路由页面中的样式------------*/
  /*头部*/
  .header{
    color: rgba(0, 0, 0, 0.65);
    width: 100%;
    height: 70px;
    position: fixed;
    top: 0;
    z-index: 9;
    background-color: #fff;
    box-shadow: 2px 2px #eee;
  }
  .header >h2{
    padding:20px 80px;
  }
  /*按钮组的样式*/
  .buttonGroups{
    position: absolute;
    right: 220px;
    top: 20px;
  }
  /*内容*/
  .center-content{
    padding: 50px;
    width: 95%;
    background-color: #fff;
    margin: 100px 2% 0 2%;
    min-height: 700px;
  }
  /*没有内容时显示的文字样式---------*/
  .WithoutContent{
    width: 600px;
    margin: 200px 400px;
    font-size: 20px;
  }
  ul{
    width: 90%;
  }
  /*列表的样式*/
  .ItemList{
    list-style: none;
    position: relative;
    margin-top: 20px;
    box-shadow: 2px 2px rgb(192, 184, 184);
  }
  /*点击选择时，图标和列表的样式 的改变-*/
  .checkIcon{
    position: absolute;
    left: -25px;
    top: 15px;
    font-size: 20px;
    color: #e8e8e8;
    cursor: pointer;
  }
  /*图标高亮的显示*/
  .checkIconfocus{
    color: #98c553;
  }
  /*删除图标的显示*/
  .deleteIcon{
    font-size: 20px;
    color: cornflowerblue;
    margin-right: 10px;
  }
  /*查看详情*/
  .detail{
    position: absolute;
    right: 30px;
    top: 20px;
  }
  /*截取时，"..."的显示*/
  .moreWords{
    font-size: 18px;
    font-weight: bolder;
  }

  /*底部栏目*/
  .footer{
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0;
    left: 0;
    padding-left:700px ;
    line-height: 50px;
    font-size: 20px;
    background-color: #f0f2f5;
  }

</style>