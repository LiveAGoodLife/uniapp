<template>
  <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="back-btn" @click="handleBack" v-if="showBackButton">
      <uni-icons type="left" size="20" color="#333"></uni-icons>
    </view>
    <text class="page-title">{{ title }}</text>
    <view class="right-action">
      <view 
        class="action-item scan-btn" 
        @click="handleScan" 
        v-if="showScanButton"
      >
        <uni-icons type="scan" size="24" color="#0086F6"></uni-icons>
      </view>
      <slot name="right-action"></slot>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '页面标题'
  },
  showBackButton: {
    type: Boolean,
    default: true
  },
  showScanButton: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['back', 'scan']);

const statusBarHeight = ref(0);

// 返回事件
const handleBack = () => {
  emit('back');
  uni.navigateBack({
    fail: () => {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }
  });
};

// 扫码事件
const handleScan = () => {
  emit('scan');
  uni.scanCode({
    success: (res) => {
      emit('scan-success', res);
    },
    fail: (err) => {
      uni.showToast({
        title: '扫码失败，请重试',
        icon: 'none'
      });
    }
  });
};

// 获取状态栏高度
onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 0;
});
</script>

<style lang="scss" scoped>
@import '@/static/common.scss';

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  padding: 0 $spacing-large;
  background-color: $card-background;
  border-bottom: 1rpx solid $border-color;
  position: relative;
  z-index: 100;
  box-sizing: content-box;
  
  .back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-circle;
    transition: $transition-fast;
    
    &:active {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
  
  .page-title {
    font-size: $font-size-large;
    font-weight: 600;
    color: $text-primary;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .right-action {
    display: flex;
    align-items: center;
    
    .action-item {
      padding: 0 $spacing-small;
      color: $primary-color;
      
      &:active {
        opacity: 0.7;
      }
    }
    
    .scan-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60rpx;
      height: 60rpx;
      border-radius: $radius-circle;
      
      &:active {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>