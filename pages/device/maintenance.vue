<template>
  <view class="page-container">
    <!-- 顶部导航栏 -->
    <nav-bar 
      title="运维管理" 
      :showScanButton="true"
      @back="goBack"
      @scan-success="handleScanResult"
    ></nav-bar>
    
    <!-- 标签页导航 -->
    <view class="tabs-header">
      <view 
        class="tab-item" 
        v-for="(tab, index) in tabs" 
        :key="index"
        :class="{'active': activeTabIndex === index}"
        @click="switchTab(index)">
        {{ tab.name }}
        <view class="tab-indicator" v-if="activeTabIndex === index"></view>
      </view>
    </view>
    
    <!-- 搜索框 -->
    <search-box 
      placeholder="搜索工单号、设备编号或名称" 
      @search="searchWorkOrders"
      @clear="clearSearch"
    ></search-box>
    
    <!-- 工单列表区域 -->
    <scroll-view 
      class="list-container"
      scroll-y 
      @scrolltolower="loadMoreWorkOrders"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh">
      
      <!-- 空状态 -->
      <empty-state 
        v-if="currentTabWorkOrders.length === 0 && !loading"
        imageSrc="/static/empty-workorder.png"
        :text="`暂无${tabs[activeTabIndex].name}工单`"
        @refresh="refreshWorkOrders"
      ></empty-state>
      
      <!-- 加载中状态 -->
      <view class="loading-state" v-if="loading">
        <uni-load-more status="loading" :contentText="loadingText"></uni-load-more>
      </view>
      
      <!-- 工单卡片列表 -->
      <view class="workorder-cards" v-else>
        <view 
          class="workorder-card card" 
          v-for="(order, index) in currentTabWorkOrders" 
          :key="index"
          @click="viewWorkOrderDetail(order)">
          <!-- 工单头部 -->
          <view class="card-header">
            <view class="left-area">
              <uni-icons type="calendar" size="20" color="#2979ff"></uni-icons>
              <text class="workorder-id">{{ order.id }}</text>
            </view>
            <view class="right-area">
              <status-tag :status="order.status" :text="order.statusText"></status-tag>
            </view>
          </view>
          
          <!-- 工单类型标签 -->
          <view class="workorder-type">
            <view class="type-tag" :class="getTypeClass(order.type)">{{ order.type }}</view>
          </view>
          
          <!-- 工单内容 -->
          <view class="card-content">
            <view class="info-item">
              <text class="info-label">设备编号:</text>
              <text class="info-value">{{ order.deviceId }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">设备名称:</text>
              <text class="info-value">{{ order.deviceName }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">成本中心:</text>
              <text class="info-value">{{ order.costCenter }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">检维单位:</text>
              <text class="info-value">{{ order.maintenanceUnit }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">计划时间:</text>
              <text class="info-value">{{ order.plannedTime }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">区域点检:</text>
              <text class="info-value">{{ order.areaInspection }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">执行人:</text>
              <text class="info-value">{{ order.executor }}</text>
            </view>
            <view class="info-item" v-if="order.abnormalNotes">
              <text class="info-label">异常备注:</text>
              <text class="info-value abnormal">{{ order.abnormalNotes }}</text>
            </view>
          </view>
        </view>
        
        <!-- 加载更多区域 -->
        <view class="load-more-area" v-if="currentTabWorkOrders.length > 0">
          <uni-load-more :status="loadMoreStatus" :contentText="loadMoreText"></uni-load-more>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import SearchBox from '@/components/SearchBox.vue';
import EmptyState from '@/components/EmptyState.vue';
import StatusTag from '@/components/StatusTag.vue';

// 当前激活的标签页索引
const activeTabIndex = ref(0);

// 标签页定义
const tabs = [
  { name: '日常点检', key: 'daily' },
  { name: '专业点检', key: 'professional' },
  { name: '日修一', key: 'repair1' },
  { name: '日修二', key: 'repair2' }
];

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
  contentnomore: '没有更多工单'
};

// 工单数据
const workOrders = ref({
  daily: [
    {
      id: 'DJGD20250102342522',
      type: '日常点检',
      deviceId: 'BSKJF5479-1',
      deviceName: '钢材预处理竖装式滤筒除尘器',
      costCenter: '机械制造-复合板及深加工中心',
      maintenanceUnit: '维保二组',
      plannedTime: '2025-03-13',
      areaInspection: '胡伟, 黄晓黎',
      executor: '王伟杰(2483),储著华',
      abnormalNotes: '维保二组',
      status: 'pending',
      statusText: '待执行'
    },
    {
      id: 'DJGD20250102058602',
      type: '日常点检',
      deviceId: 'BSKJF5692',
      deviceName: '钢板预处理线辊道输送机',
      costCenter: '机械制造-复合板及深加工中心',
      maintenanceUnit: '维保二组',
      plannedTime: '2025-03-14',
      areaInspection: '胡伟, 李明',
      executor: '赵敏(2481),黄志强',
      status: 'pending',
      statusText: '待执行'
    },
    {
      id: 'DJGD20250102058603',
      type: '日常点检',
      deviceId: 'BSKJF5693',
      deviceName: '立式加工中心',
      costCenter: '机械制造-零件加工中心',
      maintenanceUnit: '维保一组',
      plannedTime: '2025-03-14',
      areaInspection: '张强, 刘勇',
      executor: '王明(2485),张建国',
      status: 'inprogress',
      statusText: '执行中'
    }
  ],
  professional: [
    {
      id: 'ZJGD20250102353601',
      type: '专业点检',
      deviceId: 'BSKJF6023',
      deviceName: '全自动数控车床',
      costCenter: '机械制造-零件加工中心',
      maintenanceUnit: '维保一组',
      plannedTime: '2025-03-15',
      areaInspection: '张强, 王伟',
      executor: '李刚(2490),周小明',
      status: 'pending',
      statusText: '待执行'
    },
    {
      id: 'ZJGD20250102353602',
      type: '专业点检',
      deviceId: 'BSKJF6024',
      deviceName: '钢板表面处理设备',
      costCenter: '表面处理中心',
      maintenanceUnit: '维保三组',
      plannedTime: '2025-03-16',
      areaInspection: '陈明, 王亮',
      executor: '黄磊(2492),赵建军',
      status: 'completed',
      statusText: '已完成'
    }
  ],
  repair1: [
    {
      id: 'RXGD20250103257801',
      type: '日修一',
      deviceId: 'BSKJF5823',
      deviceName: '焊接机器人',
      costCenter: '焊接中心',
      maintenanceUnit: '维保二组',
      plannedTime: '2025-03-12',
      areaInspection: '李建, 赵强',
      executor: '王勇(2486),陈明达',
      status: 'completed',
      statusText: '已完成'
    }
  ],
  repair2: [
    {
      id: 'RXGD20250103388901',
      type: '日修二',
      deviceId: 'BSKJF5921',
      deviceName: '激光切割机',
      costCenter: '切割中心',
      maintenanceUnit: '维保一组',
      plannedTime: '2025-03-12',
      areaInspection: '张明, 王亮',
      executor: '李强(2487),周明亮',
      abnormalNotes: '激光器功率不稳定',
      status: 'inprogress',
      statusText: '执行中'
    },
    {
      id: 'RXGD20250103388902',
      type: '日修二',
      deviceId: 'BSKJF5922',
      deviceName: '数控冲床',
      costCenter: '冲压中心',
      maintenanceUnit: '维保三组',
      plannedTime: '2025-03-13',
      areaInspection: '陈刚, 李亮',
      executor: '王明(2488),张建国',
      status: 'pending',
      statusText: '待执行'
    }
  ]
});

// 处理扫码结果
const handleScanResult = (result) => {
  searchWorkOrders(result.result);
};

// 根据当前选择的标签获取工单
const currentTabWorkOrders = computed(() => {
  const currentKey = tabs[activeTabIndex.value].key;
  return workOrders.value[currentKey] || [];
});

// 切换标签页
const switchTab = (index) => {
  activeTabIndex.value = index;
  refreshWorkOrders();
};

// 搜索工单
const searchWorkOrders = (keyword) => {
  if (!keyword.trim()) {
    refreshWorkOrders();
    return;
  }
  
  loading.value = true;
  
  // 模拟搜索请求
  setTimeout(() => {
    const search = keyword.toLowerCase();
    const currentKey = tabs[activeTabIndex.value].key;
    
    // 在当前标签页的数据中搜索
    const originalData = [...workOrders.value[currentKey]];
    
    // 过滤符合条件的工单
    workOrders.value[currentKey] = originalData.filter(order => 
      order.id.toLowerCase().includes(search) ||
      order.deviceId.toLowerCase().includes(search) ||
      order.deviceName.toLowerCase().includes(search)
    );
    
    loading.value = false;
  }, 500);
};

// 清除搜索
const clearSearch = () => {
  refreshWorkOrders();
};

// 刷新工单列表
const refreshWorkOrders = () => {
  loading.value = true;
  
  // 模拟加载数据
  setTimeout(() => {
    // 实际应用中，这里应该从API获取数据
    // 本例中仅重置为初始数据
    workOrders.value = {
      daily: [
        {
          id: 'DJGD20250102342522',
          type: '日常点检',
          deviceId: 'BSKJF5479-1',
          deviceName: '钢材预处理竖装式滤筒除尘器',
          costCenter: '机械制造-复合板及深加工中心',
          maintenanceUnit: '维保二组',
          plannedTime: '2025-03-13',
          areaInspection: '胡伟, 黄晓黎',
          executor: '王伟杰(2483),储著华',
          abnormalNotes: '维保二组',
          status: 'pending',
          statusText: '待执行'
        },
        {
          id: 'DJGD20250102058602',
          type: '日常点检',
          deviceId: 'BSKJF5692',
          deviceName: '钢板预处理线辊道输送机',
          costCenter: '机械制造-复合板及深加工中心',
          maintenanceUnit: '维保二组',
          plannedTime: '2025-03-14',
          areaInspection: '胡伟, 李明',
          executor: '赵敏(2481),黄志强',
          status: 'pending',
          statusText: '待执行'
        },
        {
          id: 'DJGD20250102058603',
          type: '日常点检',
          deviceId: 'BSKJF5693',
          deviceName: '立式加工中心',
          costCenter: '机械制造-零件加工中心',
          maintenanceUnit: '维保一组',
          plannedTime: '2025-03-14',
          areaInspection: '张强, 刘勇',
          executor: '王明(2485),张建国',
          status: 'inprogress',
          statusText: '执行中'
        }
      ],
      professional: [
        {
          id: 'ZJGD20250102353601',
          type: '专业点检',
          deviceId: 'BSKJF6023',
          deviceName: '全自动数控车床',
          costCenter: '机械制造-零件加工中心',
          maintenanceUnit: '维保一组',
          plannedTime: '2025-03-15',
          areaInspection: '张强, 王伟',
          executor: '李刚(2490),周小明',
          status: 'pending',
          statusText: '待执行'
        },
        {
          id: 'ZJGD20250102353602',
          type: '专业点检',
          deviceId: 'BSKJF6024',
          deviceName: '钢板表面处理设备',
          costCenter: '表面处理中心',
          maintenanceUnit: '维保三组',
          plannedTime: '2025-03-16',
          areaInspection: '陈明, 王亮',
          executor: '黄磊(2492),赵建军',
          status: 'completed',
          statusText: '已完成'
        }
      ],
      repair1: [
        {
          id: 'RXGD20250103257801',
          type: '日修一',
          deviceId: 'BSKJF5823',
          deviceName: '焊接机器人',
          costCenter: '焊接中心',
          maintenanceUnit: '维保二组',
          plannedTime: '2025-03-12',
          areaInspection: '李建, 赵强',
          executor: '王勇(2486),陈明达',
          status: 'completed',
          statusText: '已完成'
        }
      ],
      repair2: [
        {
          id: 'RXGD20250103388901',
          type: '日修二',
          deviceId: 'BSKJF5921',
          deviceName: '激光切割机',
          costCenter: '切割中心',
          maintenanceUnit: '维保一组',
          plannedTime: '2025-03-12',
          areaInspection: '张明, 王亮',
          executor: '李强(2487),周明亮',
          abnormalNotes: '激光器功率不稳定',
          status: 'inprogress',
          statusText: '执行中'
        },
        {
          id: 'RXGD20250103388902',
          type: '日修二',
          deviceId: 'BSKJF5922',
          deviceName: '数控冲床',
          costCenter: '冲压中心',
          maintenanceUnit: '维保三组',
          plannedTime: '2025-03-13',
          areaInspection: '陈刚, 李亮',
          executor: '王明(2488),张建国',
          status: 'pending',
          statusText: '待执行'
        }
      ]
    };
    
    loading.value = false;
    loadMoreStatus.value = 'more';
  }, 800);
};

// 下拉刷新
const onRefresh = () => {
  isRefreshing.value = true;
  
  // 模拟刷新数据
  setTimeout(() => {
    refreshWorkOrders();
    isRefreshing.value = false;
    
    // 提示用户
    uni.showToast({
      title: '已刷新',
      icon: 'success'
    });
  }, 1000);
};

// 加载更多工单
const loadMoreWorkOrders = () => {
  if (loadMoreStatus.value === 'noMore') return;
  
  loadMoreStatus.value = 'loading';
  
  // 模拟加载更多
  setTimeout(() => {
    const currentKey = tabs[activeTabIndex.value].key;
    
    // 如果当前标签页的数据已经超过10条，认为没有更多数据
    if (workOrders.value[currentKey].length >= 10) {
      loadMoreStatus.value = 'noMore';
      return;
    }
    
    // 根据当前标签页添加不同类型的工单
    const newOrder = {
      daily: {
        id: 'DJGD2025010' + Math.floor(Math.random() * 1000000),
        type: '日常点检',
        deviceId: 'BSKJF' + (5000 + Math.floor(Math.random() * 1000)),
        deviceName: '新增日常点检设备',
        costCenter: '机械制造中心',
        maintenanceUnit: '维保二组',
        plannedTime: '2025-03-20',
        areaInspection: '新人员A, 新人员B',
        executor: '新执行人A,新执行人B',
        status: 'pending',
        statusText: '待执行'
      },
      professional: {
        id: 'ZJGD2025010' + Math.floor(Math.random() * 1000000),
        type: '专业点检',
        deviceId: 'BSKJF' + (6000 + Math.floor(Math.random() * 1000)),
        deviceName: '新增专业点检设备',
        costCenter: '设备管理中心',
        maintenanceUnit: '专业点检组',
        plannedTime: '2025-03-21',
        areaInspection: '专业A, 专业B',
        executor: '专业执行人A,专业执行人B',
        status: 'pending',
        statusText: '待执行'
      },
      repair1: {
        id: 'RXGD2025010' + Math.floor(Math.random() * 1000000),
        type: '日修一',
        deviceId: 'BSKJF' + (7000 + Math.floor(Math.random() * 1000)),
        deviceName: '新增日修一设备',
        costCenter: '维修中心',
        maintenanceUnit: '日修一组',
        plannedTime: '2025-03-22',
        areaInspection: '日修A, 日修B',
        executor: '日修执行人A,日修执行人B',
        status: 'pending',
        statusText: '待执行'
      },
      repair2: {
        id: 'RXGD2025010' + Math.floor(Math.random() * 1000000),
        type: '日修二',
        deviceId: 'BSKJF' + (8000 + Math.floor(Math.random() * 1000)),
        deviceName: '新增日修二设备',
        costCenter: '维修中心',
        maintenanceUnit: '日修二组',
        plannedTime: '2025-03-23',
        areaInspection: '日修二A, 日修二B',
        executor: '日修二执行人A,日修二执行人B',
        status: 'pending',
        statusText: '待执行'
      }
    };
    
    // 添加新工单到对应标签页
    workOrders.value[currentKey].push(newOrder[currentKey]);
    
    loadMoreStatus.value = 'more';
  }, 1000);
};

// 获取工单类型样式类
const getTypeClass = (type) => {
  const typeClasses = {
    '日常点检': 'type-daily',
    '专业点检': 'type-professional',
    '日修一': 'type-repair1',
    '日修二': 'type-repair2'
  };
  
  return typeClasses[type] || '';
};

// 查看工单详情
const viewWorkOrderDetail = (order) => {
  console.log('查看工单详情:', order);
  
  // 实际应用中可以跳转到详情页
  uni.navigateTo({
    url: `/pages/workorder/detail?id=${order.id}`
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 监听标签切换
watch(activeTabIndex, (newVal) => {
  // 切换标签时重置搜索内容
  clearSearch();
});

// 组件挂载时
onMounted(() => {
  // 模拟加载数据
  setTimeout(() => {
    loading.value = false;
  }, 800);
});
</script>

<style lang="scss" scoped>
@import '@/static/common.scss';

/* 标签页导航 */
.tabs-header {
  .tab-item {
    position: relative;
    
    .tab-indicator {
      bottom: 0;
      width: 60rpx;
      height: 4rpx;
      border-radius: 2rpx;
      background-color: $primary-color;
      transition: all 0.3s ease;
    }
  }
}

.workorder-cards {
  .workorder-card {
    .card-header {
      .left-area {
        display: flex;
        align-items: center;
        
        .workorder-id {
          font-size: $font-size-medium;
          font-weight: 500;
          color: $text-regular;
          margin-left: $spacing-small;
        }
      }
    }
    
    .workorder-type {
      padding: 0 $spacing-medium;
      margin-top: $spacing-base;
      
      .type-tag {
        display: inline-block;
        padding: 4rpx 16rpx;
        border-radius: $radius-small;
        font-size: $font-size-mini;
        
        &.type-daily {
          background-color: rgba($primary-color, 0.1);
          color: $primary-color;
        }
        
        &.type-professional {
          background-color: rgba(88, 86, 214, 0.1);
          color: #5856d6;
        }
        
        &.type-repair1 {
          background-color: rgba($error-color, 0.1);
          color: $error-color;
        }
        
        &.type-repair2 {
          background-color: rgba($secondary-color, 0.1);
          color: $secondary-color;
        }
      }
    }
    
    .card-content {
      .info-item {
        .info-value {
          &.abnormal {
            color: $error-color;
          }
        }
      }
    }
  }
}
</style>