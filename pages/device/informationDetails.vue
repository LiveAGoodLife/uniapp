<template>
    <view class="device-detail-page">
      <!-- 顶部导航栏 -->
      <view class="nav-bar">
        <view class="back-btn" @click="goBack">
          <uni-icons type="left" size="20" color="#333"></uni-icons>
        </view>
        <text class="page-title">设备详情</text>
        <view class="right-action">
          <text class="scan-text" @click="handleScan">扫一扫</text>
        </view>
      </view>
      
      <!-- 设备状态卡片 -->
      <view class="status-card" :class="{'status-fault': deviceData.statusCode === 'fault'}">
        <view class="card-left">
          <view class="device-id">{{ deviceData.id }}</view>
          <view class="device-name">{{ deviceData.name }}</view>
        </view>
        <view class="card-right">
          <view class="status-badge" :class="{'status-fault': deviceData.statusCode === 'fault'}">
            {{ deviceData.status }}
          </view>
        </view>
      </view>
      
      <!-- 信息标签页 -->
      <view class="tabs-container">
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
        
        <!-- 标签页内容 -->
        <view class="tabs-content">
          <!-- 基础信息页 -->
          <view class="tab-pane" v-if="activeTabIndex === 0">
            <view class="section-title">
              <view class="title-line"></view>
              <text>基础信息</text>
            </view>
            
            <!-- 基础信息卡片 -->
            <view class="info-card">
              <view class="info-grid">
                <view 
                  class="info-item" 
                  v-for="(item, index) in getVisibleBasicInfo()" 
                  :key="index">
                  <text class="info-label">{{ item.label }}</text>
                  <text class="info-value" :class="{'highlight': item.highlight}">{{ item.value || '暂无' }}</text>
                </view>
              </view>
              
              <!-- 展开/收起更多信息 -->
              <view class="expand-action" @click="toggleExpand('basic')">
                <text>{{ expandedSections.basic ? '收起' : '查看更多信息' }}</text>
                <uni-icons :type="expandedSections.basic ? 'top' : 'bottom'" size="14" color="#666"></uni-icons>
              </view>
            </view>
            
            <!-- 使用说明区 -->
            <view class="section-title">
              <view class="title-line"></view>
              <text>设备说明</text>
            </view>
            
            <view class="info-card">
              <view class="desc-content">
                <text class="desc-text">{{ deviceData.description || '暂无设备说明' }}</text>
              </view>
              
              <!-- 附件信息 -->
              <view class="attachments" v-if="deviceData.attachments && deviceData.attachments.length">
                <view class="attachment-header">
                  <uni-icons type="paperclip" size="16" color="#666"></uni-icons>
                  <text>相关文档({{ deviceData.attachments.length }})</text>
                </view>
                
                <view class="attachment-list">
                  <view 
                    class="attachment-item" 
                    v-for="(file, index) in deviceData.attachments" 
                    :key="index"
                    @click="previewFile(file)">
                    <uni-icons :type="getFileIcon(file.type)" size="16" color="#666"></uni-icons>
                    <text class="file-name">{{ file.name }}</text>
                    <text class="file-size">{{ formatFileSize(file.size) }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 设备信息页 -->
          <view class="tab-pane" v-if="activeTabIndex === 1">
            <view class="section-title">
              <view class="title-line"></view>
              <text>设备信息</text>
            </view>
            
            <!-- 设备信息卡片 -->
            <view class="info-card">
              <view class="info-grid">
                <view 
                  class="info-item" 
                  v-for="(item, index) in getVisibleDeviceInfo()" 
                  :key="index">
                  <text class="info-label">{{ item.label }}</text>
                  <text class="info-value" :class="{'highlight': item.highlight}">{{ item.value || '暂无' }}</text>
                </view>
              </view>
              
              <!-- 展开/收起更多信息 -->
              <view class="expand-action" @click="toggleExpand('device')">
                <text>{{ expandedSections.device ? '收起' : '查看更多信息' }}</text>
                <uni-icons :type="expandedSections.device ? 'top' : 'bottom'" size="14" color="#666"></uni-icons>
              </view>
            </view>
            
            <!-- 维保信息区 -->
            <view class="section-title">
              <view class="title-line"></view>
              <text>维保信息</text>
            </view>
            
            <view class="info-card">
              <view class="info-grid">
                <view 
                  class="info-item" 
                  v-for="(item, index) in getVisibleMaintenanceInfo()" 
                  :key="index">
                  <text class="info-label">{{ item.label }}</text>
                  <text class="info-value" :class="{'highlight': item.highlight, 'warning': item.warning}">{{ item.value || '暂无' }}</text>
                </view>
              </view>
              
              <!-- 展开/收起更多信息 -->
              <view class="expand-action" @click="toggleExpand('maintenance')">
                <text>{{ expandedSections.maintenance ? '收起' : '查看更多信息' }}</text>
                <uni-icons :type="expandedSections.maintenance ? 'top' : 'bottom'" size="14" color="#666"></uni-icons>
              </view>
            </view>
          </view>
          
          <!-- 维修记录页 -->
          <view class="tab-pane" v-if="activeTabIndex === 2">
            <view class="section-title">
              <view class="title-line"></view>
              <text>维修记录</text>
            </view>
            
            <!-- 暂无记录状态 -->
            <view class="empty-records" v-if="!deviceData.repairRecords || deviceData.repairRecords.length === 0">
              <image src="/static/empty-repair.png" mode="aspectFit" class="empty-image"></image>
              <text class="empty-text">暂无维修记录</text>
            </view>
            
            <!-- 有记录时展示列表 -->
            <view class="records-list" v-else>
              <view 
                class="record-item" 
                v-for="(record, index) in deviceData.repairRecords" 
                :key="index">
                <view class="record-header">
                  <view class="record-title">{{ record.title }}</view>
                  <view class="record-status" :class="'status-' + record.status">{{ record.statusText }}</view>
                </view>
                
                <view class="record-content">
                  <view class="record-info">
                    <text class="info-label">维修类型:</text>
                    <text class="info-text">{{ record.type }}</text>
                  </view>
                  <view class="record-info">
                    <text class="info-label">维修人员:</text>
                    <text class="info-text">{{ record.worker }}</text>
                  </view>
                  <view class="record-info">
                    <text class="info-label">维修时间:</text>
                    <text class="info-text">{{ record.time }}</text>
                  </view>
                  <view class="record-info">
                    <text class="info-label">维修描述:</text>
                    <text class="info-text">{{ record.description }}</text>
                  </view>
                </view>
                
                <view class="record-footer">
                  <text class="view-detail" @click="viewRepairDetail(record)">查看详情</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 底部操作按钮 -->
      <view class="action-footer">
        <button class="action-btn reset-btn" @click="handleReset">重置</button>
        <button class="action-btn edit-btn" @click="handleEdit">修改</button>
      </view>
    </view>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  
  // 当前激活的标签页索引
  const activeTabIndex = ref(0);
  
  // 标签页定义
  const tabs = [
    { name: '基础信息' },
    { name: '设备信息' },
    { name: '维修记录' }
  ];
  
  // 展开/收起状态
  const expandedSections = reactive({
    basic: false,
    device: false,
    maintenance: false
  });
  
  // 模拟设备数据
  const deviceData = reactive({
    id: 'BSKJF5885',
    name: '大功率激光熔覆成套设备',
    status: '故障',
    statusCode: 'fault',
    description: '该设备为大功率激光熔覆成套设备，主要用于金属表面涂层处理和修复。操作时需注意安全防护，按标准流程操作。',
    
    // 基础信息
    basicInfo: {
      属性: '其它',
      设备型号: '8000W',
      存放地点: '喷涂焊焊',
      制造厂: '南京中科熔宸激光技术',
      厂家序列号: 'ZK20171215-0023',
      开始日期: '2017-12-15',
      设备分级: 'A级',
      成本中心: 'CC001254',
      区域点检: '需要',
      维保单位: '中科技术服务有限公司'
    },
    
    // 设备信息
    deviceInfo: {
      部门名称: '生产制造部',
      购置价格: '￥1,280,000',
      设备净值: '￥580,000',
      折旧年限: '10年',
      设备剩余折旧年限: '2.5年',
      设备属性: '专用设备',
      设备类别: '激光加工设备',
      设备有效性状态: '在用',
      报废日期: '预计2027-12-15',
      停用日期: '',
      出场序列: 'ZK-LC-8000-235',
      车牌号: '不适用',
      发动机号: '不适用',
      保管人: 'ZG008',
      保管人姓名: '李工'
    },
    
    // 维保信息
    maintenanceInfo: {
      作业流程: '标准激光设备操作规程',
      点检标准: 'LS-DJ-2019-056',
      给油脂指标: 'LS-YZ-001',
      维修及验收标准: 'LS-WX-2019-032',
      维保周期: '3个月',
      上次维保日期: '2023-01-15',
      下次维保日期: '2023-04-15',
      定修周期: '6个月',
      上次定修日期: '2022-10-10',
      下次定修日期: '2023-04-10',
      维保单位: '中科技术服务有限公司',
      维保责任人: 'WB006',
      维保责任人姓名: '王师傅',
      送检责任单位: '质检中心',
      上次大修时间: '2021-06-12',
      大修周期: '24个月',
      下次大修日期: '2023-06-12',
      月规定工作天数: '22天',
      班制: '两班制',
      日常点检周期: '每班',
      专业点检周期: '每周',
      一级保养周期: '每月'
    },
    
    // 附件信息
    attachments: [
      { name: '设备说明书.pdf', type: 'pdf', size: 1024 * 1024 * 2.5 },
      { name: '维修手册.docx', type: 'docx', size: 1024 * 650 },
      { name: '操作视频.mp4', type: 'video', size: 1024 * 1024 * 15 }
    ],
    
    // 维修记录
    repairRecords: [
      {
        id: 'R2022112501',
        title: '控制系统故障维修',
        type: '故障维修',
        worker: '张工',
        time: '2022-11-25',
        description: '控制系统出现异常，更换了主控制板和传感器',
        status: 'completed',
        statusText: '已完成'
      },
      {
        id: 'R2022082005',
        title: '激光器功率校准',
        type: '定期维护',
        worker: '李工',
        time: '2022-08-20',
        description: '对激光器进行了功率校准，更换了聚焦镜',
        status: 'completed',
        statusText: '已完成'
      },
      {
        id: 'R2023031501',
        title: '冷却系统维修',
        type: '故障维修',
        worker: '王工',
        time: '2023-03-15',
        description: '冷却系统泄漏，更换了水泵和部分管路',
        status: 'inprogress',
        statusText: '进行中'
      }
    ]
  });
  
  // 获取基础信息(有限显示)
  const getVisibleBasicInfo = () => {
    const info = [];
    const keys = Object.keys(deviceData.basicInfo);
    const displayCount = expandedSections.basic ? keys.length : Math.min(6, keys.length);
    
    for (let i = 0; i < displayCount; i++) {
      const key = keys[i];
      info.push({
        label: key,
        value: deviceData.basicInfo[key]
      });
    }
    
    return info;
  };
  
  // 获取设备信息(有限显示)
  const getVisibleDeviceInfo = () => {
    const info = [];
    const keys = Object.keys(deviceData.deviceInfo);
    const displayCount = expandedSections.device ? keys.length : Math.min(6, keys.length);
    
    for (let i = 0; i < displayCount; i++) {
      const key = keys[i];
      const highlight = (key === '购置价格' || key === '设备净值');
      
      info.push({
        label: key,
        value: deviceData.deviceInfo[key],
        highlight
      });
    }
    
    return info;
  };
  
  // 获取维保信息(有限显示)
  const getVisibleMaintenanceInfo = () => {
    const info = [];
    const keys = Object.keys(deviceData.maintenanceInfo);
    const displayCount = expandedSections.maintenance ? keys.length : Math.min(8, keys.length);
    
    const now = new Date();
    
    for (let i = 0; i < displayCount; i++) {
      const key = keys[i];
      const value = deviceData.maintenanceInfo[key];
      
      // 检查是否是日期字段，以判断是否需要警告标记
      const isDateWarning = (key.includes('下次') && key.includes('日期') && value) ? 
        (new Date(value) - now < 1000 * 60 * 60 * 24 * 14) : false; // 如果不到14天，显示警告
      
      info.push({
        label: key,
        value: value,
        warning: isDateWarning
      });
    }
    
    return info;
  };
  
  // 切换标签页
  const switchTab = (index) => {
    activeTabIndex.value = index;
  };
  
  // 切换展开/收起
  const toggleExpand = (section) => {
    expandedSections[section] = !expandedSections[section];
  };
  
  // 获取文件图标
  const getFileIcon = (fileType) => {
    const fileIcons = {
      'pdf': 'file-pdf',
      'doc': 'file-word',
      'docx': 'file-word',
      'xls': 'file-excel',
      'xlsx': 'file-excel',
      'ppt': 'file-powerpoint',
      'pptx': 'file-powerpoint',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'zip': 'folder',
      'rar': 'folder',
      'video': 'videocam',
      'mp4': 'videocam',
      'mp3': 'sound'
    };
    
    return fileIcons[fileType] || 'file';
  };
  
  // 格式化文件大小
  const formatFileSize = (size) => {
    if (size < 1024) {
      return size + 'B';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(1) + 'KB';
    } else {
      return (size / (1024 * 1024)).toFixed(1) + 'MB';
    }
  };
  
  // 预览文件
  const previewFile = (file) => {
    uni.showToast({
      title: `预览文件: ${file.name}`,
      icon: 'none'
    });
    
    // 实际应用中应该跳转到文件预览页面或调用系统预览功能
  };
  
  // 查看维修详情
  const viewRepairDetail = (record) => {
    console.log('查看维修记录详情:', record);
    
    // 实际应用中应该跳转到维修记录详情页
    uni.navigateTo({
      url: `/pages/repair/detail?id=${record.id}`
    });
  };
  
  // 返回上一页
  const goBack = () => {
    uni.navigateBack();
  };
  
  // 扫码
  const handleScan = () => {
    uni.scanCode({
      success: (res) => {
        console.log('扫码结果：', res);
        // 实际应用中可能跳转到对应设备
      }
    });
  };
  
  // 重置操作
  const handleReset = () => {
    uni.showModal({
      title: '确认重置',
      content: '确定要重置设备信息吗？',
      success: (res) => {
        if (res.confirm) {
          uni.showToast({
            title: '重置成功',
            icon: 'success'
          });
        }
      }
    });
  };
  
  // 编辑操作
  const handleEdit = () => {
    uni.navigateTo({
      url: `/pages/device/edit?id=${deviceData.id}`
    });
  };
  
  // 组件挂载时
  onMounted(() => {
    // 在实际应用中，这里应该从API获取设备数据
    console.log('设备详情页加载完成');
  });
  </script>
  
  <style lang="scss" scoped>
  .device-detail-page {
    min-height: 100vh;
    background-color: #f7f8fa;
    padding-bottom: 140rpx;
  }
  
  /* 导航栏 */
  .nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 88rpx;
    padding: 0 30rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #eaeaea;
    
    .back-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .page-title {
      font-size: 34rpx;
      font-weight: 600;
      color: #333;
    }
    
    .right-action {
      .scan-text {
        color: #2979ff;
        font-size: 30rpx;
        font-weight: 500;
        
        &:active {
          opacity: 0.7;
        }
      }
    }
  }
  
  /* 设备状态卡片 */
  .status-card {
    margin: 30rpx;
    background-color: #2979ff;
    border-radius: 16rpx;
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    box-shadow: 0 4rpx 12rpx rgba(41, 121, 255, 0.2);
    
    &.status-fault {
      background-color: #ff3b30;
      box-shadow: 0 4rpx 12rpx rgba(255, 59, 48, 0.2);
    }
    
    .card-left {
      .device-id {
        font-size: 28rpx;
        opacity: 0.9;
        margin-bottom: 10rpx;
      }
      
      .device-name {
        font-size: 36rpx;
        font-weight: 600;
      }
    }
    
    .card-right {
      .status-badge {
        background-color: rgba(255, 255, 255, 0.2);
        padding: 8rpx 24rpx;
        border-radius: 30rpx;
        font-size: 26rpx;
        font-weight: 500;
      }
    }
  }
  
  /* 标签页容器 */
  .tabs-container {
    margin: 20rpx 30rpx;
    background-color: #fff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    overflow: hidden;
    
    .tabs-header {
      display: flex;
      height: 90rpx;
      border-bottom: 1rpx solid #f0f0f0;
      
      .tab-item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28rpx;
        color: #666;
        position: relative;
        
        &.active {
          color: #2979ff;
          font-weight: 500;
        }
        
        .tab-indicator {
          position: absolute;
          bottom: 0;
          width: 40rpx;
          height: 4rpx;
          border-radius: 2rpx;
          background-color: #2979ff;
        }
      }
    }
    
    .tabs-content {
      padding: 30rpx;
    }
  }
  
  /* 标题样式 */
  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .title-line {
      width: 6rpx;
      height: 28rpx;
      background-color: #2979ff;
      border-radius: 3rpx;
      margin-right: 14rpx;
    }
    
    text {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
    }
  }
  
  /* 信息卡片 */
  .info-card {
    background-color: #f9fafc;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 30rpx;
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      grid-gap: 20rpx;
      
      @media screen and (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    .info-item {
      .info-label {
        font-size: 26rpx;
        color: #999;
        margin-bottom: 8rpx;
        display: block;
      }
      
      .info-value {
        font-size: 28rpx;
        color: #333;
        display: block;
        
        &.highlight {
          color: #2979ff;
          font-weight: 500;
        }
        
        &.warning {
          color: #ff9500;
        }
      }
    }
    
    .expand-action {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20rpx;
      padding-top: 16rpx;
      border-top: 1rpx solid #f0f0f0;
      
      text {
        font-size: 26rpx;
        color: #666;
        margin-right: 8rpx;
      }
    }
    
    /* 说明内容 */
    .desc-content {
      .desc-text {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
      }
    }
    
    /* 附件列表 */
    .attachments {
      margin-top: 20rpx;
      padding-top: 20rpx;
      border-top: 1rpx solid #f0f0f0;
      
      .attachment-header {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;
        
        text {
          font-size: 26rpx;
          color: #666;
          margin-left: 10rpx;
        }
      }
      
      .attachment-list {
        .attachment-item {
          display: flex;
          align-items: center;
          padding: 12rpx 16rpx;
          background-color: #eef2f8;
          border-radius: 8rpx;
          margin-bottom: 12rpx;
          
          &:active {
            background-color: #e5ebf5;
          }
          
          .file-name {
            flex: 1;
            font-size: 26rpx;
            color: #333;
            margin-left: 10rpx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .file-size {
            font-size: 24rpx;
            color: #999;
            margin-left: 10rpx;
          }
        }
      }
    }
  }
  
  /* 维修记录列表 */
  .empty-records {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 0;
    
    .empty-image {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 20rpx;
    }
    
    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .records-list {
    .record-item {
      background-color: #fff;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
      overflow: hidden;
      
      .record-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        border-bottom: 1rpx solid #f0f0f0;
        
        .record-title {
          font-size: 30rpx;
          font-weight: 500;
          color: #333;
        }
        
        .record-status {
          font-size: 24rpx;
          padding: 4rpx 16rpx;
          border-radius: 20rpx;
          
          &.status-completed {
            background-color: rgba(76, 217, 100, 0.1);
            color: #4cd964;
          }
          
          &.status-inprogress {
            background-color: rgba(255, 149, 0, 0.1);
            color: #ff9500;
          }
          
          &.status-pending {
            background-color: rgba(90, 200, 250, 0.1);
            color: #5ac8fa;
          }
        }
      }
      
      .record-content {
        padding: 20rpx;
        
        .record-info {
          display: flex;
          margin-bottom: 12rpx;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .info-label {
            width: 140rpx;
            font-size: 26rpx;
            color: #999;
          }
          
          .info-text {
            flex: 1;
            font-size: 26rpx;
            color: #333;
          }
        }
      }
      
      .record-footer {
        padding: 16rpx 20rpx;
        border-top: 1rpx solid #f0f0f0;
        display: flex;
        justify-content: flex-end;
        
        .view-detail {
          font-size: 26rpx;
          color: #2979ff;
          
          &:active {
            opacity: 0.7;
          }
        }
      }
    }
  }
  
  /* 底部操作按钮 */
  .action-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    padding: 20rpx 30rpx;
    background-color: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 10;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    
    .action-btn {
      flex: 1;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      border-radius: 44rpx;
      font-size: 30rpx;
      margin: 0 15rpx;
      
      &::after {
        border: none;
      }
    }
    
    .reset-btn {
      color: #666;
      background-color: #f5f7fa;
      
      &:active {
        background-color: #eaedf2;
      }
    }
    
    .edit-btn {
      color: #fff;
      background-color: #2979ff;
      box-shadow: 0 4rpx 8rpx rgba(41, 121, 255, 0.2);
      
      &:active {
        background-color: #206eeb;
      }
    }
  }
  </style>