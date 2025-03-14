<template>
  <view class="todo-list-container">
    <!-- 标题栏 -->
    <view class="header">
      <view class="back-button" @click="handleBack">
        <uni-icons type="back" size="24" color="#333"></uni-icons>
      </view>
      <view class="title">{{title}}</view>
      <view class="right-placeholder"></view>
    </view>
    
    <!-- 任务列表 -->
    <scroll-view scroll-y class="todo-list" 
                enable-back-to-top 
                refresher-enabled
                :refresher-triggered="isRefreshing"
                @refresherrefresh="onRefresh">
      <view class="todo-list-inner">
        <view 
          class="todo-card" 
          v-for="(item, index) in displayItems" 
          :key="item.id || index"
          :style="{ animationDelay: index * 0.05 + 's' }"
        >
          <view class="priority-indicator" :class="getPriorityClass(item.priority)"></view>
          <view class="todo-content">
            <view class="todo-title-row">
              <view class="todo-title">{{item.title}}</view>
              <view class="todo-status" :class="getStatusClass(item.status)">
                {{getStatusText(item.status)}}
              </view>
            </view>
            <view class="todo-desc">{{item.description}}</view>
            <view class="todo-meta">
              <view class="meta-left">
                <text class="todo-creator">{{item.creator}}</text>
                <text class="todo-time">创建时间：{{item.createTime}}</text>
              </view>
              <view class="meta-tag" v-if="item.tag">{{item.tag}}</view>
            </view>
          </view>
          <view class="todo-action">
            <button 
              class="detail-btn" 
              @click.stop="viewDetail(item)"
            >详情</button>
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <view class="load-more" v-if="displayItems.length > 0">
        <text class="load-more-text">已加载全部</text>
      </view>
    </scroll-view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-if="displayItems.length === 0">
      <image class="empty-image" :src="emptyImage" mode="aspectFit"></image>
      <text class="empty-text">暂无待办任务</text>
      <button class="refresh-btn" @click="onRefresh">刷新</button>
    </view>
    
    <!-- 快速回到顶部 -->
    <view class="back-to-top" @click="scrollToTop" v-if="showBackToTop">
      <uni-icons type="top" size="20" color="#fff"></uni-icons>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// Props 定义
const props = defineProps({
  // 页面标题
  title: {
    type: String,
    default: '待办任务'
  },
  // 任务列表数据
  items: {
    type: Array,
    default: () => []
  },
  // 空状态图片
  emptyImage: {
    type: String,
    default: '/static/icons/empty.png'
  }
});

// 事件
const emit = defineEmits(['back', 'detail', 'refresh']);

// 刷新状态
const isRefreshing = ref(false);
// 是否显示回到顶部按钮
const showBackToTop = ref(false);

// 使用计算属性确保响应式
const displayItems = computed(() => props.items);

// 返回按钮点击事件
const handleBack = () => {
  emit('back');
  uni.navigateBack();
};

// 查看详情事件
const viewDetail = (item) => {
  emit('detail', item);
};

// 下拉刷新
const onRefresh = () => {
  isRefreshing.value = true;
  
  // 触发父组件刷新事件
  emit('refresh');
  
  // 模拟刷新延迟
  setTimeout(() => {
    isRefreshing.value = false;
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    });
  }, 1000);
};

// 回到顶部
const scrollToTop = () => {
  // 使用uni-app API滚动到顶部
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  });
};

// 获取优先级样式类
const getPriorityClass = (priority) => {
  switch(priority) {
    case 'high':
      return 'priority-high';
    case 'medium':
      return 'priority-medium';
    case 'low':
      return 'priority-low';
    default:
      return 'priority-normal';
  }
};

// 获取状态样式类
const getStatusClass = (status) => {
  switch(status) {
    case 'pending':
      return 'status-pending';
    case 'processing':
      return 'status-processing';
    case 'completed':
      return 'status-completed';
    case 'overdue':
      return 'status-overdue';
    default:
      return 'status-pending';
  }
};

// 获取状态文本
const getStatusText = (status) => {
  switch(status) {
    case 'pending':
      return '待处理';
    case 'processing':
      return '处理中';
    case 'completed':
      return '已完成';
    case 'overdue':
      return '已逾期';
    default:
      return '待处理';
  }
};

// 监听滚动事件，显示或隐藏回到顶部按钮
onMounted(() => {
  uni.onPageScroll(({ scrollTop }) => {
    showBackToTop.value = scrollTop > 300;
  });
});
</script>

<style lang="scss" scoped>
.todo-list-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f9fc;
  position: relative;
}

/* 标题栏样式 */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
  padding: 0 30rpx;
  /* 适配刘海屏 */
  padding-top: var(--status-bar-height, 0);
  box-sizing: content-box;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
}

.back-button {
  width: 70rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.title {
  font-size: 34rpx;
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
  text-align: center;
  letter-spacing: 1rpx;
}

.right-placeholder {
  width: 70rpx;
}

/* 任务列表样式 */
.todo-list {
  flex: 1;
  height: calc(100vh - 88rpx - var(--status-bar-height, 0));
}

.todo-list-inner {
  padding: 24rpx;
}

/* 卡片样式 */
.todo-card {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 0;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20rpx);
  
  &:active {
    transform: translateY(2rpx) scale(0.99);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.priority-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 8rpx;
  height: 100%;
  
  &.priority-high {
    background-color: #ff4757;
  }
  
  &.priority-medium {
    background-color: #ff9f43;
  }
  
  &.priority-low {
    background-color: #2ed573;
  }
  
  &.priority-normal {
    background-color: #70a1ff;
  }
}

.todo-content {
  flex: 1;
  padding: 30rpx 30rpx 30rpx 40rpx;
  display: flex;
  flex-direction: column;
}

.todo-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.todo-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
  flex: 1;
}

.todo-status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 30rpx;
  margin-left: 16rpx;
  white-space: nowrap;
  
  &.status-pending {
    color: #70a1ff;
    background-color: rgba(112, 161, 255, 0.1);
  }
  
  &.status-processing {
    color: #1e90ff;
    background-color: rgba(30, 144, 255, 0.1);
  }
  
  &.status-completed {
    color: #2ed573;
    background-color: rgba(46, 213, 115, 0.1);
  }
  
  &.status-overdue {
    color: #ff4757;
    background-color: rgba(255, 71, 87, 0.1);
  }
}

.todo-desc {
  font-size: 28rpx;
  color: #7f8c8d;
  margin-bottom: 24rpx;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
  color: #95a5a6;
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
  padding-top: 20rpx;
}

.meta-left {
  display: flex;
  flex-direction: column;
}

.todo-creator {
  margin-bottom: 6rpx;
  font-weight: 500;
}

.meta-tag {
  padding: 4rpx 16rpx;
  background-color: #ecf0f1;
  color: #7f8c8d;
  border-radius: 30rpx;
  font-size: 22rpx;
}

.todo-action {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  border-left: 1rpx solid rgba(0, 0, 0, 0.05);
  align-self: stretch;
  justify-content: center;
}

.detail-btn {
  background: linear-gradient(135deg, #0086F6, #0062dd);
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
  outline: none;
  height: 70rpx;
  line-height: 70rpx;
  padding: 0 32rpx;
  margin: 0;
  border-radius: 35rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 134, 246, 0.3);
  transition: all 0.3s;
  
  &:after {
    border: none;
  }
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 8rpx rgba(0, 134, 246, 0.2);
    background: linear-gradient(135deg, #0075d9, #004eb7);
  }
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 30rpx 0 50rpx;
}

.load-more-text {
  font-size: 26rpx;
  color: #95a5a6;
  position: relative;
  
  &:before, &:after {
    content: '';
    position: absolute;
    top: 50%;
    width: 100rpx;
    height: 1rpx;
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &:before {
    right: calc(100% + 20rpx);
  }
  
  &:after {
    left: calc(100% + 20rpx);
  }
}

/* 空状态样式 */
.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  width: 100%;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.empty-image {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 30rpx;
  opacity: 0.8;
}

.empty-text {
  font-size: 30rpx;
  color: #95a5a6;
  margin-bottom: 30rpx;
}

.refresh-btn {
  background-color: transparent;
  color: #0086F6;
  font-size: 28rpx;
  border: 1rpx solid #0086F6;
  border-radius: 40rpx;
  padding: 8rpx 40rpx;
  
  &:after {
    border: none;
  }
  
  &:active {
    background-color: rgba(0, 134, 246, 0.05);
  }
}

/* 回到顶部按钮 */
.back-to-top {
  position: fixed;
  right: 40rpx;
  bottom: 80rpx;
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #0086F6, #0062dd);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 20rpx rgba(0, 134, 246, 0.3);
  transform: translateY(200rpx);
  transition: transform 0.3s ease;
  z-index: 99;
  
  &.show {
    transform: translateY(0);
  }
  
  &:active {
    transform: scale(0.95);
  }
}
</style>