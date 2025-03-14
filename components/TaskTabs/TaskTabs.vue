<!-- TaskTabs.vue -->
<template>
  <view class="task-list-container">
    <!-- 任务类型切换Tab -->
    <view class="task-tabs">
      <view 
        v-for="(tab, index) in props.tabs" 
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @click="switchTab(index)"
      >
        <text>{{ tab.name }}</text>
      </view>
      <view class="tab-line" :style="{ left: tabLineLeft + 'px', width: tabLineWidth + 'px' }"></view>
    </view>
    
    <!-- 任务列表 -->
    <view class="task-list">
      <template v-if="currentTasks.length > 0">
        <view 
          class="task-card"
          v-for="(task, index) in currentTasks" 
          :key="index"
          @click="handleTaskClick(task)"
        >
          <!-- 任务标题 -->
          <view class="task-title">
            <view class="title-icon" v-if="task.icon">
              <text class="icon" :class="task.icon"></text>
            </view>
            <text class="title-text">{{ task.title }}</text>
          </view>
          
          <!-- 任务标签 -->
          <view class="task-tags">
            <view 
              class="task-tag" 
              v-for="(tag, tagIndex) in task.tags" 
              :key="tagIndex"
              :class="{'tag-selected': tag.selected}"
            >
              {{ tag.name || tag }}
            </view>
          </view>
          
          <!-- 任务详细信息 -->
          <view class="task-info">
            <view class="info-item" v-if="task.startTime">
              <text class="info-label">计划开始时间：</text>
              <text class="info-value">{{ task.startTime }}</text>
            </view>
            
            <view class="info-item" v-if="task.duration">
              <text class="info-label">计划工时：</text>
              <text class="info-value">{{ task.duration }}</text>
            </view>
            
            <view class="info-item" v-if="task.count !== undefined">
              <text class="info-label">加工数量：</text>
              <text class="info-value">{{ task.count }}</text>
            </view>
            
            <view class="info-item" v-if="task.workers">
              <text class="info-label">工序：</text>
              <text class="info-value">{{ task.workers }}</text>
            </view>
          </view>
          
          <!-- 任务底部信息 -->
          <view class="task-footer" v-if="task.status || props.showActionButton">
            <view class="task-status" v-if="task.status">
              <view class="status-dot" :class="getStatusClass(task.status)"></view>
              <text class="status-text">{{ task.status }}</text>
            </view>
            
            <view 
              class="action-button" 
              v-if="props.showActionButton && task.status === '未开始'" 
              @click.stop="handleActionClick(task)"
            >
              {{ task.actionText || '未开始' }}
            </view>
          </view>
        </view>
      </template>
      
      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <image class="empty-image" :src="props.emptyImage" mode="aspectFit"></image>
        <text class="empty-text">{{ props.emptyText || `当前没有${props.tabs[currentTab].name}` }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';

const props = defineProps({
  // Tab配置
  tabs: {
    type: Array,
    default: () => [
      { name: '生产任务', key: 'production' },
      { name: '点检任务', key: 'inspection' },
      { name: '保养任务', key: 'maintenance' }
    ]
  },
  // 生产任务数据
  productionTasks: {
    type: Array,
    default: () => []
  },
  // 点检任务数据
  inspectionTasks: {
    type: Array,
    default: () => []
  },
  // 保养任务数据
  maintenanceTasks: {
    type: Array,
    default: () => []
  },
  // 初始选中的Tab索引
  initialTab: {
    type: Number,
    default: 0
  },
  // 空状态图片
  emptyImage: {
    type: String,
    default: '/static/icons/empty.png'
  },
  // 空状态文本
  emptyText: {
    type: String,
    default: ''
  },
  // 是否显示操作按钮
  showActionButton: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['tab-change', 'task-click', 'action-click']);

// 响应式状态
const currentTab = ref(props.initialTab);
const tabLineLeft = ref(0);
const tabLineWidth = ref(40);

// 根据当前选中的Tab，获取对应的任务列表
const currentTasks = computed(() => {
  switch (props.tabs[currentTab.value].key) {
    case 'production':
      return props.productionTasks;
    case 'inspection':
      return props.inspectionTasks;
    case 'maintenance':
      return props.maintenanceTasks;
    default:
      return [];
  }
});

// 切换Tab
const switchTab = (index) => {
  currentTab.value = index;
  updateTabLine();
  emit('tab-change', {
    index,
    key: props.tabs[index].key,
    name: props.tabs[index].name
  });
};

// 获取任务状态对应的样式类
const getStatusClass = (status) => {
  switch (status) {
    case '未开始':
      return 'status-not-started';
    case '进行中':
      return 'status-in-progress';
    case '已完成':
      return 'status-completed';
    default:
      return '';
  }
};

// 任务点击事件
const handleTaskClick = (task) => {
  emit('task-click', {
    task,
    tabIndex: currentTab.value,
    tabKey: props.tabs[currentTab.value].key
  });
};

// 操作按钮点击事件
const handleActionClick = (task) => {
  emit('action-click', {
    task,
    tabIndex: currentTab.value,
    tabKey: props.tabs[currentTab.value].key
  });
};

// 更新Tab下划线位置
const updateTabLine = async () => {
  await nextTick();
  const query = uni.createSelectorQuery();
  query.select(`.tab-item:nth-child(${currentTab.value + 1})`).boundingClientRect(data => {
    if (data) {
      tabLineLeft.value = data.left + data.width / 2 - 20; // 20是线的一半宽度
      tabLineWidth.value = 40; // 线的宽度
    }
  }).exec();
};

// 监听props变化
watch(() => props.initialTab, (newVal) => {
  currentTab.value = newVal;
  updateTabLine();
});

// 生命周期钩子
onMounted(() => {
  // 初始化Tab下划线位置
  setTimeout(() => {
    updateTabLine();
  }, 100);
});
</script>

<style lang="scss" scoped>
.task-list-container {
  background-color: #f8f8f8;
  min-height: 100%;
  padding-bottom: 30rpx;
}

/* Tab样式 */
.task-tabs {
  display: flex;
  background-color: #fff;
  position: relative;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 30rpx;
}

.tab-item {
  flex: 1;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  text {
    font-size: 28rpx;
    color: #666;
    transition: color 0.3s;
  }
  
  &.active {
    text {
      color: #0071ff;
      font-weight: 500;
    }
  }
}

.tab-line {
  position: absolute;
  height: 6rpx;
  background-color: #0071ff;
  bottom: 0;
  border-radius: 3rpx;
  transition: all 0.3s;
}

/* 任务列表样式 */
.task-list {
  padding: 20rpx 30rpx;
}

.task-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

/* 任务标题 */
.task-title {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.title-icon {
  margin-right: 16rpx;
  font-size: 32rpx;
  color: #0071ff;
}

.title-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

/* 任务标签 */
.task-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: a20rpx;
}

.task-tag {
  font-size: 24rpx;
  color: #666;
  background-color: #f1f1f1;
  padding: 6rpx 20rpx;
  border-radius: a24rpx;
  margin-right: 16rpx;
  margin-bottom: 12rpx;
  
  &.tag-selected {
    color: #0071ff;
    background-color: #e6f1ff;
    position: relative;
    
    &::before {
      content: '';
      display: inline-block;
      width: 12rpx;
      height: 12rpx;
      background-color: #0071ff;
      border-radius: 50%;
      margin-right: 6rpx;
      position: relative;
      top: -2rpx;
    }
  }
}

/* 任务信息 */
.task-info {
  margin-top: 20rpx;
}

.info-item {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
  line-height: 1.5;
}

.info-label {
  color: #333;
}

/* 任务底部 */
.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
  border-top: 1px solid #f0f0f0;
  padding-top: 20rpx;
}

.task-status {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  margin-right: 8rpx;
  
  &.status-not-started {
    background-color: #909399;
  }
  
  &.status-in-progress {
    background-color: #e6a23c;
  }
  
  &.status-completed {
    background-color: #67c23a;
  }
}

.status-text {
  font-size: 24rpx;
  color: #666;
}

.action-button {
  font-size: 26rpx;
  color: #0071ff;
  background-color: #f2f8ff;
  padding: 6rpx 20rpx;
  border-radius: 6rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>