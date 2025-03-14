<template>
  <view class="device-detail">
    <detail
      title="设备报修详情"
      :config="detailConfig"
      @back="handleBack"
      @item-click="handleItemClick"
    >
      <!-- 自定义标题栏右侧内容 -->
      <template #header-right>
        <uni-icons type="more-filled" size="24" color="#333" @click="showMoreActions"></uni-icons>
      </template>
      
      <!-- 自定义分组操作区域 -->
      <template #group-actions-0>
        <text class="edit-text" @click="editBasicInfo">编辑</text>
      </template>
      
      <!-- 自定义内容渲染 -->
      <template #custom-1-2="{ item }">
        <view class="status-wrapper">
          <view class="status-indicator" :style="{ backgroundColor: getStatusColor(item.value) }"></view>
          <text>{{ item.value }}</text>
        </view>
      </template>
      
      <!-- 底部按钮 -->
      <!-- <template #footer>
        <view class="footer-buttons">
          <button class="btn btn-secondary" @click="rejectRepair">驳回</button>
          <button class="btn btn-primary" @click="approveRepair">审批通过</button>
        </view>
      </template> -->
    </detail>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Detail from '@/components/Details/Details.vue';

// 详情配置
const detailConfig = ref([
  {
    title: '基本信息',
    indicatorColor: '#0086F6',
    items: [
      { label: '设备类别', value: '生产设备', type: 'select' },
      { label: '设备编号', value: '123654125', type: 'text' },
      { label: '设备名称', value: '复合板', type: 'text' },
      { label: '故障设备地点', value: '装配', type: 'select' },
      { label: '设备故障描述', value: '气管破解', type: 'textarea', layout: 'column' },
      { label: '设备故障图片', value: 'https://example.com/img.jpg', type: 'image', layout: 'column' },
    ]
  },
  {
    title: '联系信息',
    indicatorColor: '#FF9500',
    items: [
      { label: '联系人', value: '黄伟', type: 'text' },
      { label: '联系方式', value: '12345678910', type: 'phone' },
      { label: '当前审批状态', value: '审批中', type: 'custom' },
    ]
  }
]);

// 返回按钮处理
const handleBack = () => {
  uni.navigateBack();
};

// 点击详情项处理
const handleItemClick = (data) => {
  console.log('点击了', data.item.label, data.item.value);
};

// 获取状态颜色
const getStatusColor = (status) => {
  const statusMap = {
    '待审批': '#FF9500',
    '审批中': '#0086F6',
    '已通过': '#52C41A',
    '已驳回': '#FF4D4F'
  };
  return statusMap[status] || '#999';
};

// 显示更多操作
const showMoreActions = () => {
  uni.showActionSheet({
    itemList: ['分享', '导出PDF', '打印'],
    success: (res) => {
      console.log('选择了', res.tapIndex);
    }
  });
};

// 编辑基本信息
const editBasicInfo = () => {
  uni.navigateTo({
    url: '/pages/device/edit'
  });
};

// 审批通过
const approveRepair = () => {
  uni.showModal({
    title: '确认通过',
    content: '确定通过此设备报修申请吗？',
    success: (res) => {
      if (res.confirm) {
        // 更新状态
        detailConfig.value[1].items[2].value = '已通过';
        uni.showToast({
          title: '审批已通过',
          icon: 'success'
        });
      }
    }
  });
};

// 驳回申请
const rejectRepair = () => {
  uni.showModal({
    title: '确认驳回',
    content: '确定驳回此设备报修申请吗？',
    success: (res) => {
      if (res.confirm) {
        // 更新状态
        detailConfig.value[1].items[2].value = '已驳回';
        uni.showToast({
          title: '已驳回申请',
          icon: 'none'
        });
      }
    }
  });
};

// 页面加载时获取数据
onMounted(() => {
  // 模拟从服务器获取数据
  setTimeout(() => {
    // 这里可以更新detailConfig
  }, 500);
});
</script>

<style lang="scss" scoped>
.device-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.edit-text {
  color: #0086F6;
  font-size: 14px;
}

.status-wrapper {
  display: flex;
  align-items: center;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.footer-buttons {
  display: flex;
  justify-content: space-between;
  padding: 0 30rpx;
}

.btn {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  border-radius: 44rpx;
  font-size: 32rpx;
}

.btn-primary {
  background-color: #0086F6;
  color: #fff;
  margin-left: 30rpx;
}

.btn-secondary {
  background-color: #fff;
  color: #666;
  border: 1px solid #ddd;
}
</style>