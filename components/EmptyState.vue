<template>
  <view class="empty-state">
    <image 
      :src="imageSrc" 
      mode="aspectFit" 
      class="empty-image"
    ></image>
    <text class="empty-text">{{ text }}</text>
    <button 
      class="refresh-btn" 
      @click="handleRefresh"
      v-if="showRefreshButton"
    >刷新</button>
  </view>
</template>

<script setup>
const props = defineProps({
  imageSrc: {
    type: String,
    default: '/static/empty-state.png'
  },
  text: {
    type: String,
    default: '暂无数据'
  },
  showRefreshButton: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['refresh']);

const handleRefresh = () => {
  emit('refresh');
};
</script>

<style lang="scss" scoped>
@import '@/static/common.scss';

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  
  .empty-image {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: $spacing-large;
    opacity: 0.8;
  }
  
  .empty-text {
    font-size: $font-size-medium;
    color: $text-placeholder;
    margin-bottom: $spacing-large;
  }
  
  .refresh-btn {
    width: 200rpx;
    height: 70rpx;
    line-height: 70rpx;
    font-size: $font-size-medium;
    color: $primary-color;
    background-color: rgba($primary-color, 0.1);
    border: none;
    border-radius: 35rpx;
    transition: $transition-fast;
    
    &:active {
      opacity: 0.8;
    }
    
    &::after {
      border: none;
    }
  }
}
</style>