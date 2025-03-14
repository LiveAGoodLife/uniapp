<template>
  <view class="detail-container">
    <!-- 标题栏 -->
    <view class="detail-header">
      <view class="back-button" @click="handleBack">
        <uni-icons type="back" size="20" color="#333"></uni-icons>
      </view>
      <text class="header-title">{{ title }}</text>
      <view class="header-right">
        <slot name="header-right"></slot>
      </view>
    </view>

    <!-- 详情内容 -->
    <scroll-view scroll-y class="detail-content">
      <block v-for="(group, groupIndex) in formattedConfig" :key="'group-' + groupIndex">
        <!-- 分组标题 -->
        <view class="group-header" v-if="group.title">
          <view class="group-title">
            <view class="title-indicator" v-if="group.indicatorColor" :style="{ backgroundColor: group.indicatorColor }"></view>
            <text>{{ group.title }}</text>
          </view>
          <view class="group-actions">
            <slot :name="`group-actions-${groupIndex}`"></slot>
          </view>
        </view>

        <!-- 分组内容 -->
        <view class="detail-group">
          <view 
            class="detail-item" 
            v-for="(item, itemIndex) in group.items" 
            :key="`item-${groupIndex}-${itemIndex}`"
            :class="{ 
              'is-required': item.required, 
              'is-error': item.error,
              'detail-item-column': item.type === 'textarea' || item.type === 'image' || item.layout === 'column'
            }"
          >
            <!-- 标签 -->
            <view class="item-label" :style="{ width: labelWidth }">
              <text class="required-mark" v-if="item.required">*</text>
              <text>{{ item.label }}</text>：
            </view>

            <!-- 内容区域 -->
            <view class="item-content">
              <!-- 文本类型 -->
              <text v-if="item.type === 'text' || !item.type" class="item-text">{{ item.value || placeholder }}</text>
              
              <!-- 选择器类型 -->
              <view v-else-if="item.type === 'select'" class="item-select">
                <text class="select-text">{{ item.value || placeholder }}</text>
                <uni-icons type="arrow-right" size="16" color="#CCCCCC"></uni-icons>
              </view>
              
              <!-- 图片类型 -->
              <view v-else-if="item.type === 'image'" class="item-image">
                <image 
                  v-if="item.value" 
                  :src="item.value" 
                  mode="aspectFill" 
                  @click="previewImage(item.value)"
                  class="preview-image"
                ></image>
                <view v-else class="image-placeholder">{{ placeholder }}</view>
              </view>
              
              <!-- 长文本类型 -->
              <view v-else-if="item.type === 'textarea'" class="item-textarea">
                <text class="textarea-content">{{ item.value || placeholder }}</text>
              </view>
              
              <!-- 电话类型 -->
              <view v-else-if="item.type === 'phone'" class="item-phone">
                <text class="phone-number">{{ item.value || placeholder }}</text>
                <view class="phone-action" v-if="item.value" @click.stop="callPhone(item.value)">
                  <uni-icons type="phone" size="18" color="#0086F6"></uni-icons>
                </view>
              </view>
              
              <!-- 日期类型 -->
              <view v-else-if="item.type === 'date'" class="item-date">
                <text>{{ item.value || placeholder }}</text>
                <uni-icons type="calendar" size="16" color="#CCCCCC"></uni-icons>
              </view>
              
              <!-- 开关类型 -->
              <view v-else-if="item.type === 'switch'" class="item-switch">
                <switch :checked="!!item.value" disabled />
              </view>
              
              <!-- 标签类型 -->
              <view v-else-if="item.type === 'tag'" class="item-tag">
                <text 
                  class="tag" 
                  :style="{ 
                    backgroundColor: item.tagColor || '#E1F0FF', 
                    color: item.tagTextColor || '#0086F6' 
                  }"
                >{{ item.value || placeholder }}</text>
              </view>
              
              <!-- 自定义插槽 -->
              <slot 
                v-else-if="item.type === 'custom'" 
                :name="`custom-${groupIndex}-${itemIndex}`" 
                :item="item"
              ></slot>
              
              <!-- 默认情况 -->
              <text v-else class="item-text">{{ item.value || placeholder }}</text>
              
              <!-- 错误信息 -->
              <text v-if="item.error" class="error-message">{{ item.error }}</text>
            </view>
          </view>
        </view>
      </block>
      
      <!-- 底部内容 -->
      <view class="detail-footer">
        <slot name="footer"></slot>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Props 定义
const props = defineProps({
  // 详情页标题
  title: {
    type: String,
    default: '详情'
  },
  // 详情配置，支持分组
  config: {
    type: Array,
    default: () => []
  },
  // 标签宽度
  labelWidth: {
    type: String,
    default: '180rpx'
  },
  // 占位符文本
  placeholder: {
    type: String,
    default: '--'
  }
});

// 事件
const emit = defineEmits(['back', 'update:config', 'itemClick']);

// 格式化配置，确保每个组都有正确的结构
const formattedConfig = computed(() => {
  // 如果配置是简单的项数组而不是分组结构，则将其转换为单一分组
  if (props.config.length && !props.config[0].items) {
    return [{
      title: '',
      items: props.config
    }];
  }
  
  // 返回原始分组结构
  return props.config;
});

// 返回上一页
const handleBack = () => {
  emit('back');
  uni.navigateBack();
};

// 预览图片
const previewImage = (url) => {
  if (!url) return;
  
  uni.previewImage({
    urls: [url],
    current: url
  });
};

// 拨打电话
const callPhone = (phoneNumber) => {
  if (!phoneNumber) return;
  
  uni.makePhoneCall({
    phoneNumber: phoneNumber
  });
};

// 点击详情项
const handleItemClick = (group, item, groupIndex, itemIndex) => {
  emit('itemClick', { item, group, groupIndex, itemIndex });
};

// 示例用法
onMounted(() => {
  console.log('通用详情组件已加载');
});
</script>

<style lang="scss" scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 标题栏 */
.detail-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  height: 44px;
  background-color: #fff;
  padding: var(--status-bar-height, 0) 15px 0;
  border-bottom: 1px solid #eee;
}

.back-button {
  width: 24px;
  height: 44px;
  display: flex;
  align-items: center;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 500;
  color: #333;
}

.header-right {
  width: 24px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* 内容区域 */
.detail-content {
  flex: 1;
  height: calc(100vh - 44px - var(--status-bar-height, 0));
}

/* 分组标题 */
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 15px 10px;
}

.group-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.title-indicator {
  width: 4px;
  height: 16px;
  border-radius: 2px;
  background-color: #0086F6;
  margin-right: 8px;
}

.group-actions {
  font-size: 14px;
  color: #0086F6;
}

/* 详情组 */
.detail-group {
  background-color: #fff;
  border-radius: 8px;
  margin: 0 15px 15px;
  padding: 5px 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* 详情项 */
.detail-item {
  display: flex;
  padding: 14px 15px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 15px;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.detail-item-column {
    flex-direction: column;
    
    .item-label {
      width: 100% !important;
      margin-bottom: 10px;
    }
    
    .item-content {
      width: 100%;
    }
  }
}

.is-required .item-label {
  position: relative;
}

.required-mark {
  color: #ff4d4f;
  margin-right: 2px;
}

.is-error .item-content {
  color: #ff4d4f;
}

.item-label {
  font-size: 15px;
  color: #666;
  min-width: 90px;
}

.item-content {
  flex: 1;
  color: #333;
  word-break: break-all;
}

/* 文本类型 */
.item-text {
  line-height: 1.4;
}

/* 选择器类型 */
.item-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-text {
  flex: 1;
}

/* 图片类型 */
.item-image {
  margin-top: 5px;
}

.preview-image {
  width: 160px;
  height: 120px;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.image-placeholder {
  width: 160px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #999;
}

/* 长文本类型 */
.item-textarea {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 10px;
  min-height: 80px;
}

.textarea-content {
  line-height: 1.5;
  word-break: break-all;
}

/* 电话类型 */
.item-phone {
  display: flex;
  align-items: center;
}

.phone-number {
  flex: 1;
}

.phone-action {
  padding: 6px;
  margin-right: -6px;
}

/* 标签类型 */
.item-tag {
  display: flex;
  margin-top: 4px;
}

.tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  background-color: #E1F0FF;
  color: #0086F6;
}

/* 错误信息 */
.error-message {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: #ff4d4f;
}

/* 底部内容 */
.detail-footer {
  padding: 20px 15px 30px;
}
</style>