<template>
  <view class="page-container">
    <!-- 顶部导航栏 -->
    <nav-bar 
      title="设备信息" 
      :showScanButton="true"
      @back="goBack"
      @scan-success="handleScanResult"
    ></nav-bar>
    
    <!-- 搜索框 -->

      <search-box 
        placeholder="搜索设备编号、名称或位置" 
        @search="searchDevices"
        @clear="clearSearch"
      ></search-box>

    
    <!-- 设备列表 -->
    <scroll-view 
      class="list-container"
      scroll-y 
      @scrolltolower="loadMoreDevices"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh">
      
      <!-- 列表为空时显示 -->
      <empty-state 
        v-if="deviceList.length === 0 && !loading"
        imageSrc="/static/empty-device.png"
        text="没有找到设备信息"
        @refresh="refreshDevices"
      ></empty-state>
      
      <!-- 加载中状态 -->
      <view class="loading-state" v-if="loading">
        <uni-load-more status="loading" :contentText="loadingText"></uni-load-more>
      </view>
      
      <!-- 设备列表项 -->
      <view class="device-items" v-else>
        <view 
          class="device-item" 
          v-for="(device, index) in deviceList" 
          :key="index"
          @click="viewDeviceDetail(device)">
          
          <!-- 左侧状态指示条 -->
          <view class="item-indicator" :class="getStatusClass(device.status)"></view>
          
          <!-- 主要内容区域 -->
          <view class="item-content">
            <!-- 设备编号和状态 -->
            <view class="device-header">
              <view class="device-id">
                <text class="id-text">{{ device.id }}</text>
                <status-tag :status="getStatusType(device.status)" :text="device.status"></status-tag>
              </view>
              <view class="detail-btn">
                查看详情
                <uni-icons type="right" size="14" color="#999"></uni-icons>
              </view>
            </view>
            
            <!-- 设备信息区域 -->
            <view class="device-info">
              <view class="info-row">
                <text class="info-label">设备名称：</text>
                <text class="info-value">{{ device.name }}</text>
              </view>
              
              <view class="info-row">
                <text class="info-label">属性：</text>
                <text class="info-value">{{ device.property }}</text>
              </view>
              
              <view class="info-row">
                <text class="info-label">设备位置：</text>
                <text class="info-value">{{ device.location }}</text>
              </view>
              
              <view class="info-row">
                <text class="info-label">投产时间：</text>
                <text class="info-value">{{ device.productionDate }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 加载更多区域 -->
        <view class="load-more-area" v-if="deviceList.length > 0">
          <uni-load-more :status="loadMoreStatus" :contentText="loadMoreText"></uni-load-more>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部筛选按钮 -->
    <view class="filter-button">
      <view class="action-filter" @click="showFilter">
        <uni-icons type="filter" size="18" color="#666"></uni-icons>
        <text>筛选</text>
      </view>
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
  contentnomore: '没有更多设备'
};

// 设备列表
const deviceList = ref([
  {
    id: 'BSKJF5885',
    name: '大功率激光熔覆成套设备',
    property: '其它',
    location: '喷涂焊焊',
    productionDate: '2017-12-15',
    status: '故障'
  },
  {
    id: 'JSM3034',
    name: '废水低温蒸发器',
    property: '其它',
    location: '含油废水处理',
    productionDate: '2020-11-25',
    status: '可用'
  },
  {
    id: 'RZQ2201',
    name: '数控铣床',
    property: '加工设备',
    location: '机加工车间',
    productionDate: '2019-05-18',
    status: '可用'
  },
  {
    id: 'KLT8976',
    name: '液压冲床',
    property: '冲压设备',
    location: '冲压车间',
    productionDate: '2018-09-30',
    status: '可用'
  },
  {
    id: 'ZXP4432',
    name: '全自动装配线',
    property: '装配设备',
    location: '总装车间',
    productionDate: '2021-03-12',
    status: '可用'
  }
]);

// 处理扫码结果
const handleScanResult = (result) => {
  searchDevices(result.result);
  
  uni.showToast({
    title: '扫码成功: ' + result.result,
    icon: 'none'
  });
};

// 清除搜索
const clearSearch = () => {
  // 重新加载所有设备
  refreshDevices();
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
    // 这里应该是实际的搜索API调用
    // 模拟结果: 过滤包含关键词的设备
    const search = keyword.toLowerCase();
    
    const originalDevices = [
      {
        id: 'BSKJF5885',
        name: '大功率激光熔覆成套设备',
        property: '其它',
        location: '喷涂焊焊',
        productionDate: '2017-12-15',
        status: '故障'
      },
      {
        id: 'JSM3034',
        name: '废水低温蒸发器',
        property: '其它',
        location: '含油废水处理',
        productionDate: '2020-11-25',
        status: '可用'
      },
      {
        id: 'RZQ2201',
        name: '数控铣床',
        property: '加工设备',
        location: '机加工车间',
        productionDate: '2019-05-18',
        status: '可用'
      },
      {
        id: 'KLT8976',
        name: '液压冲床',
        property: '冲压设备',
        location: '冲压车间',
        productionDate: '2018-09-30',
        status: '可用'
      },
      {
        id: 'ZXP4432',
        name: '全自动装配线',
        property: '装配设备',
        location: '总装车间',
        productionDate: '2021-03-12',
        status: '可用'
      }
    ];
    
    deviceList.value = originalDevices.filter(device => 
      device.id.toLowerCase().includes(search) ||
      device.name.toLowerCase().includes(search) ||
      device.location.toLowerCase().includes(search)
    );
    
    loading.value = false;
  }, 800);
};

// 刷新设备列表
const refreshDevices = () => {
  loading.value = true;
  
  // 模拟加载数据
  setTimeout(() => {
    // 重置为初始数据
    deviceList.value = [
      {
        id: 'BSKJF5885',
        name: '大功率激光熔覆成套设备',
        property: '其它',
        location: '喷涂焊焊',
        productionDate: '2017-12-15',
        status: '故障'
      },
      {
        id: 'JSM3034',
        name: '废水低温蒸发器',
        property: '其它',
        location: '含油废水处理',
        productionDate: '2020-11-25',
        status: '可用'
      },
      {
        id: 'RZQ2201',
        name: '数控铣床',
        property: '加工设备',
        location: '机加工车间',
        productionDate: '2019-05-18',
        status: '可用'
      },
      {
        id: 'KLT8976',
        name: '液压冲床',
        property: '冲压设备',
        location: '冲压车间',
        productionDate: '2018-09-30',
        status: '可用'
      },
      {
        id: 'ZXP4432',
        name: '全自动装配线',
        property: '装配设备',
        location: '总装车间',
        productionDate: '2021-03-12',
        status: '可用'
      }
    ];
    
    loading.value = false;
    loadMoreStatus.value = 'more';
  }, 1000);
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
    // 如果设备数量大于10，则表示没有更多了
    if (deviceList.value.length >= 10) {
      loadMoreStatus.value = 'noMore';
      return;
    }
    
    // 添加更多设备
    const moreDevices = [
      {
        id: 'WQP' + Math.floor(Math.random() * 10000),
        name: '自动化检测设备',
        property: '检测设备',
        location: '质检中心',
        productionDate: '2022-01-20',
        status: Math.random() > 0.2 ? '可用' : '故障'
      },
      {
        id: 'LMN' + Math.floor(Math.random() * 10000),
        name: '数字化仓储系统',
        property: '仓储设备',
        location: '成品仓库',
        productionDate: '2021-08-15',
        status: Math.random() > 0.2 ? '可用' : '故障'
      }
    ];
    
    deviceList.value = [...deviceList.value, ...moreDevices];
    loadMoreStatus.value = 'more';
  }, 1000);
};

// 获取状态类名
const getStatusClass = (status) => {
  if (status === '可用') {
    return 'status-available';
  } else if (status === '故障') {
    return 'status-fault';
  } else {
    return 'status-default';
  }
};

// 获取状态类型
const getStatusType = (status) => {
  if (status === '可用') {
    return 'available';
  } else if (status === '故障') {
    return 'fault';
  } else {
    return 'default';
  }
};

// 查看设备详情
const viewDeviceDetail = (device) => {
  console.log('查看设备详情:', device);
  
  // 实际应用中可以跳转到详情页
  uni.navigateTo({
    url: `/pages/device/informationDetails?id=${device.id}`
  });
};

// 显示筛选
const showFilter = () => {
  uni.showToast({
    title: '筛选功能开发中',
    icon: 'none'
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 组件挂载时
onMounted(() => {
  // 模拟加载设备数据
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<style lang="scss" scoped>
@import '@/static/common.scss';



.device-items {
  padding: $spacing-medium 0;
  
  .device-item {
    display: flex;
    margin: 0 $spacing-large $spacing-large;
    background-color: $card-background;
    border-radius: $radius-base;
    overflow: hidden;
    box-shadow: $shadow-light;
    transition: $transition-fast;
    animation: slideIn 0.3s ease;
    
    &:active {
      transform: scale(0.98);
    }
    
    .item-indicator {
      width: 10rpx;
      background-color: $text-placeholder;
      
      &.status-available {
        background-color: $success-color;
      }
      
      &.status-fault {
        background-color: $error-color;
      }
    }
    
    .item-content {
      flex: 1;
      padding: $spacing-medium;
    }
    
    .device-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-base;
      
      .device-id {
        display: flex;
        align-items: center;
        
        .id-text {
          font-size: $font-size-large;
          font-weight: 600;
          color: $text-primary;
          margin-right: $spacing-base;
        }
      }
      
      .detail-btn {
        display: flex;
        align-items: center;
        font-size: $font-size-small;
        color: $text-placeholder;
      }
    }
    
    .device-info {
      .info-row {
        display: flex;
        margin-bottom: $spacing-small;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .info-label {
          width: 160rpx;
          font-size: $font-size-small;
          color: $text-placeholder;
        }
        
        .info-value {
          flex: 1;
          font-size: $font-size-small;
          color: $text-regular;
        }
      }
    }
  }
}

/* 底部筛选按钮 */
.filter-button {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $card-background;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 10;
  padding: $spacing-medium $spacing-large;
  padding-bottom: env(safe-area-inset-bottom, $spacing-medium);
  
  .action-filter {
    height: 88rpx;
    background-color: $background-color;
    border-radius: $radius-large;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-medium;
    color: $text-secondary;
    font-weight: 500;
    transition: $transition-fast;
    
    &:active {
      background-color: darken($background-color, 3%);
    }
    
    text {
      margin-left: $spacing-small;
    }
  }
}
</style>