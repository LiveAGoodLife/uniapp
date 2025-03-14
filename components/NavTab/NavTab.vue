<!-- components/NavTab/NavTab.vue -->
<template>
  <view class="tab-bar" :style="{ height: `${height}rpx` }">
    <view 
      v-for="tab in currentTabs" 
      :key="tab.id" 
      class="tab-item" 
      :class="{ active: activeTabName === tab.name }"
      @click="handleTabClick(tab)"
    >
      <image 
        :src="activeTabName === tab.name ? tab.activeIcon : tab.icon" 
        mode="aspectFit" 
        class="tab-icon"
      ></image>
      <text :class="{ 'active-text': activeTabName === tab.name }">{{ tab.name }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useModuleStore } from '@/stores/moduleStore';

// Props 定义
const props = defineProps({
  // 当前活动模块：'device', 'quality', 'warehouse'
  moduleId: {
    type: String,
    default: 'device'
  },
  // 当前活动的标签名称
  activeTab: {
    type: String,
    default: '工作台'
  },
  // 底部导航栏高度
  height: {
    type: Number,
    default: 120
  }
});

// 事件
const emit = defineEmits(['tabChange']);

// 获取 Pinia store
const moduleStore = useModuleStore();

// 当前活动的标签名称
const activeTabName = ref(props.activeTab);

// 监听activeTab属性变化
watch(() => props.activeTab, (newValue) => {
  activeTabName.value = newValue;
});

// 导航锁防止重复导航
const isNavigating = ref(false);

// 当前模块的标签
const currentTabs = computed(() => {
  switch (props.moduleId) {
    case 'device':
      return [
        {
          id: 'device_home',
          name: '工作台',
          icon: '/static/icons/workspace.png',
          activeIcon: '/static/icons/workspace-active.png',
          url: '/pages/index/index'
        },
        {
          id: 'device_message',
          name: '消息',
          icon: '/static/icons/message.png',
          activeIcon: '/static/icons/message-active.png',
          url: '/pages/message/message'
        },
        {
          id: 'device_report',
          name: '报表',
          icon: '/static/icons/report.png',
          activeIcon: '/static/icons/report-active.png',
          url: '/pages/report/report'
        },
        {
          id: 'device_profile',
          name: '我的',
          icon: '/static/icons/profile.png',
          activeIcon: '/static/icons/profile-active.png',
          url: '/pages/profile/profile'
        }
      ];
    case 'quality':
      return [
        {
          id: 'quality_home',
          name: '工作台',
          icon: '/static/icons/workspace.png',
          activeIcon: '/static/icons/workspace-active.png',
          url: '/pages/index/index'
        },
        {
          id: 'quality_tasks',
          name: '任务',
          icon: '/static/icons/task.png',
          activeIcon: '/static/icons/task-active.png',
          url: '/pages/quality/tasks'
        },
        {
          id: 'quality_report',
          name: '报表',
          icon: '/static/icons/report.png',
          activeIcon: '/static/icons/report-active.png',
          url: '/pages/report/index'
        },
        {
          id: 'quality_profile',
          name: '我的',
          icon: '/static/icons/profile.png',
          activeIcon: '/static/icons/profile-active.png',
          url: '/pages/profile/index'
        }
      ];
    case 'warehouse':
      return [
        {
          id: 'warehouse_home',
          name: '工作台',
          icon: '/static/icons/workspace.png',
          activeIcon: '/static/icons/workspace-active.png',
          url: '/pages/index/index'
        },
        {
          id: 'warehouse_inbound',
          name: '入库',
          icon: '/static/icons/inbound.png',
          activeIcon: '/static/icons/inbound-active.png',
          url: '/pages/warehouse/inbound'
        },
        {
          id: 'warehouse_outbound',
          name: '出库',
          icon: '/static/icons/outbound.png',
          activeIcon: '/static/icons/outbound-active.png',
          url: '/pages/warehouse/outbound'
        },
        {
          id: 'warehouse_inventory',
          name: '库存',
          icon: '/static/icons/inventory.png',
          activeIcon: '/static/icons/inventory-active.png',
          url: '/pages/warehouse/inventory'
        },
        {
          id: 'warehouse_profile',
          name: '我的',
          icon: '/static/icons/profile.png',
          activeIcon: '/static/icons/profile-active.png',
          url: '/pages/profile/index'
        }
      ];
    default:
      return [];
  }
});

// 点击标签处理
const handleTabClick = (tab) => {
  console.log('点击标签:', tab.name, '当前标签:', activeTabName.value);
  
  // 如果点击的就是当前标签，返回首页/刷新页面
  if (activeTabName.value === tab.name) {
    if (tab.name === '工作台') {
      // 强制返回首页
      navigateToTab(tab, true);
    }
    return;
  }
  
  // 如果正在导航中，忽略此次点击
  if (isNavigating.value) {
    console.log('正在导航中，忽略点击');
    return;
  }
  
  // 记录新的活动标签
  activeTabName.value = tab.name;
  
  // 更新 Pinia store 中的标签状态
  moduleStore.updateTabState(props.moduleId, tab.name);
  
  // 触发标签切换事件
  emit('tabChange', { 
    moduleId: props.moduleId, 
    tabName: tab.name, 
    tabId: tab.id,
    tab
  });
  
  // 导航到对应页面
  navigateToTab(tab);
};

// 导航到标签页面
const navigateToTab = (tab, forceRefresh = false) => {
  // 设置导航锁
  isNavigating.value = true;
  
  // 获取当前页面路径
  const pages = getCurrentPages();
  const currentPage = pages.length > 0 ? pages[pages.length - 1] : null;
  const currentRoute = currentPage ? `/${currentPage.route}` : '';
  
  console.log('当前路径:', currentRoute, '目标路径:', tab.url);
  
  // 如果是首页且强制刷新
  if (tab.name === '工作台' && forceRefresh) {
    console.log('强制刷新首页');
    uni.reLaunch({
      url: tab.url,
      success: () => console.log('返回首页成功'),
      fail: (err) => console.error('返回首页失败:', err),
      complete: () => {
        setTimeout(() => {
          isNavigating.value = false;
        }, 500);
      }
    });
    return;
  }
  
  // 如果当前已经在目标页面，不进行导航
  if (currentRoute === tab.url && !forceRefresh) {
    console.log('已在目标页面，不导航');
    isNavigating.value = false;
    return;
  }
  
  // 根据标签类型选择导航方法
  if (tab.name === '工作台') {
    // 首页使用reLaunch
    uni.reLaunch({
      url: tab.url,
      success: () => console.log('导航到首页成功'),
      fail: (err) => console.error('导航到首页失败:', err),
      complete: () => {
        setTimeout(() => {
          isNavigating.value = false;
        }, 500);
      }
    });
  } else {
    // 其他页面使用redirectTo
    uni.redirectTo({
      url: tab.url,
      success: () => console.log(`导航到${tab.name}页面成功`),
      fail: (err) => {
        console.error(`导航到${tab.name}页面失败:`, err);
        // 导航失败尝试使用navigateTo
        uni.navigateTo({
          url: tab.url,
          fail: (err2) => console.error(`使用navigateTo也失败:`, err2)
        });
      },
      complete: () => {
        setTimeout(() => {
          isNavigating.value = false;
        }, 500);
      }
    });
  }
};

// 初始化：在组件挂载时先确保store初始化，再从store获取标签状态
onMounted(async () => {
  // 确保 store 已初始化
  if (!moduleStore.initialized) {
    await moduleStore.initialize();
  }
  
  // 从 store 获取此模块的激活标签
  const storeTabState = moduleStore.tabStates[props.moduleId];
  if (storeTabState && storeTabState !== activeTabName.value) {
    console.log('从 store 恢复标签状态:', storeTabState);
    activeTabName.value = storeTabState;
  }
});
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  display: flex;
  border-top: 1rpx solid #f0f0f0;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 999;
  /* 适配底部安全区域 */
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10rpx 0;
  
  &:active {
    background-color: #f9f9f9;
  }

  .tab-icon {
    width: 44rpx;
    height: 44rpx;
    margin-bottom: 6rpx;
  }

  text {
    font-size: 24rpx;
    color: #999;
    line-height: 1.2;
  }

  .active-text {
    color: #2979ff;
  }
  
  &.active {
    /* 活动状态样式 */
  }
}

/* 不同模块的主题色 */
:host(.device-theme) .active-text {
  color: #2979ff;
}

:host(.quality-theme) .active-text {
  color: #ff9500;
}

:host(.warehouse-theme) .active-text {
  color: #4cd964;
}
</style>