<template>
  <view class="page-container">
    <!-- 顶部导航栏 -->
    <nav-bar 
      title="设备报修" 
      @back="goBack"
    >
      <template #right-action>
        <view class="action-item" @click="toggleFullscreen">
          <uni-icons type="fullscreen" size="22" color="#666"></uni-icons>
        </view>
      </template>
    </nav-bar>
    
    <!-- 搜索框 -->
    <search-box 
      placeholder="搜索报修单号、设备名称或编号" 
      @search="searchRepairOrders"
      @clear="clearSearch"
    ></search-box>
    
    <!-- 报修列表区域 -->
    <scroll-view 
      class="list-container"
      scroll-y 
      @scrolltolower="loadMoreRepairOrders"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh">
      
      <!-- 空状态 -->
      <empty-state 
        v-if="repairOrders.length === 0 && !loading"
        imageSrc="/static/empty-repair.png"
        text="暂无报修单"
        @refresh="refreshRepairOrders"
      ></empty-state>
      
      <!-- 加载中状态 -->
      <view class="loading-state" v-if="loading">
        <uni-load-more status="loading" :contentText="loadingText"></uni-load-more>
      </view>
      
      <!-- 报修卡片列表 -->
      <view class="repair-cards" v-else>
        <view 
          class="repair-card card" 
          v-for="(order, index) in repairOrders" 
          :key="index"
          @click="viewRepairDetail(order)">
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="left-area">
              <view class="order-number">
                <view class="number-indicator">{{ index + 1 }}</view>
                <text class="order-id">{{ order.id }}</text>
              </view>
            </view>
            <view class="right-area">
              <status-tag :status="order.status" :text="order.statusText"></status-tag>
            </view>
          </view>
          
          <!-- 卡片内容 -->
          <view class="card-content">
            <view class="info-item">
              <text class="info-label">上报时间:</text>
              <text class="info-value">{{ order.reportTime }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">故障设备:</text>
              <text class="info-value">{{ order.deviceName }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">设备编号:</text>
              <text class="info-value">{{ order.deviceId }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">维保单位:</text>
              <text class="info-value">{{ order.maintenanceUnit }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">联系人:</text>
              <text class="info-value">{{ order.contactPerson }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">联系电话:</text>
              <text class="info-value">{{ order.contactPhone }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">故障地点:</text>
              <text class="info-value">{{ order.faultLocation }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">故障描述:</text>
              <text class="info-value fault-desc">{{ order.faultDescription }}</text>
            </view>
          </view>
        </view>
        
        <!-- 加载更多区域 -->
        <view class="load-more-area" v-if="repairOrders.length > 0">
          <uni-load-more :status="loadMoreStatus" :contentText="loadMoreText"></uni-load-more>
        </view>
      </view>
    </scroll-view>
    
    <!-- 报修按钮 -->
    <view class="floating-btn repair-button" @click="createNewRepair">
      <uni-icons type="plusempty" size="24" color="#fff"></uni-icons>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import SearchBox from '@/components/SearchBox.vue';
import EmptyState from '@/components/EmptyState.vue';
import StatusTag from '@/components/StatusTag.vue';

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
  contentnomore: '没有更多报修单'
};

// 报修单数据
const repairOrders = ref([
  {
    id: 'SJ20250312000021',
    status: 'pending',
    statusText: '待维修',
    reportTime: '2025-03-12 12:18:47',
    deviceName: '真空机',
    deviceId: 'BJI0263',
    maintenanceUnit: '维保二组',
    contactPerson: '洪峰',
    contactPhone: '13402100486',
    faultLocation: '复合板',
    faultDescription: '启动分子泵跳电'
  },
  {
    id: 'SJ20250311000051',
    status: 'pending',
    statusText: '待维修',
    reportTime: '2025-03-11 14:14:46',
    deviceName: '数控卧车',
    deviceId: 'BJM0289',
    maintenanceUnit: '维保一组',
    contactPerson: '朱建龙',
    contactPhone: '13917378329',
    faultLocation: '机加',
    faultDescription: '主轴不运转，检查发现电机轴承损坏'
  },
  {
    id: 'SJ20250310000041',
    status: 'inprogress',
    statusText: '维修中',
    reportTime: '2025-03-10 09:23:15',
    deviceName: '立式加工中心',
    deviceId: 'BJM0152',
    maintenanceUnit: '维保三组',
    contactPerson: '王明',
    contactPhone: '13851678245',
    faultLocation: '机加车间',
    faultDescription: '主轴异响，需要检查轴承'
  },
  {
    id: 'SJ20250309000087',
    status: 'completed',
    statusText: '已完成',
    reportTime: '2025-03-09 16:05:32',
    deviceName: '激光切割机',
    deviceId: 'BJL0078',
    maintenanceUnit: '维保二组',
    contactPerson: '李强',
    contactPhone: '13602457899',
    faultLocation: '切割区',
    faultDescription: '光路偏移，切割不准确'
  }
]);

// 搜索报修单
const searchRepairOrders = (keyword) => {
  if (!keyword.trim()) {
    refreshRepairOrders();
    return;
  }
  
  loading.value = true;
  
  // 模拟搜索请求
  setTimeout(() => {
    const search = keyword.toLowerCase();
    
    // 备份原始数据
    const originalOrders = [
      {
        id: 'SJ20250312000021',
        status: 'pending',
        statusText: '待维修',
        reportTime: '2025-03-12 12:18:47',
        deviceName: '真空机',
        deviceId: 'BJI0263',
        maintenanceUnit: '维保二组',
        contactPerson: '洪峰',
        contactPhone: '13402100486',
        faultLocation: '复合板',
        faultDescription: '启动分子泵跳电'
      },
      {
        id: 'SJ20250311000051',
        status: 'pending',
        statusText: '待维修',
        reportTime: '2025-03-11 14:14:46',
        deviceName: '数控卧车',
        deviceId: 'BJM0289',
        maintenanceUnit: '维保一组',
        contactPerson: '朱建龙',
        contactPhone: '13917378329',
        faultLocation: '机加',
        faultDescription: '主轴不运转，检查发现电机轴承损坏'
      },
      {
        id: 'SJ20250310000041',
        status: 'inprogress',
        statusText: '维修中',
        reportTime: '2025-03-10 09:23:15',
        deviceName: '立式加工中心',
        deviceId: 'BJM0152',
        maintenanceUnit: '维保三组',
        contactPerson: '王明',
        contactPhone: '13851678245',
        faultLocation: '机加车间',
        faultDescription: '主轴异响，需要检查轴承'
      },
      {
        id: 'SJ20250309000087',
        status: 'completed',
        statusText: '已完成',
        reportTime: '2025-03-09 16:05:32',
        deviceName: '激光切割机',
        deviceId: 'BJL0078',
        maintenanceUnit: '维保二组',
        contactPerson: '李强',
        contactPhone: '13602457899',
        faultLocation: '切割区',
        faultDescription: '光路偏移，切割不准确'
      }
    ];
    
    // 过滤符合条件的报修单
    repairOrders.value = originalOrders.filter(order => 
      order.id.toLowerCase().includes(search) ||
      order.deviceName.toLowerCase().includes(search) ||
      order.deviceId.toLowerCase().includes(search) ||
      order.contactPerson.toLowerCase().includes(search)
    );
    
    loading.value = false;
  }, 500);
};

// 清除搜索
const clearSearch = () => {
  refreshRepairOrders();
};

// 刷新报修单列表
const refreshRepairOrders = () => {
  loading.value = true;
  
  // 模拟加载数据
  setTimeout(() => {
    // 实际应用中应从API获取数据
    repairOrders.value = [
      {
        id: 'SJ20250312000021',
        status: 'pending',
        statusText: '待维修',
        reportTime: '2025-03-12 12:18:47',
        deviceName: '真空机',
        deviceId: 'BJI0263',
        maintenanceUnit: '维保二组',
        contactPerson: '洪峰',
        contactPhone: '13402100486',
        faultLocation: '复合板',
        faultDescription: '启动分子泵跳电'
      },
      {
        id: 'SJ20250311000051',
        status: 'pending',
        statusText: '待维修',
        reportTime: '2025-03-11 14:14:46',
        deviceName: '数控卧车',
        deviceId: 'BJM0289',
        maintenanceUnit: '维保一组',
        contactPerson: '朱建龙',
        contactPhone: '13917378329',
        faultLocation: '机加',
        faultDescription: '主轴不运转，检查发现电机轴承损坏'
      },
      {
        id: 'SJ20250310000041',
        status: 'inprogress',
        statusText: '维修中',
        reportTime: '2025-03-10 09:23:15',
        deviceName: '立式加工中心',
        deviceId: 'BJM0152',
        maintenanceUnit: '维保三组',
        contactPerson: '王明',
        contactPhone: '13851678245',
        faultLocation: '机加车间',
        faultDescription: '主轴异响，需要检查轴承'
      },
      {
        id: 'SJ20250309000087',
        status: 'completed',
        statusText: '已完成',
        reportTime: '2025-03-09 16:05:32',
        deviceName: '激光切割机',
        deviceId: 'BJL0078',
        maintenanceUnit: '维保二组',
        contactPerson: '李强',
        contactPhone: '13602457899',
        faultLocation: '切割区',
        faultDescription: '光路偏移，切割不准确'
      }
    ];
    
    loading.value = false;
    loadMoreStatus.value = 'more';
  }, 800);
};

// 下拉刷新
const onRefresh = () => {
  isRefreshing.value = true;
  
  // 模拟刷新数据
  setTimeout(() => {
    refreshRepairOrders();
    isRefreshing.value = false;
    
    // 提示用户
    uni.showToast({
      title: '已刷新',
      icon: 'success'
    });
  }, 1000);
};

// 加载更多报修单
const loadMoreRepairOrders = () => {
  if (loadMoreStatus.value === 'noMore') return;
  
  loadMoreStatus.value = 'loading';
  
  // 模拟加载更多
  setTimeout(() => {
    // 如果报修单数量大于10条，则认为没有更多数据
    if (repairOrders.value.length >= 10) {
      loadMoreStatus.value = 'noMore';
      return;
    }
    
    // 添加新的报修单
    const newOrders = [
      {
        id: 'SJ2025030' + Math.floor(Math.random() * 1000000),
        status: 'pending',
        statusText: '待维修',
        reportTime: '2025-03-0' + Math.floor(Math.random() * 9 + 1) + ' ' + 
          Math.floor(Math.random() * 24) + ':' + 
          Math.floor(Math.random() * 60) + ':' + 
          Math.floor(Math.random() * 60),
        deviceName: ['数控铣床', '喷砂机', '注塑机', '检测设备'][Math.floor(Math.random() * 4)],
        deviceId: 'BJ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
          Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        maintenanceUnit: '维保' + ['一', '二', '三'][Math.floor(Math.random() * 3)] + '组',
        contactPerson: ['张明', '李强', '王刚', '赵峰'][Math.floor(Math.random() * 4)],
        contactPhone: '1' + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0'),
        faultLocation: ['机加', '装配', '物流', '质检'][Math.floor(Math.random() * 4)],
        faultDescription: [
          '设备无法启动',
          '运行中异常停止',
          '显示屏无显示',
          '异常噪音',
          '液压系统泄漏'
        ][Math.floor(Math.random() * 5)]
      }
    ];
    
    // 添加到列表
    repairOrders.value = [...repairOrders.value, ...newOrders];
    
    loadMoreStatus.value = 'more';
  }, 1000);
};

// 查看报修单详情
const viewRepairDetail = (order) => {
  console.log('查看报修单详情:', order);
  
  // 实际应用中可以跳转到详情页
  uni.navigateTo({
    url: `/pages/repair/detail?id=${order.id}`
  });
};

// 创建新报修
const createNewRepair = () => {
  uni.navigateTo({
    url: '/pages/repair/create'
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 切换全屏
const toggleFullscreen = () => {
  // 实际应用中实现全屏功能
  uni.showToast({
    title: '切换全屏视图',
    icon: 'none'
  });
};

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

.repair-cards {
  .repair-card {
    .card-header {
      .left-area {
        .order-number {
          display: flex;
          align-items: center;
          
          .number-indicator {
            width: 40rpx;
            height: 40rpx;
            border-radius: $radius-circle;
            background-color: $primary-color;
            color: white;
            font-size: $font-size-mini;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: $spacing-small;
          }
          
          .order-id {
            font-size: $font-size-medium;
            font-weight: 500;
            color: $text-regular;
          }
        }
      }
    }
    
    .card-content {
      .info-item {
        .info-value {
          &.fault-desc {
            color: $error-color;
          }
        }
      }
    }
  }
}

.repair-button {
  background: linear-gradient(135deg, $error-color, darken($error-color, 10%));
  
  &:active {
    background: linear-gradient(135deg, darken($error-color, 5%), darken($error-color, 15%));
  }
}
</style>