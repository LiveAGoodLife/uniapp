<template>
  <view class="page-container">
    <!-- 顶部导航栏 -->
    <nav-bar 
      title="开/关机记录" 
      :showScanButton="true"
      @back="goBack"
      @scan-success="handleScanResult"
    ></nav-bar>
    
    <!-- 搜索框 -->
    <search-box 
      placeholder="搜索设备名称或编号" 
      @search="searchDevices"
      @clear="clearSearch"
    ></search-box>
    
    <!-- 设备列表区域 -->
    <scroll-view 
      class="list-container"
      scroll-y 
      @scrolltolower="loadMoreDevices"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh">
      
      <!-- 空状态 -->
      <empty-state 
        v-if="devices.length === 0 && !loading"
        imageSrc="/static/empty-device.png"
        text="暂无设备记录"
        @refresh="refreshDevices"
      ></empty-state>
      
      <!-- 加载中状态 -->
      <view class="loading-state" v-if="loading">
        <uni-load-more status="loading" :contentText="loadingText"></uni-load-more>
      </view>
      
      <!-- 设备卡片列表 -->
      <view class="device-cards" v-else>
        <view 
          class="device-card card" 
          v-for="(device, index) in devices" 
          :key="index"
          @click="viewDeviceDetail(device)">
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="left-area">
              <view class="number-indicator">{{ index + 1 }}</view>
              <view class="device-icon-container">
                <uni-icons type="calendar" size="20" color="#fff"></uni-icons>
              </view>
              <text class="device-name">{{ device.name }}</text>
            </view>
          </view>
          
          <!-- 设备分类标签 -->
          <view class="device-category">
            <view class="category-tag">{{ device.category }}</view>
          </view>
          
          <!-- 卡片内容 -->
          <view class="card-content">
            <view class="info-item">
              <text class="info-label">设备编号:</text>
              <text class="info-value">{{ device.id }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">设备位置:</text>
              <text class="info-value">{{ device.location }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">成本中心:</text>
              <text class="info-value">{{ device.costCenter }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">最近开机时间:</text>
              <text class="info-value">{{ device.lastPowerOn || '-' }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">最近关机时间:</text>
              <text class="info-value">{{ device.lastPowerOff || '-' }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">年运行时间:</text>
              <text class="info-value">{{ device.yearRunTime || '-' }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">月运行时间:</text>
              <text class="info-value">{{ device.monthRunTime || '-' }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">日运行时间:</text>
              <text class="info-value">{{ device.dayRunTime || '-' }}</text>
            </view>
          </view>
        </view>
        
        <!-- 加载更多区域 -->
        <view class="load-more-area" v-if="devices.length > 0">
          <uni-load-more :status="loadMoreStatus" :contentText="loadMoreText"></uni-load-more>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import SearchBox from '@/components/SearchBox.vue';
import EmptyState from '@/components/EmptyState.vue';

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
  contentnomore: '没有更多设备'
};

// 设备数据
const devices = ref([
  {
    name: '移动式烟尘处理器',
    category: '移动类环保设备',
    id: 'BSKJF6653',
    location: '堆焊',
    costCenter: '机械制造-喷涂',
    lastPowerOn: '-',
    lastPowerOff: '-',
    yearRunTime: '-',
    monthRunTime: '-',
    dayRunTime: '-'
  },
  {
    name: '移动式烟尘处理器',
    category: '移动类环保设备',
    id: 'BSKJF6694',
    location: '机加',
    costCenter: '机械制造-机加工',
    lastPowerOn: '2025-03-10 08:25:33',
    lastPowerOff: '2025-03-10 17:45:12',
    yearRunTime: '426.5h',
    monthRunTime: '58.3h',
    dayRunTime: '9.33h'
  },
  {
    name: '立式加工中心',
    category: '加工类设备',
    id: 'BSKJF4278',
    location: '精密加工区',
    costCenter: '机械制造-精密加工',
    lastPowerOn: '2025-03-11 07:30:15',
    lastPowerOff: '2025-03-11 19:15:42',
    yearRunTime: '1253.8h',
    monthRunTime: '182.5h',
    dayRunTime: '11.75h'
  },
  {
    name: '数控车床',
    category: '加工类设备',
    id: 'BSKJF3892',
    location: '机加车间',
    costCenter: '机械制造-机加工',
    lastPowerOn: '2025-03-12 06:45:22',
    lastPowerOff: '-',
    yearRunTime: '835.2h',
    monthRunTime: '105.7h',
    dayRunTime: '5.25h'
  }
]);

// 处理扫码结果
const handleScanResult = (result) => {
  searchDevices(result.result);
};

// 搜索设备
const searchDevices = (keyword) => {
  if (!keyword.trim()) {
    refreshDevices();
    return;
  }
  
  loading.value = true;
  
  // 模拟搜索请求
  setTimeout(() => {
    const search = keyword.toLowerCase();
    
    // 备份原始数据
    const originalDevices = [
      {
        name: '移动式烟尘处理器',
        category: '移动类环保设备',
        id: 'BSKJF6653',
        location: '堆焊',
        costCenter: '机械制造-喷涂',
        lastPowerOn: '-',
        lastPowerOff: '-',
        yearRunTime: '-',
        monthRunTime: '-',
        dayRunTime: '-'
      },
      {
        name: '移动式烟尘处理器',
        category: '移动类环保设备',
        id: 'BSKJF6694',
        location: '机加',
        costCenter: '机械制造-机加工',
        lastPowerOn: '2025-03-10 08:25:33',
        lastPowerOff: '2025-03-10 17:45:12',
        yearRunTime: '426.5h',
        monthRunTime: '58.3h',
        dayRunTime: '9.33h'
      },
      {
        name: '立式加工中心',
        category: '加工类设备',
        id: 'BSKJF4278',
        location: '精密加工区',
        costCenter: '机械制造-精密加工',
        lastPowerOn: '2025-03-11 07:30:15',
        lastPowerOff: '2025-03-11 19:15:42',
        yearRunTime: '1253.8h',
        monthRunTime: '182.5h',
        dayRunTime: '11.75h'
      },
      {
        name: '数控车床',
        category: '加工类设备',
        id: 'BSKJF3892',
        location: '机加车间',
        costCenter: '机械制造-机加工',
        lastPowerOn: '2025-03-12 06:45:22',
        lastPowerOff: '-',
        yearRunTime: '835.2h',
        monthRunTime: '105.7h',
        dayRunTime: '5.25h'
      }
    ];
    
    // 过滤符合条件的设备
    devices.value = originalDevices.filter(device => 
      device.name.toLowerCase().includes(search) ||
      device.id.toLowerCase().includes(search) ||
      device.location.toLowerCase().includes(search) ||
      device.category.toLowerCase().includes(search)
    );
    
    loading.value = false;
  }, 500);
};

// 清除搜索
const clearSearch = () => {
  refreshDevices();
};

// 刷新设备列表
const refreshDevices = () => {
  loading.value = true;
  
  // 模拟加载数据
  setTimeout(() => {
    // 实际应用中应从API获取数据
    devices.value = [
      {
        name: '移动式烟尘处理器',
        category: '移动类环保设备',
        id: 'BSKJF6653',
        location: '堆焊',
        costCenter: '机械制造-喷涂',
        lastPowerOn: '-',
        lastPowerOff: '-',
        yearRunTime: '-',
        monthRunTime: '-',
        dayRunTime: '-'
      },
      {
        name: '移动式烟尘处理器',
        category: '移动类环保设备',
        id: 'BSKJF6694',
        location: '机加',
        costCenter: '机械制造-机加工',
        lastPowerOn: '2025-03-10 08:25:33',
        lastPowerOff: '2025-03-10 17:45:12',
        yearRunTime: '426.5h',
        monthRunTime: '58.3h',
        dayRunTime: '9.33h'
      },
      {
        name: '立式加工中心',
        category: '加工类设备',
        id: 'BSKJF4278',
        location: '精密加工区',
        costCenter: '机械制造-精密加工',
        lastPowerOn: '2025-03-11 07:30:15',
        lastPowerOff: '2025-03-11 19:15:42',
        yearRunTime: '1253.8h',
        monthRunTime: '182.5h',
        dayRunTime: '11.75h'
      },
      {
        name: '数控车床',
        category: '加工类设备',
        id: 'BSKJF3892',
        location: '机加车间',
        costCenter: '机械制造-机加工',
        lastPowerOn: '2025-03-12 06:45:22',
        lastPowerOff: '-',
        yearRunTime: '835.2h',
        monthRunTime: '105.7h',
        dayRunTime: '5.25h'
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
    refreshDevices();
    isRefreshing.value = false;
    
    // 提示用户
    uni.showToast({
      title: '已刷新',
      icon: 'success'
    });
  }, 1000);
};

// 加载更多设备
const loadMoreDevices = () => {
  if (loadMoreStatus.value === 'noMore') return;
  
  loadMoreStatus.value = 'loading';
  
  // 模拟加载更多
  setTimeout(() => {
    // 如果设备数量大于10条，则认为没有更多数据
    if (devices.value.length >= 10) {
      loadMoreStatus.value = 'noMore';
      return;
    }
    
    // 添加新的设备
    const deviceTypes = [
      {
        name: '三轴数控铣床',
        category: '加工类设备'
      },
      {
        name: '激光切割机',
        category: '切割类设备'
      },
      {
        name: '电火花机',
        category: '特种加工设备'
      },
      {
        name: '空气压缩机',
        category: '动力类设备'
      }
    ];
    
    const randomType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    
    const newDevice = {
      name: randomType.name,
      category: randomType.category,
      id: 'BSKJF' + Math.floor(1000 + Math.random() * 9000),
      location: ['机加车间', '精密加工区', '组装车间', '焊接区'][Math.floor(Math.random() * 4)],
      costCenter: '机械制造-' + ['精密加工', '机加工', '装配', '焊接'][Math.floor(Math.random() * 4)],
      lastPowerOn: Math.random() > 0.2 ? 
        `2025-03-${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')} ${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : '-',
      lastPowerOff: Math.random() > 0.3 ? 
        `2025-03-${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')} ${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : '-',
      yearRunTime: Math.random() > 0.1 ? (Math.floor(Math.random() * 2000) + Math.random()).toFixed(1) + 'h' : '-',
      monthRunTime: Math.random() > 0.1 ? (Math.floor(Math.random() * 300) + Math.random()).toFixed(1) + 'h' : '-',
      dayRunTime: Math.random() > 0.1 ? (Math.floor(Math.random() * 24) + Math.random()).toFixed(2) + 'h' : '-'
    };
    
    // 添加到列表
    devices.value.push(newDevice);
    
    loadMoreStatus.value = 'more';
  }, 1000);
};

// 查看设备详情
const viewDeviceDetail = (device) => {
  console.log('查看设备详情:', device);
  
  // 实际应用中可以跳转到详情页
  uni.navigateTo({
    url: `/pages/device/power-log-detail?id=${device.id}`
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
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

.device-cards {
  .device-card {
    .card-header {
      .left-area {
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
        
        .device-icon-container {
          width: 40rpx;
          height: 40rpx;
          background-color: $secondary-color;
          border-radius: $radius-small;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: $spacing-small;
        }
        
        .device-name {
          font-size: $font-size-medium;
          font-weight: 500;
          color: $text-regular;
        }
      }
    }
    
    .device-category {
      padding: 0 $spacing-medium;
      margin-bottom: $spacing-small;
      
      .category-tag {
        display: inline-block;
        padding: 4rpx 16rpx;
        border-radius: $radius-small;
        font-size: $font-size-mini;
        background-color: rgba($secondary-color, 0.1);
        color: $secondary-color;
      }
    }
  }
}
</style>