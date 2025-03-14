<template>
  <view class="page-container">
    <!-- 顶部导航栏 -->
    <nav-bar 
      title="盘点单" 
      @back="goBack"
    ></nav-bar>
    
    <!-- 搜索框 -->
    <search-box 
      placeholder="搜索盘点单号或名称" 
      @search="searchInventories"
      @clear="clearSearch"
    ></search-box>
    
    <!-- 盘点单列表区域 -->
    <scroll-view 
      class="list-container"
      scroll-y 
      @scrolltolower="loadMoreInventories"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh">
      
      <!-- 空状态 -->
      <empty-state 
        v-if="inventoryOrders.length === 0 && !loading"
        imageSrc="/static/empty-inventory.png"
        text="暂无盘点单"
        @refresh="refreshInventories"
      ></empty-state>
      
      <!-- 加载中状态 -->
      <view class="loading-state" v-if="loading">
        <uni-load-more status="loading" :contentText="loadingText"></uni-load-more>
      </view>
      
      <!-- 盘点单卡片列表 -->
      <view class="inventory-cards" v-else>
        <view 
          class="inventory-card" 
          v-for="(order, index) in inventoryOrders" 
          :key="index"
          @click="viewInventoryDetail(order)">
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="left-area">
              <view class="blue-line"></view>
              <text class="order-id">{{ order.id }}</text>
            </view>
            <view class="right-area">
              <status-tag :status="order.status" :text="order.statusText"></status-tag>
            </view>
          </view>
          
          <!-- 卡片内容 -->
          <view class="card-content">
            <view class="info-item">
              <text class="info-label">盘点名称:</text>
              <text class="info-value">{{ order.name }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">总数:</text>
              <text class="info-value">{{ order.totalCount }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">责任部门:</text>
              <text class="info-value">{{ order.department }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">未盘点数:</text>
              <text class="info-value" :class="{'highlight': order.unInventoryCount > 0}">{{ order.unInventoryCount }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">未盘点比:</text>
              <text class="info-value" :class="{'highlight': order.unInventoryPercent > 0}">{{ order.unInventoryPercent }}%</text>
            </view>
            <view class="info-item">
              <text class="info-label">计划开始:</text>
              <text class="info-value">{{ order.planStartTime }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">计划结束:</text>
              <text class="info-value">{{ order.planEndTime }}</text>
            </view>
            <view class="info-item" v-if="order.notes">
              <text class="info-label">备注:</text>
              <text class="info-value">{{ order.notes }}</text>
            </view>
          </view>
          
          <!-- 分隔线 -->
          <view class="divider"></view>
          
          <!-- 创建信息 -->
          <view class="creator-info">
            <text class="creator-name">{{ order.creator }}</text>
            <text class="create-time">创建于{{ order.createTime }}</text>
          </view>
        </view>
        
        <!-- 加载更多区域 -->
        <view class="load-more-area" v-if="inventoryOrders.length > 0">
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
  contentnomore: '没有更多盘点单'
};

// 盘点单数据
const inventoryOrders = ref([
  {
    id: 'JH20241209002611',
    status: 'completed',
    statusText: '已完成',
    name: '202412-喷涂',
    totalCount: 196,
    department: '机械制造-喷涂',
    unInventoryCount: 0,
    unInventoryPercent: 0.00,
    planStartTime: '2024-12-09 00:00:00',
    planEndTime: '2025-01-31 00:00:00',
    notes: '无',
    creator: '华珏',
    createTime: '2024-12-09 13:18:08'
  },
  {
    id: 'JH20241209002512',
    status: 'completed',
    statusText: '已完成',
    name: '202412-运维保障',
    totalCount: 40,
    department: '运维部-设备保障',
    unInventoryCount: 0,
    unInventoryPercent: 0.00,
    planStartTime: '2024-12-09 00:00:00',
    planEndTime: '2025-01-31 00:00:00',
    notes: '',
    creator: '王明',
    createTime: '2024-12-09 11:25:46'
  },
  {
    id: 'JH20241208001813',
    status: 'inprogress',
    statusText: '进行中',
    name: '202412-机加工',
    totalCount: 128,
    department: '机械制造-机加工',
    unInventoryCount: 35,
    unInventoryPercent: 27.34,
    planStartTime: '2024-12-08 00:00:00',
    planEndTime: '2025-01-15 00:00:00',
    notes: '需优先盘点高价值设备',
    creator: '李强',
    createTime: '2024-12-08 09:45:32'
  },
  {
    id: 'JH20241207001514',
    status: 'inprogress',
    statusText: '进行中',
    name: '202412-仓储物流',
    totalCount: 87,
    department: '物流部-仓储',
    unInventoryCount: 12,
    unInventoryPercent: 13.79,
    planStartTime: '2024-12-07 00:00:00',
    planEndTime: '2025-01-10 00:00:00',
    notes: '',
    creator: '张伟',
    createTime: '2024-12-07 15:30:21'
  }
]);

// 搜索盘点单
const searchInventories = (keyword) => {
  if (!keyword.trim()) {
    refreshInventories();
    return;
  }
  
  loading.value = true;
  
  // 模拟搜索请求
  setTimeout(() => {
    const search = keyword.toLowerCase();
    
    // 备份原始数据
    const originalOrders = [
      {
        id: 'JH20241209002611',
        status: 'completed',
        statusText: '已完成',
        name: '202412-喷涂',
        totalCount: 196,
        department: '机械制造-喷涂',
        unInventoryCount: 0,
        unInventoryPercent: 0.00,
        planStartTime: '2024-12-09 00:00:00',
        planEndTime: '2025-01-31 00:00:00',
        notes: '无',
        creator: '华珏',
        createTime: '2024-12-09 13:18:08'
      },
      {
        id: 'JH20241209002512',
        status: 'completed',
        statusText: '已完成',
        name: '202412-运维保障',
        totalCount: 40,
        department: '运维部-设备保障',
        unInventoryCount: 0,
        unInventoryPercent: 0.00,
        planStartTime: '2024-12-09 00:00:00',
        planEndTime: '2025-01-31 00:00:00',
        notes: '',
        creator: '王明',
        createTime: '2024-12-09 11:25:46'
      },
      {
        id: 'JH20241208001813',
        status: 'inprogress',
        statusText: '进行中',
        name: '202412-机加工',
        totalCount: 128,
        department: '机械制造-机加工',
        unInventoryCount: 35,
        unInventoryPercent: 27.34,
        planStartTime: '2024-12-08 00:00:00',
        planEndTime: '2025-01-15 00:00:00',
        notes: '需优先盘点高价值设备',
        creator: '李强',
        createTime: '2024-12-08 09:45:32'
      },
      {
        id: 'JH20241207001514',
        status: 'inprogress',
        statusText: '进行中',
        name: '202412-仓储物流',
        totalCount: 87,
        department: '物流部-仓储',
        unInventoryCount: 12,
        unInventoryPercent: 13.79,
        planStartTime: '2024-12-07 00:00:00',
        planEndTime: '2025-01-10 00:00:00',
        notes: '',
        creator: '张伟',
        createTime: '2024-12-07 15:30:21'
      }
    ];
    
    // 过滤符合条件的盘点单
    inventoryOrders.value = originalOrders.filter(order => 
      order.id.toLowerCase().includes(search) ||
      order.name.toLowerCase().includes(search) ||
      order.department.toLowerCase().includes(search)
    );
    
    loading.value = false;
  }, 500);
};

// 清除搜索
const clearSearch = () => {
  refreshInventories();
};

// 刷新盘点单列表
const refreshInventories = () => {
  loading.value = true;
  
  // 模拟加载数据
  setTimeout(() => {
    // 实际应用中应从API获取数据
    inventoryOrders.value = [
      {
        id: 'JH20241209002611',
        status: 'completed',
        statusText: '已完成',
        name: '202412-喷涂',
        totalCount: 196,
        department: '机械制造-喷涂',
        unInventoryCount: 0,
        unInventoryPercent: 0.00,
        planStartTime: '2024-12-09 00:00:00',
        planEndTime: '2025-01-31 00:00:00',
        notes: '无',
        creator: '华珏',
        createTime: '2024-12-09 13:18:08'
      },
      {
        id: 'JH20241209002512',
        status: 'completed',
        statusText: '已完成',
        name: '202412-运维保障',
        totalCount: 40,
        department: '运维部-设备保障',
        unInventoryCount: 0,
        unInventoryPercent: 0.00,
        planStartTime: '2024-12-09 00:00:00',
        planEndTime: '2025-01-31 00:00:00',
        notes: '',
        creator: '王明',
        createTime: '2024-12-09 11:25:46'
      },
      {
        id: 'JH20241208001813',
        status: 'inprogress',
        statusText: '进行中',
        name: '202412-机加工',
        totalCount: 128,
        department: '机械制造-机加工',
        unInventoryCount: 35,
        unInventoryPercent: 27.34,
        planStartTime: '2024-12-08 00:00:00',
        planEndTime: '2025-01-15 00:00:00',
        notes: '需优先盘点高价值设备',
        creator: '李强',
        createTime: '2024-12-08 09:45:32'
      },
      {
        id: 'JH20241207001514',
        status: 'inprogress',
        statusText: '进行中',
        name: '202412-仓储物流',
        totalCount: 87,
        department: '物流部-仓储',
        unInventoryCount: 12,
        unInventoryPercent: 13.79,
        planStartTime: '2024-12-07 00:00:00',
        planEndTime: '2025-01-10 00:00:00',
        notes: '',
        creator: '张伟',
        createTime: '2024-12-07 15:30:21'
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
    refreshInventories();
    isRefreshing.value = false;
    
    // 提示用户
    uni.showToast({
      title: '已刷新',
      icon: 'success'
    });
  }, 1000);
};

// 加载更多盘点单
const loadMoreInventories = () => {
  if (loadMoreStatus.value === 'noMore') return;
  
  loadMoreStatus.value = 'loading';
  
  // 模拟加载更多
  setTimeout(() => {
    // 如果盘点单数量大于10条，则认为没有更多数据
    if (inventoryOrders.value.length >= 10) {
      loadMoreStatus.value = 'noMore';
      return;
    }
    
    // 添加新的盘点单
    const newOrders = [
      {
        id: 'JH2024120' + Math.floor(Math.random() * 9 + 1) + '00' + Math.floor(Math.random() * 100),
        status: Math.random() > 0.5 ? 'completed' : 'inprogress',
        statusText: Math.random() > 0.5 ? '已完成' : '进行中',
        name: '202412-' + ['电气设备', '装配区域', '研发中心', '检验设备'][Math.floor(Math.random() * 4)],
        totalCount: Math.floor(Math.random() * 200 + 20),
        department: ['机械制造', '研发部', '质检中心', '设备管理'][Math.floor(Math.random() * 4)] + '-' + 
          ['设备维护', '工装管理', '区域检验', '专项工作'][Math.floor(Math.random() * 4)],
        unInventoryCount: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 30),
        unInventoryPercent: 0,
        planStartTime: '2024-12-0' + Math.floor(Math.random() * 9 + 1) + ' 00:00:00',
        planEndTime: '2025-01-' + Math.floor(Math.random() * 28 + 1) + ' 00:00:00',
        notes: Math.random() > 0.7 ? ['注意核对序列号', '检查铭牌信息', '核实使用状态', '无'][Math.floor(Math.random() * 4)] : '',
        creator: ['张明', '李刚', '王力', '赵伟'][Math.floor(Math.random() * 4)],
        createTime: '2024-12-0' + Math.floor(Math.random() * 9 + 1) + ' ' + 
          Math.floor(Math.random() * 24) + ':' + Math.floor(Math.random() * 60) + ':' + Math.floor(Math.random() * 60)
      }
    ];
    
    // 计算未盘点比例
    newOrders.forEach(order => {
      order.unInventoryPercent = order.totalCount > 0 ? 
        parseFloat((order.unInventoryCount / order.totalCount * 100).toFixed(2)) : 0;
    });
    
    // 添加到列表
    inventoryOrders.value = [...inventoryOrders.value, ...newOrders];
    
    loadMoreStatus.value = 'more';
  }, 1000);
};

// 查看盘点单详情
const viewInventoryDetail = (order) => {
  console.log('查看盘点单详情:', order);
  
  // 实际应用中可以跳转到详情页
  uni.navigateTo({
    url: `/pages/inventory/detail?id=${order.id}`
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

.inventory-cards {
  .inventory-card {
    width: calc(100% - 60rpx);
    background-color: $card-background;
    border-radius: $radius-base;
    box-shadow: $shadow-light;
    overflow: hidden;
    transition: $transition-fast;
    animation: slideIn 0.3s ease;
    margin:$spacing-xl auto ;
    &:active {
      transform: scale(0.98);
      box-shadow: $shadow-light;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: $spacing-medium;
      height: 80rpx;
      
      .left-area {
        display: flex;
        align-items: center;
        height: 100%;
        
        .blue-line {
          width: 8rpx;
          height: 100%;
          background-color: $primary-color;
        }
        
        .order-id {
          font-size: $font-size-medium;
          font-weight: 500;
          color: $text-regular;
          margin-left: $spacing-base;
        }
      }
    }
    
    .card-content {
      padding: $spacing-base $spacing-medium $spacing-medium;
      
      .info-item {
        display: flex;
        margin-bottom: $spacing-small;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .info-label {
          width: 140rpx;
          font-size: $font-size-small;
          color: $text-placeholder;
        }
        
        .info-value {
          flex: 1;
          font-size: $font-size-small;
          color: $text-regular;
          
          &.highlight {
            color: $error-color;
          }
        }
      }
    }
    
    .creator-info {
      padding: $spacing-base $spacing-medium;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .creator-name {
        font-size: $font-size-mini;
        color: $text-secondary;
      }
      
      .create-time {
        font-size: $font-size-mini;
        color: $text-placeholder;
      }
    }
  }
}
</style>