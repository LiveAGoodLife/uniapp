<template>
  <view class="page-container">
    <todo-list 
      :title="pageTitle" 
      :items="todoItems" 
      @back="handleBack" 
      @detail="handleViewDetail"
    ></todo-list>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TodoList from '@/components/TodoList/TodoList.vue';

// 页面标题
const pageTitle = ref('待办任务');

// 任务列表数据
const todoItems = ref([]);

// 返回按钮处理
const handleBack = () => {
  console.log('返回上一页');
};

// 查看详情处理
const handleViewDetail = (item) => {
  console.log('查看详情:', item);
  
  // 导航到详情页面并传递任务ID
  uni.navigateTo({
    url: `/pages/common/detail?id=${item.id}&title=${encodeURIComponent(item.title)}`
  });
};

// 页面加载时获取任务数据
onMounted(() => {

  
  // 从URL参数获取模块ID
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.$page?.options || {};
  
  // 合并两种方式获取的参数
  const moduleId = options.module  || '';
  console.log(moduleId)
  // 设置页面标题
  if (moduleId) {
    switch(moduleId) {
      case 'device':
        pageTitle.value = '设备待办任务';
        break;
      case 'quality':
        pageTitle.value = '质量待办任务';
        break;
      case 'warehouse':
        pageTitle.value = '仓库待办任务';
        break;
      default:
        pageTitle.value = '待办任务';
    }
  }
  
  // 根据模块ID加载相应的待办任务
  loadTodoByModule(moduleId);
});

// 根据模块加载待办任务
const loadTodoByModule = (moduleId) => {
  uni.showLoading({ title: '加载中...' });
  
  // 这里可以调用真实的API，根据moduleId参数获取不同的待办数据
  // const url = `/api/todos?moduleId=${moduleId}`;
  // uni.request({
  //   url: url,
  //   method: 'GET',
  //   success: (res) => {
  //     todoItems.value = res.data;
  //     uni.hideLoading();
  //   },
  //   fail: (err) => {
  //     console.error('获取待办任务失败', err);
  //     uni.hideLoading();
  //     uni.showToast({
  //       title: '加载失败',
  //       icon: 'none'
  //     });
  //   }
  // });
  
  // 模拟API请求
  setTimeout(() => {
    // 根据不同模块返回不同数据
    if (moduleId === 'device') {
      todoItems.value = [
        {
          id: 'd1',
          title: '设备保修待审核',
          description: 'XXXXX设备报修待审核......',
          creator: '赵文林',
          createTime: '2023-06-12 16:30'
        },
        {
          id: 'd2',
          title: '设备保修待审核',
          description: 'XXXXX设备报修待审核......',
          creator: '赵文林',
          createTime: '2023-06-12 16:30'
        }
      ];
    } else if (moduleId === 'quality') {
      todoItems.value = [
        {
          id: 'q1',
          title: '质量检测待处理',
          description: 'XXXXX产品质量检测待处理......',
          creator: '李明',
          createTime: '2023-06-12 15:40'
        },
        {
          id: 'q2',
          title: '质量报告待审核',
          description: 'XXXXX质量报告待审核......',
          creator: '张三',
          createTime: '2023-06-12 14:20'
        }
      ];
    } else if (moduleId === 'warehouse') {
      todoItems.value = [
        {
          id: 'w1',
          title: '入库申请待审核',
          description: 'XXXXX物料入库申请待审核......',
          creator: '王五',
          createTime: '2023-06-12 13:10'
        },
        {
          id: 'w2',
          title: '出库任务待处理',
          description: 'XXXXX物料出库任务待处理......',
          creator: '李四',
          createTime: '2023-06-12 11:20'
        }
      ];
    } else {
      // 默认数据
      todoItems.value = [
        {
          id: '1',
          title: '设备保修待审核',
          description: 'XXXXX设备报修待审核......',
          creator: '赵文林',
          createTime: '2023-06-12 16:30'
        },
        {
          id: '2',
          title: '设备保修待审核',
          description: 'XXXXX设备报修待审核......',
          creator: '赵文林',
          createTime: '2023-06-12 16:30'
        },
        {
          id: '3',
          title: '设备保修待审核',
          description: 'XXXXX设备报修待审核......',
          creator: '赵文林',
          createTime: '2023-06-12 16:30'
        },
        {
          id: '4',
          title: '设备保修待审核',
          description: 'XXXXX设备报修待审核......',
          creator: '赵文林',
          createTime: '2023-06-12 16:30'
        },
        {
          id: '5',
          title: '设备保修待审核',
          description: 'XXXXX设备报修待审核......',
          creator: '赵文林',
          createTime: '2023-06-12 16:30'
        },
        {
          id: '6',
          title: '设备保修待审核',
          description: 'XXXXX设备报修待审核......',
          creator: '赵文林',
          createTime: '2023-06-12 16:30'
        },
        {
          id: '7',
          title: '设备保修待审核',
          description: 'XXXXX设备报修待审核......',
          creator: '赵文林',
          createTime: '2023-06-12 16:30'
        }
      ];
    }
    console.log(todoItems.value)
    uni.hideLoading();
  }, 500);
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>