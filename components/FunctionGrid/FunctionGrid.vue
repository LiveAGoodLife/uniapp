<template>
  <view class="common-functions">
    <view class="section-header">
		<view class="checkmark-icon">
			<image class="name-icon" src="/static/icons/daiban.png" mode=""></image>
		</view>
      <text class="section-title">{{ title }}</text>
    </view>
    <view class="function-grid">
      <view 
        class="function-item" 
        v-for="func in functions" 
        :key="func.id" 
        @click="onFunctionClick(func)"
        :style="{ width: itemWidth }"
      >
        <view class="function-icon" :style="{ backgroundColor: func.color }">
          <image :src="func.icon" mode="aspectFit"></image>
        </view>
        <text class="function-name">{{ func.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  // 标题
  title: {
    type: String,
    default: '常用功能'
  },
  // 功能列表
  functions: {
    type: Array,
    default: () => []
  },
  // 每行显示的功能数量
  columnsPerRow: {
    type: Number,
    default: 4
  }
});

const emit = defineEmits(['function-click']);

// 计算每个功能项的宽度
const itemWidth = computed(() => {
  return `${100 / props.columnsPerRow}%`;
});

// 点击功能项
const onFunctionClick = (func) => {
  emit('function-click', func);
};
</script>

<style lang="scss" scoped>
.common-functions {
  margin: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-header {
	 display: flex;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.section-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
 
}

.function-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 10rpx;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.function-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16rpx;

  image {
    width: 100%;
    height: 100%;
  }
}
.name-icon{
	width: 36rpx;
	height:36rpx;
}
.checkmark-icon{
	margin-right:10rpx ;
}
.function-name {
  font-size: 24rpx;
  color: #333;
  text-align: center;
}
</style>