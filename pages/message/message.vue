<template>
  <view class="message-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="title">消息</text>
      <view class="right-buttons">
        <view class="clear-btn" @click="showClearDialog">
          <uni-icons type="trash" size="18" color="#666"></uni-icons>
          <text class="clear-text">清除未读</text>
        </view>
  
      </view>
    </view>

    <!-- 消息类型标签区域 -->
    <view class="message-types">
      <view class="type-item" 
        v-for="(item, index) in messageTypes" 
        :key="index"
        :class="{ active: activeType === index }"
        @click="switchMessageType(index)">
        <view class="type-icon" :style="{ backgroundColor: item.color }">
          <image v-if="item.image" :src="item.image" mode="aspectFit" class="type-image"></image>
          <uni-icons v-else :type="item.icon" size="24" color="#fff"></uni-icons>
        </view>
        <text class="type-name">{{ item.name }}</text>
        <view class="badge" v-if="item.count > 0">{{ item.count }}</view>
      </view>
    </view>

    <!-- 消息列表区域 -->
    <scroll-view 
      class="message-list" 
      scroll-y 
      @scrolltolower="loadMoreMessages"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh">
      <view v-if="loading" class="loading-box">
        <uni-load-more status="loading" :contentText="loadingText"></uni-load-more>
      </view>

      <view v-else-if="currentMessages.length === 0" class="empty-box">
        <image src="/static/empty-message.png" mode="aspectFit" class="empty-image"></image>
        <text class="empty-text">暂无消息数据</text>
        <button class="refresh-btn" @click="refreshMessages">刷新</button>
      </view>

      <view v-else class="message-items">
        <!-- 日期分组 -->
        <block v-for="(group, groupIndex) in groupedMessages" :key="groupIndex">
          <view class="date-divider" v-if="group.date">
            <text class="date-text">{{ group.date }}</text>
          </view>
          
          <view 
            class="message-item" 
            v-for="(msg, idx) in group.messages" 
            :key="idx"
            :class="{ unread: !msg.read }"
            @click="viewMessageDetail(msg)">
            <view class="message-avatar">
              <image :src="msg.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
              <view class="unread-dot" v-if="!msg.read"></view>
            </view>
            <view class="message-content">
              <view class="message-header">
                <text class="message-title">{{ msg.title }}</text>
                <text class="message-time">{{ formatTime(msg.time, 'time') }}</text>
              </view>
              <text class="message-desc">{{ msg.content }}</text>
              <!-- 添加消息摘要标签 -->
              <view class="message-tags" v-if="msg.tags && msg.tags.length">
                <text 
                  v-for="(tag, tagIdx) in msg.tags" 
                  :key="tagIdx" 
                  class="message-tag" 
                  :style="{ backgroundColor: getTagColor(msg.type, tagIdx) }">
                  {{ tag }}
                </text>
              </view>
            </view>
            <view class="message-indicator">
              <uni-icons type="right" size="16" color="#ccc"></uni-icons>
            </view>
          </view>
        </block>

        <view class="load-more-area">
          <uni-load-more :status="loadMoreStatus" :contentText="loadMoreText"></uni-load-more>
        </view>
      </view>
    </scroll-view>

    <!-- 清除对话框 -->
    <uni-popup ref="clearPopup" type="dialog">
      <uni-popup-dialog 
        title="清除未读" 
        content="确定要清除所有未读消息吗？" 
        :confirmText="'确认'" 
        :cancelText="'取消'"
        @confirm="clearUnreadMessages"
        @close="closeDialog">
      </uni-popup-dialog>
    </uni-popup>

	<!-- 底部导航栏 - 根据不同模块显示不同导航栏 -->
  <tab-bar :module-id="moduleStore.currentModuleId" active-tab="工作台" @tab-change="handleTabChange"></tab-bar>

  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useModuleStore } from '@/stores/moduleStore';
import TabBar from '@/components/NavTab/NavTab.vue';
// 获取 Pinia store
const moduleStore = useModuleStore();
// 消息类型
const messageTypes = ref([
  { 
    name: '审批消息', 
    icon: 'checkbox', 
    color: '#FF9066', 
    count: 5,
    image: '/static/icons/approve.png'
  },
  { 
    name: '@我消息', 
    icon: 'at', 
    color: '#40A9FF', 
    count: 2,
    image: '/static/icons/at-me.png'
  },
  { 
    name: '系统通知', 
    icon: 'notification', 
    color: '#4D7CFE', 
    count: 0,
    image: '/static/icons/system.png'
  }
]);

// 当前激活的消息类型索引
const activeType = ref(0);

// 加载状态
const loading = ref(true);
const isRefreshing = ref(false);
const loadMoreStatus = ref('more'); // 'more', 'loading', 'noMore'

// 加载文本
const loadingText = {
  contentdown: '上拉加载更多',
  contentrefresh: '加载中...',
  contentnomore: '没有更多数据了'
};

const loadMoreText = {
  contentdown: '上拉加载更多',
  contentrefresh: '加载中...',
  contentnomore: '没有更多数据了'
};

// 模拟消息数据
const allMessages = ref({
  0: [], // 审批消息
  1: [], // @我消息
  2: []  // 系统通知
});

// 当前显示的消息
const currentMessages = computed(() => {
  return allMessages.value[activeType.value] || [];
});

// 按日期分组的消息
const groupedMessages = computed(() => {
  if (!currentMessages.value.length) return [];
  
  const groups = [];
  let currentDate = '';
  let currentGroup = { date: '', messages: [] };
  
  currentMessages.value.forEach(msg => {
    const msgDate = formatTime(msg.time, 'date');
    
    if (msgDate !== currentDate) {
      if (currentGroup.messages.length > 0) {
        groups.push({ ...currentGroup });
      }
      currentDate = msgDate;
      currentGroup = { date: msgDate, messages: [msg] };
    } else {
      currentGroup.messages.push(msg);
    }
  });
  
  if (currentGroup.messages.length > 0) {
    groups.push(currentGroup);
  }
  
  return groups;
});

// 获取标签颜色
const getTagColor = (type, index) => {
  const colors = [
    ['#ff9500', '#2979ff', '#4cd964'], // 审批消息
    ['#1890ff', '#52c41a', '#722ed1'], // @我消息
    ['#13c2c2', '#fa8c16', '#eb2f96']  // 系统通知
  ];
  
  const typeIndex = type || activeType.value;
  const colorIndex = index % 3;
  
  return colors[typeIndex][colorIndex] + '20'; // 添加20%透明度
};

// 切换消息类型
const switchMessageType = (index) => {
  if (activeType.value === index) return;
  activeType.value = index;
  loading.value = true;
  
  // 切换类型后重新加载数据
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

// 格式化时间
const formatTime = (timestamp, type = 'full') => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  // 时间部分格式化
  const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
  // 如果只需要时间部分
  if (type === 'time') {
    return timeStr;
  }
  
  // 日期部分格式化
  if (date >= today) {
    return type === 'date' ? '今天' : `今天 ${timeStr}`;
  } else if (date >= yesterday) {
    return type === 'date' ? '昨天' : `昨天 ${timeStr}`;
  } else {
    // 本周内
    const dayDiff = Math.floor((today - date) / (24 * 60 * 60 * 1000));
    if (dayDiff < 7) {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return type === 'date' 
        ? weekdays[date.getDay()]
        : `${weekdays[date.getDay()]} ${timeStr}`;
    } else {
      // 更早日期
      return type === 'date'
        ? `${date.getMonth() + 1}月${date.getDate()}日`
        : `${date.getMonth() + 1}月${date.getDate()}日 ${timeStr}`;
    }
  }
};

// 查看消息详情
const viewMessageDetail = (message) => {
  // 标记为已读
  message.read = true;
  
  // 减少未读数量
  if (messageTypes.value[activeType.value].count > 0) {
    messageTypes.value[activeType.value].count--;
  }
  
  // 震动反馈
  uni.vibrateShort({
    success: function() {
      console.log('震动成功');
    }
  });
  
  // 跳转到详情页面
  uni.navigateTo({
    url: `/pages/message/messageDetail?id=${message.id}&type=${activeType.value}`
  });
};

// 加载更多消息
const loadMoreMessages = () => {
  if (loadMoreStatus.value === 'noMore') return;
  
  loadMoreStatus.value = 'loading';
  
  // 模拟加载更多
  setTimeout(() => {
    // 如果当前消息列表长度大于30，则没有更多数据
    if (currentMessages.value.length > 30) {
      loadMoreStatus.value = 'noMore';
      return;
    }
    
    // 添加更多消息
    const moreMessages = generateMockMessages(5, activeType.value);
    allMessages.value[activeType.value] = [...allMessages.value[activeType.value], ...moreMessages];
    
    loadMoreStatus.value = 'more';
  }, 1000);
};

// 下拉刷新
const onRefresh = () => {
  isRefreshing.value = true;
  
  // 模拟刷新数据
  setTimeout(() => {
    // 生成新的消息并添加到列表开头
    const newMessages = generateMockMessages(3, activeType.value, true);
    allMessages.value[activeType.value] = [...newMessages, ...allMessages.value[activeType.value]];
    
    isRefreshing.value = false;
    
    // 提示用户
    uni.showToast({
      title: '已刷新',
      icon: 'success'
    });
  }, 1000);
};

// 刷新消息
const refreshMessages = () => {
  loading.value = true;
  
  // 模拟加载数据
  setTimeout(() => {
    // 生成模拟数据
    allMessages.value[activeType.value] = generateMockMessages(10, activeType.value);
    
    loading.value = false;
  }, 1000);
};

// 显示清除对话框
const clearPopup = ref(null);
const showClearDialog = () => {
  clearPopup.value.open();
};

// 关闭对话框
const closeDialog = () => {
  clearPopup.value.close();
};

// 清除未读消息
const clearUnreadMessages = () => {
  // 将所有消息标记为已读
  for (const type in allMessages.value) {
    allMessages.value[type].forEach(msg => {
      msg.read = true;
    });
  }
  
  // 重置未读计数
  messageTypes.value.forEach(type => {
    type.count = 0;
  });
  
  // 关闭对话框
  clearPopup.value.close();
  
  // 显示清除成功提示
  uni.showToast({
    title: '已清除所有未读消息',
    icon: 'success'
  });
};

// 生成模拟消息数据
const generateMockMessages = (count, typeIndex, isNew = false) => {
  const messages = [];
  const now = Date.now();
  
  // 审批消息
  const approvalTitles = ['加班申请', '报销申请', '请假审批', '采购审批', '出差申请'];
  const approvalContents = [
    '张三提交的加班申请需要您审批',
    '李四提交的报销申请（¥1,280.50）需要您审批',
    '王五提交了3天年假申请，请您审批',
    '采购部提交了办公用品采购申请',
    '市场部王经理提交了出差申请，请您审批'
  ];
  const approvalTags = [
    ['待审批', '加班'],
    ['待审批', '报销'],
    ['待审批', '请假'],
    ['待审批', '采购'],
    ['待审批', '出差']
  ];
  
  // @我消息
  const atMeTitles = ['项目讨论', '文档评审', '会议通知', '任务分配', '进度反馈'];
  const atMeContents = [
    '@您 请查看项目最新进展并提供反馈',
    '@您 产品需求文档已更新，请您审阅',
    '@您 请参加明天10:00的项目周会',
    '@您 已为您分配新任务：客户需求调研',
    '@您 请提交本周工作进度报告'
  ];
  const atMeTags = [
    ['项目', '讨论'],
    ['文档', '评审'],
    ['会议', '通知'],
    ['任务', '分配'],
    ['反馈', '进度']
  ];
  
  // 系统通知
  const systemTitles = ['系统升级通知', '账号安全提醒', '新功能上线', '操作提醒', '权限变更'];
  const systemContents = [
    '系统将于今晚22:00-23:00进行升级维护，请提前保存工作内容',
    '您的账号于昨日18:30在非常用设备上登录，请确认是否为本人操作',
    '新版本已发布！多项功能优化和体验提升等您体验',
    '您有3个任务即将逾期，请及时处理',
    '您的系统权限已更新，现在可以访问更多功能'
  ];
  const systemTags = [
    ['系统', '维护'],
    ['安全', '提醒'],
    ['新功能', '升级'],
    ['任务', '提醒'],
    ['权限', '更新']
  ];
  
  const titles = [approvalTitles, atMeTitles, systemTitles];
  const contents = [approvalContents, atMeContents, systemContents];
  const tags = [approvalTags, atMeTags, systemTags];
  
  const avatars = [
    '/static/icons/approve-avatar.png',
    '/static/icons/at-avatar.png',
    '/static/icons/system-avatar.png'
  ];
  
  for (let i = 0; i < count; i++) {
    const titleIndex = Math.floor(Math.random() * titles[typeIndex].length);
    const contentIndex = Math.floor(Math.random() * contents[typeIndex].length);
    const isUnread = isNew ? true : Math.random() > 0.7; // 新消息未读，其他30%概率未读
    
    // 创建消息基本信息
    const message = {
      id: `msg_${Date.now()}_${i}`,
      title: titles[typeIndex][titleIndex],
      content: contents[typeIndex][contentIndex],
      time: now - (isNew ? 0 : Math.floor(Math.random() * 86400000 * 14)), // 随机时间，最多两周前
      avatar: avatars[typeIndex],
      read: !isUnread,
      type: typeIndex,
      tags: tags[typeIndex][titleIndex]
    };
    
    messages.push(message);
  }
  
  // 按时间排序，新消息在前
  return messages.sort((a, b) => b.time - a.time);
};

// 监听激活类型变化，更新未读数量
watch(activeType, (newVal) => {
  // 计算当前类型的未读消息数量
  const unreadCount = allMessages.value[newVal]?.filter(msg => !msg.read).length || 0;
  messageTypes.value[newVal].count = unreadCount;
});

// 组件挂载时
onMounted(() => {
  // 模拟加载消息数据
  setTimeout(() => {
    // 生成模拟数据
    allMessages.value = {
      0: generateMockMessages(12, 0),
      1: generateMockMessages(8, 1),
      2: generateMockMessages(6, 2)
    };
    
    // 计算各类型未读消息数量
    messageTypes.value.forEach((type, index) => {
      const unreadCount = allMessages.value[index]?.filter(msg => !msg.read).length || 0;
      type.count = unreadCount;
    });
    
    loading.value = false;
  }, 1000);
});

// 处理标签切换
const handleTabChange = (tabInfo) => {
	console.log('标签切换:', tabInfo);
};
</script>

<style lang="scss" scoped>
.message-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f8fa;
}

/* 顶部导航栏 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  padding: 0 30rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #eaeaea;
  position: relative;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1rpx;
    background-color: rgba(0, 0, 0, 0.05);
    transform: scaleY(0.5);
  }
  
  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }
  
  .right-buttons {
    display: flex;
    align-items: center;
    
    .clear-btn {
      display: flex;
      align-items: center;
      padding: 12rpx 20rpx;
      border-radius: 30rpx;
      background-color: #f5f6f8;
      margin-right: 20rpx;
      
      .clear-text {
        font-size: 26rpx;
        color: #666;
        margin-left: 8rpx;
      }
      
      &:active {
        opacity: 0.8;
      }
    }
    
 
  }
}

/* 消息类型区域 */
.message-types {
  display: flex;
  padding: 30rpx 40rpx 40rpx;
  background-color: #ffffff;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
  
  .type-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    transition: transform 0.2s;
    
    &:active {
      transform: scale(0.95);
    }
    
    .type-icon {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 16rpx;
      box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.08);
      transition: all 0.3s;
      
      .type-image {
        width: 60rpx;
        height: 60rpx;
      }
    }
    
    .type-name {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      transition: color 0.3s;
    }
    
    .badge {
      position: absolute;
      top: 0;
      right: 50%;
      margin-right: -70rpx;
      min-width: 32rpx;
      height: 32rpx;
      padding: 0 8rpx;
      background-color: #ff4d4f;
      border-radius: 16rpx;
      font-size: 22rpx;
      color: #fff;
      text-align: center;
      line-height: 32rpx;
      box-shadow: 0 2rpx 8rpx rgba(255, 77, 79, 0.3);
      transform: scale(1);
      animation: pulse 2s infinite;
    }
    
    &.active {
      .type-icon {
        transform: translateY(-6rpx);
      }
      
      .type-name {
        color: #2979ff;
        font-weight: 600;
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 消息列表区域 */
.message-list {
  flex: 1;
  background-color: #ffffff;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
  position: relative;
  
  .loading-box, .empty-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 120rpx 0;
  }
  
  .empty-image {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 20rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 30rpx;
  }
  
  .refresh-btn {
    width: 200rpx;
    height: 70rpx;
    line-height: 70rpx;
    font-size: 28rpx;
    color: #2979ff;
    background-color: rgba(41, 121, 255, 0.1);
    border: none;
    border-radius: 35rpx;
  }
  
  .message-items {
    padding: 0 20rpx;
  }
  
  .date-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20rpx 0;
    
    .date-text {
      padding: 6rpx 20rpx;
      font-size: 24rpx;
      color: #999;
      background-color: #f5f7fa;
      border-radius: 20rpx;
    }
  }
  
  .message-item {
    display: flex;
    padding: 30rpx 20rpx;
    border-radius: 16rpx;
    margin-bottom: 16rpx;
    background-color: #ffffff;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
    transition: all 0.2s;
    
    &:last-child {
      margin-bottom: 40rpx;
    }
    
    &:active {
      background-color: #f9f9f9;
      transform: scale(0.98);
    }
    
    &.unread {
      background-color: #f0f7ff;
      border-left: 6rpx solid #2979ff;
    }
    
    .message-avatar {
      position: relative;
      width: 80rpx;
      height: 80rpx;
      margin-right: 24rpx;
      flex-shrink: 0;
      
      image {
        width: 100%;
        height: 100%;
        border-radius: 40rpx;
        border: 1rpx solid #eaeaea;
      }
      
      .unread-dot {
        position: absolute;
        top: 0;
        right: -6rpx;
        width: 20rpx;
        height: 20rpx;
        background-color: #ff4d4f;
        border-radius: 10rpx;
        border: 2rpx solid #fff;
      }
    }
    
    .message-content {
      flex: 1;
      overflow: hidden;
      
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12rpx;
        
        .message-title {
          font-size: 32rpx;
          font-weight: 500;
          color: #333;
          line-height: 1.3;
        }
        
        .message-time {
          font-size: 24rpx;
          color: #999;
          flex-shrink: 0;
          margin-left: 16rpx;
        }
      }
      
      .message-desc {
        font-size: 28rpx;
        color: #666;
        line-height: 1.5;
        // 超出两行显示省略号
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      
      .message-tags {
        display: flex;
        flex-wrap: wrap;
        margin-top: 16rpx;
        
        .message-tag {
          display: inline-block;
          padding: 4rpx 16rpx;
          font-size: 22rpx;
          border-radius: 6rpx;
          margin-right: 12rpx;
          margin-bottom: 6rpx;
        }
      }
    }
    
    .message-indicator {
      display: flex;
      align-items: center;
      margin-left: 16rpx;
      flex-shrink: 0;
    }
  }
  
  .load-more-area {
    padding: 20rpx 0 40rpx;
    background-color: #fff;
  }
}
</style>