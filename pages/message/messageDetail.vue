<template>
    <view class="message-detail">
      <!-- 顶部导航栏 -->
      <view class="nav-bar">
        <view class="back-btn" @click="goBack">
          <uni-icons type="left" size="20" color="#333"></uni-icons>
        </view>
        <text class="title">消息详情</text>
        <view class="right-action">
          <uni-icons v-if="canDelete" type="trash" size="20" color="#666" @click="showDeleteConfirm"></uni-icons>
        </view>
      </view>
      
      <!-- 消息详情卡片 -->
      <view class="message-card" :class="{'approval-message': messageType === 0}">
        <!-- 消息头部 -->
        <view class="message-header">
          <view class="avatar-container">
            <image :src="message.avatar || '/static/default-avatar.png'" mode="aspectFill" class="avatar"></image>
            <view class="status-badge" :class="statusClass" v-if="message.status">{{ message.statusText }}</view>
          </view>
          <view class="header-content">
            <text class="msg-title">{{ message.title }}</text>
            <text class="msg-subtitle">{{ message.sender }} · {{ formatTime(message.time) }}</text>
          </view>
        </view>
        
        <!-- 标签区域 -->
        <view class="tag-area" v-if="message.tags && message.tags.length">
          <text 
            v-for="(tag, index) in message.tags" 
            :key="index" 
            class="tag"
            :style="{ backgroundColor: getTagColor(message.type, index) }">
            {{ tag }}
          </text>
        </view>
        
        <!-- 审批消息时显示流程图 -->
        <view class="approval-flow" v-if="messageType === 0">
          <view class="flow-line"></view>
          <view class="flow-steps">
            <view class="flow-step" :class="{ active: true, passed: true }">
              <view class="step-dot"></view>
              <view class="step-content">
                <text class="step-title">提交申请</text>
                <text class="step-desc">{{ message.submitter || '申请人' }} · {{ formatTime(message.submitTime || message.time) }}</text>
              </view>
            </view>
            <view class="flow-step" :class="{ active: true }">
              <view class="step-dot"></view>
              <view class="step-content">
                <text class="step-title">待您审批</text>
                <text class="step-desc">当前步骤</text>
              </view>
            </view>
            <view class="flow-step" :class="{ active: false }">
              <view class="step-dot"></view>
              <view class="step-content">
                <text class="step-title">审批完成</text>
                <text class="step-desc">等待您处理</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 消息内容区域 -->
        <view class="content-area">
          <!-- 标题栏 -->
          <view class="section-title">
            <view class="title-line"></view>
            <text>详细内容</text>
          </view>
          
          <!-- 审批类型特定内容 -->
          <view class="approval-info" v-if="messageType === 0">
            <view class="info-item">
              <text class="info-label">申请类型</text>
              <text class="info-value">{{ message.approvalType || message.title }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">申请人</text>
              <text class="info-value">{{ message.submitter || '未知' }}</text>
            </view>
            <view class="info-item" v-if="message.department">
              <text class="info-label">所属部门</text>
              <text class="info-value">{{ message.department }}</text>
            </view>
            <view class="info-item" v-if="message.amount">
              <text class="info-label">申请金额</text>
              <text class="info-value info-highlight">¥ {{ message.amount }}</text>
            </view>
            <view class="info-item" v-if="message.dateRange">
              <text class="info-label">时间范围</text>
              <text class="info-value">{{ message.dateRange }}</text>
            </view>
            <view class="info-item" v-if="message.days">
              <text class="info-label">申请天数</text>
              <text class="info-value">{{ message.days }} 天</text>
            </view>
          </view>
          
          <!-- 通用消息内容 -->
          <view class="message-content">
            <text class="content-title">{{ getMessage('title') }}</text>
            <rich-text class="content-text" :nodes="getMessage('content')"></rich-text>
            
            <!-- 附件区域 -->
            <view class="attachments" v-if="message.attachments && message.attachments.length">
              <view class="attachment-title">
                <uni-icons type="paperclip" size="16" color="#666"></uni-icons>
                <text>附件 ({{ message.attachments.length }})</text>
              </view>
              <view class="attachment-list">
                <view 
                  class="attachment-item" 
                  v-for="(item, index) in message.attachments" 
                  :key="index"
                  @click="previewAttachment(item)">
                  <view class="attachment-icon">
                    <uni-icons :type="getFileIcon(item.type)" size="22" color="#1890ff"></uni-icons>
                  </view>
                  <view class="attachment-info">
                    <text class="attachment-name">{{ item.name }}</text>
                    <text class="attachment-size">{{ formatFileSize(item.size) }}</text>
                  </view>
                  <view class="download-icon">
                    <uni-icons type="download" size="18" color="#999"></uni-icons>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 审批意见输入区域 - 美化版 -->
      <view class="approval-comment-container" v-if="messageType === 0 && !message.approved">
        <view class="comment-header">
          <view class="header-left">
            <uni-icons type="chatbubble" size="18" color="#2979ff"></uni-icons>
            <text class="comment-title">审批意见</text>
          </view>
          <text class="comment-count" :class="{ 'count-warning': approvalComment.length > 180 }">
            {{ approvalComment.length }}/200
          </text>
        </view>
        
        <view class="comment-input-wrapper" :class="{ 'focused': isCommentFocused }">
          <textarea 
            class="comment-input" 
            v-model="approvalComment"
            placeholder="请输入您的审批意见（选填）" 
            maxlength="200" 
            :auto-height="true"
            @focus="isCommentFocused = true"
            @blur="isCommentFocused = false">
          </textarea>
          
          <!-- 快速输入按钮 -->
          <view class="quick-inputs">
            <text 
              v-for="(item, index) in quickComments" 
              :key="index"
              class="quick-input-item"
              @click="insertQuickComment(item)">
              {{ item }}
            </text>
          </view>
        </view>
      </view>
      
      <!-- 已审批状态展示 -->
      <view class="approved-status" v-if="messageType === 0 && message.approved">
        <view class="status-icon" :class="message.approved === 'approved' ? 'success-icon' : 'reject-icon'">
          <uni-icons :type="message.approved === 'approved' ? 'checkmarkempty' : 'closeempty'" size="28" color="#fff"></uni-icons>
        </view>
        <text class="status-text">{{ message.approved === 'approved' ? '已同意' : '已驳回' }}</text>
        <text class="status-time">{{ formatTime(message.approvedTime || Date.now()) }}</text>
        <view class="status-comment" v-if="message.approvalComment">
          <text class="comment-label">审批意见：</text>
          <text class="comment-content">{{ message.approvalComment }}</text>
        </view>
      </view>
      
      <!-- 底部操作按钮区域 -->
      <view class="action-footer" v-if="messageType === 0 && !message.approved">
        <button class="action-btn reject-btn" @click="handleReject">驳回</button>
        <button class="action-btn approve-btn" @click="handleApprove">同意</button>
      </view>
      
      <!-- 删除确认对话框 -->
      <uni-popup ref="deletePopup" type="dialog">
        <uni-popup-dialog 
          title="删除消息" 
          content="确认要删除这条消息吗？删除后无法恢复。" 
          :confirmText="'删除'" 
          confirmColor="#ff4d4f"
          :cancelText="'取消'"
          @confirm="deleteMessage"
          @close="closeDialog">
        </uni-popup-dialog>
      </uni-popup>
    </view>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  
  // 获取路由参数
  const props = defineProps({
    id: String,
    type: {
      type: [String, Number],
      default: '0'
    }
  });
  
  // 消息类型（数字类型）
  const messageType = computed(() => {
    return parseInt(props.type || '0');
  });
  
  // 是否可删除
  const canDelete = ref(true);
  
  // 审批意见
  const approvalComment = ref('');
  const isCommentFocused = ref(false);
  
  // 快速输入选项
  const quickComments = [
    '同意申请',
    '符合规定',
    '情况属实',
    '按规定办理',
    '请按要求执行'
  ];
  
  // 删除确认弹窗
  const deletePopup = ref(null);
  
  // 模拟消息数据（实际应用中应该通过API获取）
  const message = ref({
    id: props.id || 'msg_001',
    title: '加班申请',
    sender: '系统消息',
    submitter: '张三',
    department: '研发部',
    avatar: '/static/icons/approve-avatar.png',
    time: Date.now() - 86400000, // 昨天
    submitTime: Date.now() - 86400000 * 1.5,
    content: '张三申请在2023年3月15日至16日加班，请您审批。\n\n加班原因：项目紧急，需要完成新功能开发。',
    approvalType: '加班申请',
    dateRange: '2023-03-15 至 2023-03-16',
    days: 2,
    status: 'pending',
    statusText: '待审批',
    type: parseInt(props.type || '0'),
    tags: ['待审批', '加班'],
    attachments: [
      { name: '加班申请表.docx', type: 'docx', size: 1024 * 25 },
      { name: '项目进度计划.xlsx', type: 'xlsx', size: 1024 * 18 }
    ]
  });
  
  // 状态样式类
  const statusClass = computed(() => {
    const status = message.value.status;
    if (status === 'pending') return 'status-pending';
    if (status === 'approved') return 'status-success';
    if (status === 'rejected') return 'status-error';
    return '';
  });
  
  // 格式化时间
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // 时间部分格式化
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    // 日期格式化
    if (date >= today) {
      return `今天 ${timeStr}`;
    } else if (date >= yesterday) {
      return `昨天 ${timeStr}`;
    } else {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${timeStr}`;
    }
  };
  
  // 获取消息内容
  const getMessage = (field) => {
    if (field === 'title') {
      return messageType.value === 0 ? '申请原因' : '消息内容';
    }
    
    // 根据消息类型格式化内容
    if (field === 'content') {
      const content = message.value.content || '';
      // 简单的富文本处理
      return content.replace(/\n/g, '<br>');
    }
    
    return '';
  };
  
  // 获取标签颜色
  const getTagColor = (type, index) => {
    const colors = [
      ['#ff9500', '#2979ff', '#4cd964'], // 审批消息
      ['#1890ff', '#52c41a', '#722ed1'], // @我消息
      ['#13c2c2', '#fa8c16', '#eb2f96']  // 系统通知
    ];
    
    const typeIndex = type || messageType.value;
    const colorIndex = index % 3;
    
    return colors[typeIndex][colorIndex] + '20'; // 添加20%透明度
  };
  
  // 获取文件图标
  const getFileIcon = (fileType) => {
    const fileIcons = {
      'pdf': 'pdf',
      'doc': 'file',
      'docx': 'file',
      'xls': 'file',
      'xlsx': 'file',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'zip': 'download',
      'rar': 'download'
    };
    
    return fileIcons[fileType] || 'file';
  };
  
  // 格式化文件大小
  const formatFileSize = (size) => {
    if (size < 1024) {
      return size + 'B';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + 'KB';
    } else {
      return (size / (1024 * 1024)).toFixed(2) + 'MB';
    }
  };
  
  // 快速输入审批意见
  const insertQuickComment = (comment) => {
    approvalComment.value = comment;
    
    // 轻微震动反馈
    uni.vibrateShort();
  };
  
  // 预览附件
  const previewAttachment = (file) => {
    uni.showToast({
      title: `预览文件：${file.name}`,
      icon: 'none'
    });
  };
  
  // 返回上一页
  const goBack = () => {
    uni.navigateBack();
  };
  
  // 显示删除确认框
  const showDeleteConfirm = () => {
    deletePopup.value.open();
  };
  
  // 关闭对话框
  const closeDialog = () => {
    deletePopup.value.close();
  };
  
  // 删除消息
  const deleteMessage = () => {
    uni.showLoading({
      title: '删除中...'
    });
    
    // 模拟删除操作
    setTimeout(() => {
      uni.hideLoading();
      uni.showToast({
        title: '删除成功',
        icon: 'success'
      });
      
      // 返回上一页
      setTimeout(() => {
        uni.navigateBack();
      }, 1000);
    }, 800);
  };
  
  // 处理审批同意
  const handleApprove = () => {
    uni.showModal({
      title: '审批确认',
      content: '确定同意此申请吗？',
      success: (res) => {
        if (res.confirm) {
          approveMessage('approved');
        }
      }
    });
  };
  
  // 处理审批驳回
  const handleReject = () => {
    uni.showModal({
      title: '驳回确认',
      content: '确定驳回此申请吗？',
      success: (res) => {
        if (res.confirm) {
          approveMessage('rejected');
        }
      }
    });
  };
  
  // 审批消息
  const approveMessage = (action) => {
    uni.showLoading({
      title: action === 'approved' ? '同意中...' : '驳回中...'
    });
    
    // 模拟审批操作
    setTimeout(() => {
      uni.hideLoading();
      
      // 更新消息状态
      message.value.approved = action;
      message.value.approvedTime = Date.now();
      message.value.status = action === 'approved' ? 'approved' : 'rejected';
      message.value.statusText = action === 'approved' ? '已同意' : '已驳回';
      message.value.approvalComment = approvalComment.value;
      
      uni.showToast({
        title: action === 'approved' ? '已同意' : '已驳回',
        icon: 'success'
      });
      
      // 通知列表页更新
      // 实际应用中应该使用事件总线或状态管理
      uni.$emit('messageUpdated', {
        id: message.value.id,
        action: action,
        comment: approvalComment.value
      });
      
    }, 1000);
  };
  
  // 组件挂载
  onMounted(() => {
    // 实际应用中应该从API获取消息详情
    console.log('消息ID:', props.id, '类型:', messageType.value);
    
    // 如果是@我消息，修改部分数据
    if (messageType.value === 1) {
      message.value = {
        ...message.value,
        title: '项目讨论',
        sender: '项目组',
        avatar: '/static/icons/at-avatar.png',
        content: '@您 请查看项目最新进展并提供反馈。\n\n我们已经完成了初步设计，需要您审阅并给出意见。',
        tags: ['项目', '讨论'],
        status: null,
        attachments: [
          { name: '产品原型设计.pdf', type: 'pdf', size: 1024 * 1024 * 2.5 },
          { name: '需求文档.docx', type: 'docx', size: 1024 * 56 }
        ]
      };
    }
    
    // 如果是系统通知，修改部分数据
    if (messageType.value === 2) {
      message.value = {
        ...message.value,
        title: '系统升级通知',
        sender: '系统管理员',
        avatar: '/static/icons/system-avatar.png',
        content: '尊敬的用户：\n\n系统将于今晚22:00-23:00进行升级维护，期间系统将不可用，请提前做好工作安排。\n\n感谢您的理解与支持。',
        tags: ['系统', '维护'],
        status: null,
        attachments: []
      };
    }
  });
  </script>
  
  <style lang="scss" scoped>
  .message-detail {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f7f8fa;
    padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
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
    position: sticky;
    top: 0;
    z-index: 100;
    
    .back-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .title {
      font-size: 34rpx;
      font-weight: 600;
      color: #333;
    }
    
    .right-action {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:active {
        opacity: 0.7;
      }
    }
  }
  
  /* 消息卡片 */
  .message-card {
    margin: 30rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
    overflow: hidden;
    
    &.approval-message {
      border-top: 8rpx solid #2979ff;
    }
  }
  
  /* 消息头部 */
  .message-header {
    display: flex;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .avatar-container {
      position: relative;
      margin-right: 20rpx;
      
      .avatar {
        width: 96rpx;
        height: 96rpx;
        border-radius: 48rpx;
        border: 1rpx solid #f0f0f0;
      }
      
      .status-badge {
        position: absolute;
        right: -10rpx;
        top: -10rpx;
        min-width: 40rpx;
        height: 40rpx;
        padding: 0 10rpx;
        border-radius: 20rpx;
        background-color: #ff9500;
        color: #fff;
        font-size: 22rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        
        &.status-pending {
          background-color: #ff9500;
        }
        
        &.status-success {
          background-color: #4cd964;
        }
        
        &.status-error {
          background-color: #ff3b30;
        }
      }
    }
    
    .header-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      
      .msg-title {
        font-size: 34rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 12rpx;
      }
      
      .msg-subtitle {
        font-size: 26rpx;
        color: #999;
      }
    }
  }
  
  /* 标签区域 */
  .tag-area {
    display: flex;
    flex-wrap: wrap;
    padding: 0 30rpx 20rpx;
    
    .tag {
      display: inline-block;
      padding: 6rpx 20rpx;
      font-size: 24rpx;
      border-radius: 6rpx;
      margin-right: 16rpx;
      margin-bottom: 10rpx;
    }
  }
  
  /* 审批流程 */
  .approval-flow {
    padding: 30rpx;
    position: relative;
    
    .flow-line {
      position: absolute;
      left: 70rpx;
      top: 60rpx;
      bottom: 60rpx;
      width: 2rpx;
      background-color: #e0e0e0;
      z-index: 1;
    }
    
    .flow-steps {
      position: relative;
      z-index: 2;
      
      .flow-step {
        display: flex;
        margin-bottom: 50rpx;
        align-items: flex-start;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .step-dot {
          width: 24rpx;
          height: 24rpx;
          border-radius: 12rpx;
          background-color: #e0e0e0;
          margin: 6rpx 30rpx 0 10rpx;
        }
        
        .step-content {
          flex: 1;
          
          .step-title {
            font-size: 28rpx;
            font-weight: 500;
            color: #333;
            margin-bottom: 8rpx;
          }
          
          .step-desc {
            font-size: 24rpx;
            color: #999;
          }
        }
        
        &.active {
          .step-dot {
            background-color: #2979ff;
            box-shadow: 0 0 0 6rpx rgba(41, 121, 255, 0.2);
          }
          
          .step-title {
            color: #2979ff;
          }
        }
        
        &.passed {
          .step-dot {
            background-color: #4cd964;
            box-shadow: 0 0 0 6rpx rgba(76, 217, 100, 0.2);
          }
        }
      }
    }
  }
  
  /* 内容区域 */
  .content-area {
    padding: 20rpx 30rpx 30rpx;
    
    .section-title {
      display: flex;
      align-items: center;
      margin: 20rpx 0 30rpx;
      
      .title-line {
        width: 8rpx;
        height: 32rpx;
        background-color: #2979ff;
        border-radius: 4rpx;
        margin-right: 16rpx;
      }
      
      text {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
      }
    }
  }
  
  /* 审批信息 */
  .approval-info {
    background-color: #f8f9fc;
    padding: 20rpx 30rpx;
    border-radius: 12rpx;
    margin-bottom: 30rpx;
    
    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .info-label {
        font-size: 28rpx;
        color: #666;
        min-width: 140rpx;
      }
      
      .info-value {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        text-align: right;
        
        &.info-highlight {
          color: #ff9500;
          font-weight: 500;
        }
      }
    }
  }
  
  /* 消息内容 */
  .message-content {
    padding: 10rpx 0 20rpx;
    
    .content-title {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 16rpx;
    }
    
    .content-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
    
    /* 附件区域 */
    .attachments {
      margin-top: 40rpx;
      
      .attachment-title {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        
        text {
          margin-left: 10rpx;
          font-size: 28rpx;
          color: #666;
        }
      }
      
      .attachment-list {
        padding: 10rpx 0;
        
        .attachment-item {
          display: flex;
          align-items: center;
          background-color: #f5f7fa;
          border-radius: 12rpx;
          padding: 20rpx;
          margin-bottom: 16rpx;
          transition: all 0.2s;
          
          &:active {
            background-color: #e8f0fe;
            transform: translateY(2rpx);
          }
          
          .attachment-icon {
            margin-right: 16rpx;
          }
          
          .attachment-info {
            flex: 1;
            
            .attachment-name {
              font-size: 28rpx;
              color: #333;
              margin-bottom: 6rpx;
            }
            
            .attachment-size {
              font-size: 24rpx;
              color: #999;
            }
          }
          
          .download-icon {
            width: 50rpx;
            height: 50rpx;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
  
  /* 审批意见输入容器 - 美化版 */
  .approval-comment-container {
    margin: 0 30rpx 30rpx;
    
    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .header-left {
        display: flex;
        align-items: center;
        
        .comment-title {
          font-size: 30rpx;
          font-weight: 500;
          color: #333;
          margin-left: 10rpx;
        }
      }
      
      .comment-count {
        font-size: 24rpx;
        color: #999;
        transition: color 0.3s;
        
        &.count-warning {
          color: #ff9500;
        }
      }
    }
    
    .comment-input-wrapper {
      position: relative;
      background-color: #f8f9fc;
      border-radius: 16rpx;
      padding: 20rpx;
      transition: all 0.3s;
      border: 1rpx solid transparent;
      background-color: #fff;
      &.focused {
        
        border-color: #2979ff;
        box-shadow: 0 0 0 3rpx rgba(41, 121, 255, 0.1);
      }
      
      .comment-input {
        width: 100%;
        min-height: 160rpx;
        font-size: 28rpx;
        color: #333;
        line-height: 1.6;
        padding-bottom: 10rpx;
        caret-color: #2979ff;
      }
      
      /* 快速输入按钮 */
      .quick-inputs {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20rpx;
        
        .quick-input-item {
          display: inline-block;
          padding: 8rpx 20rpx;
          background-color: #eef5ff;
          color: #2979ff;
          font-size: 24rpx;
          border-radius: 30rpx;
          margin-right: 16rpx;
          margin-bottom: 10rpx;
          transition: all 0.2s;
          
          &:active {
            transform: scale(0.95);
            background-color: #d4e6ff;
          }
        }
      }
    }
  }
  
  /* 底部操作按钮 */
  .action-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    background-color: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 99;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    
    .action-btn {
      flex: 1;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      border-radius: 44rpx;
      font-size: 32rpx;
      margin: 0 15rpx;
      font-weight: 500;
      transition: all 0.2s;
      
      &::after {
        border: none;
      }
      
      &.reject-btn {
        color: #ff3b30;
        background-color: #fff;
        border: 1rpx solid #ff3b30;
        
        &:active {
          transform: translateY(2rpx);
          background-color: rgba(255, 59, 48, 0.05);
        }
      }
      
      &.approve-btn {
        color: #fff;
        background-color: #2979ff;
        box-shadow: 0 4rpx 8rpx rgba(41, 121, 255, 0.2);
        
        &:active {
          transform: translateY(2rpx);
          background-color: #206eeb;
          box-shadow: 0 2rpx 4rpx rgba(41, 121, 255, 0.2);
        }
      }
    }
  }
  
  /* 已审批状态 */
  .approved-status {
    margin: 0 30rpx 40rpx;
    padding: 30rpx;
    background-color: #f8f9fc;
    border-radius: 16rpx;
    text-align: center;
    
    .status-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 40rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto 16rpx;
      
      &.success-icon {
        background-color: #4cd964;
      }
      
      &.reject-icon {
        background-color: #ff3b30;
      }
    }
    
    .status-text {
      font-size: 34rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .status-time {
      font-size: 26rpx;
      color: #999;
      margin-bottom: 20rpx;
    }
    
    .status-comment {
      text-align: left;
      background-color: #fff;
      padding: 20rpx;
      border-radius: 12rpx;
      
      .comment-label {
        font-size: 28rpx;
        color: #666;
        font-weight: 500;
      }
      
      .comment-content {
        font-size: 28rpx;
        color: #333;
        line-height: 1.6;
      }
    }
  }
  </style>