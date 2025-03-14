<template>
  <view class="header-card" >
    <view class="card" :style="cardStyle">
      <!-- 用户信息区域 -->
      <view class="user-info" v-if="showUserInfo">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
        <view class="greeting">
          <text class="hello">{{ userInfo.greeting || 'Hello' }}, {{ userInfo.name }}</text>
          <view class="tag" @click="onTagClick" v-if="userInfo.tagName">
            <text class="tag-text">{{ userInfo.tagName }}</text>
          </view>
        </view>
      </view>
      
      <!-- 自定义头部插槽 -->
      <slot name="header"></slot>
      
      <!-- 数据统计区域 -->
      <view class="stats-container" v-if="statsItems.length > 0">
        <view 
          class="stats-item" 
          v-for="(item, index) in statsItems" 
          :key="index"
          @click="onStatsItemClick(item)"
          :style="{ width: 100 / statsItems.length + '%' }"
        >
          <text class="count">{{ item.count }}{{ item.unit || '' }}</text>
          <text class="label">{{ item.label }}</text>
        </view>
      </view>
      
      <!-- 自定义底部插槽 -->
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

// 定义组件属性
const props = defineProps({
  // 用户信息
  userInfo: {
    type: Object,
    default: () => ({
      name: '用户',
      avatar: '/static/default-avatar.png',
      greeting: 'Hello',
      tagName: ''
    })
  },
  // 统计数据项
  statsItems: {
    type: Array,
    default: () => []
  },
  // 是否显示用户信息区域
  showUserInfo: {
    type: Boolean,
    default: true
  },

  // 卡片背景色
  backgroundColor: {
    type: String,
    default: '#1890ff'
  },
  // 是否使用渐变背景
  useGradient: {
    type: Boolean,
    default: true
  },
  // 渐变开始颜色
  gradientStartColor: {
    type: String,
    default: '#1890ff'
  },
  // 渐变结束颜色
  gradientEndColor: {
    type: String,
    default: '#0076e4'
  },
  // 卡片圆角大小
  borderRadius: {
    type: [String, Number],
    default: 16
  },
  // 卡片内边距
  padding: {
    type: [String, Number],
    default: 30
  }
});

// 定义组件事件
const emit = defineEmits(['tag-click', 'stats-item-click']);

// 生成卡片样式
const cardStyle = computed(() => {
  const style = {
    padding: typeof props.padding === 'number' ? props.padding + 'rpx' : props.padding,
    borderRadius: typeof props.borderRadius === 'number' ? props.borderRadius + 'rpx' : props.borderRadius
  };
  
  // 设置背景色或渐变
  if (props.useGradient) {
    style.background = `linear-gradient(135deg, ${props.gradientStartColor}, ${props.gradientEndColor})`;
  } else {
    style.backgroundColor = props.backgroundColor;
  }
  
  

  
  return style;
});

// 标签点击事件
const onTagClick = () => {
  emit('tag-click', props.userInfo);
};

// 统计项点击事件
const onStatsItemClick = (item) => {
  emit('stats-item-click', item);
};
</script>

<style lang="scss">
.header-card {
  padding: 20rpx 30rpx;
  
  &.fixed {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    
    /* 处理不支持sticky的平台 */
    /* #ifdef H5 || APP-PLUS */
    position: fixed;
    width: 100%;
    box-sizing: border-box;
    /* #endif */
  }
}

.card {
  color: #ffffff;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
 
  // 添加气泡背景效果
  &::before {
    content: '';
    position: absolute;
    top: -60rpx;
    right: -60rpx;
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 40rpx;
    right: 40rpx;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 1;
  }
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  position: relative;
  z-index: 2;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #fff;
  margin-right: 20rpx;
}

.greeting {
  display: flex;
  flex-direction: column;
}

.hello {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 10rpx;
}

.tag {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  padding: 4rpx 16rpx;
  display: inline-flex;
  align-self: flex-start;
}

.tag-text {
  font-size: 24rpx;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 10rpx;
    bottom: 10rpx;
    width: 1rpx;
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.count {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.label {
  font-size: 24rpx;
  opacity: 0.9;
}
</style>