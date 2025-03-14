<template>
    <view class="profile-page">
      <!-- 顶部状态栏占位（仅在自定义导航栏时需要） -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      
      <!-- 页面标题栏 -->
      <view class="nav-bar">
        <text class="page-title">个人中心</text>
        <view class="right-action">
          <text v-if="!isEditing" class="edit-text" @click="startEdit">编辑</text>
          <text v-else class="edit-text" @click="cancelEdit">取消</text>
        </view>
      </view>
      
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="card-background">
          <view class="bg-pattern"></view>
        </view>
        
        <view class="avatar-section">
          <view class="avatar-container" @click="changeAvatar">
            <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
            <view class="avatar-edit" v-if="isEditing">
              <uni-icons type="camera" size="20" color="#fff"></uni-icons>
            </view>
          </view>
          
          <!-- 用户名称 -->
          <view class="user-name-section" v-if="!isEditing">
            <text class="user-name">{{ userInfo.name }}</text>
            <view class="role-tag">{{ userInfo.role }}</view>
          </view>
          
          <!-- 编辑用户名 -->
          <view class="user-name-edit" v-else>
            <input 
              class="name-input" 
              v-model="editingInfo.name" 
              placeholder="请输入姓名" 
              maxlength="20"
            />
          </view>
        </view>
        
        <!-- 数据统计区 -->
        <view class="user-stats">
          <view class="stat-item">
            <text class="stat-value">{{ userInfo.taskCount }}</text>
            <text class="stat-label">我的任务</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ userInfo.approvalCount }}</text>
            <text class="stat-label">我的审批</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ userInfo.documentCount }}</text>
            <text class="stat-label">我的文档</text>
          </view>
        </view>
      </view>
      
      <!-- 个人信息区域 -->
      <view class="info-section">
        <text class="section-title">基本资料</text>
        
        <!-- 非编辑状态 -->
        <view class="info-card" v-if="!isEditing">
          <view class="info-item" v-for="(item, index) in userInfoFields" :key="index">
            <text class="info-label">{{ item.label }}</text>
            <view class="info-value-container">
              <text class="info-value">{{ userInfo[item.field] || '未设置' }}</text>
              <uni-icons type="right" size="16" color="#ccc"></uni-icons>
            </view>
          </view>
        </view>
        
        <!-- 编辑状态 -->
        <view class="info-card editing" v-else>
          <view class="info-item" v-for="(item, index) in userInfoFields" :key="index">
            <text class="info-label">{{ item.label }}</text>
            <view class="info-value-container">
              <input 
                v-if="item.type === 'input'" 
                class="info-input" 
                v-model="editingInfo[item.field]" 
                :placeholder="'请输入' + item.label"
                :maxlength="item.maxLength || 50"
              />
              <picker 
                v-else-if="item.type === 'picker'" 
                :range="item.options" 
                @change="(e) => handlePickerChange(e, item.field)">
                <view class="picker-value">
                  <text>{{ editingInfo[item.field] || '请选择' + item.label }}</text>
                  <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
                </view>
              </picker>
              <view 
                v-else-if="item.type === 'date'" 
                class="date-picker"
                @click="openDatePicker(item.field)">
                <text>{{ editingInfo[item.field] || '请选择' + item.label }}</text>
                <uni-icons type="calendar" size="16" color="#666"></uni-icons>
              </view>
            </view>
          </view>
          
          <!-- 保存按钮 -->
          <button class="save-btn" @click="saveEdit">保存修改</button>
        </view>
      </view>
      
      <!-- 其他操作区域 -->
      <view class="actions-section">
        <text class="section-title">账号与安全</text>
        
        <view class="action-card">
          <view class="action-item" @click="goToPage('resetPassword')">
            <view class="action-icon password-icon">
              <uni-icons type="locked" size="20" color="#fff"></uni-icons>
            </view>
            <view class="action-content">
              <text class="action-title">修改密码</text>
              <text class="action-desc">定期修改密码可以保障账号安全</text>
            </view>
            <uni-icons type="right" size="16" color="#ccc"></uni-icons>
          </view>
          
          <view class="action-item" @click="goToPage('bindPhone')">
            <view class="action-icon phone-icon">
              <uni-icons type="phone" size="20" color="#fff"></uni-icons>
            </view>
            <view class="action-content">
              <text class="action-title">手机绑定</text>
              <text class="action-desc">已绑定：{{ formatPhone(userInfo.phone) }}</text>
            </view>
            <uni-icons type="right" size="16" color="#ccc"></uni-icons>
          </view>
          
          <view class="action-item" @click="goToPage('privacySettings')">
            <view class="action-icon privacy-icon">
              <uni-icons type="eye" size="20" color="#fff"></uni-icons>
            </view>
            <view class="action-content">
              <text class="action-title">隐私设置</text>
              <text class="action-desc">管理您的隐私和数据使用权限</text>
            </view>
            <uni-icons type="right" size="16" color="#ccc"></uni-icons>
          </view>
        </view>
      </view>
      
      <!-- 退出登录按钮 -->
      <view class="logout-section">
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </view>
      
      <!-- 系统信息 -->
      <view class="system-info">
        <text class="version-info">当前版本 v{{ appVersion }}</text>

      </view>
      
      <!-- 日期选择器弹窗 -->
      <uni-calendar 
        ref="calendar"
        :insert="false"
        @confirm="confirmDate">
      </uni-calendar>
      
      <!-- 退出确认弹窗 -->
      <uni-popup ref="logoutPopup" type="dialog">
        <uni-popup-dialog
          title="退出登录"
          content="确定要退出当前账号吗？"
          :confirmText="'退出'"
          confirmColor="#ff4d4f"
          :cancelText="'取消'"
          @confirm="confirmLogout"
          @close="closeDialog">
        </uni-popup-dialog>
      </uni-popup>

      	<!-- 底部导航栏 - 根据不同模块显示不同导航栏 -->
  <tab-bar :module-id="moduleStore.currentModuleId" active-tab="工作台" @tab-change="handleTabChange"></tab-bar>
    </view>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useModuleStore } from '@/stores/moduleStore';
import TabBar from '@/components/NavTab/NavTab.vue';
// 获取 Pinia store
const moduleStore = useModuleStore();
// 处理标签切换
const handleTabChange = (tabInfo) => {
	console.log('标签切换:', tabInfo);
};
  // 状态栏高度
  const statusBarHeight = ref(20);
  
  // 当前编辑中的日期字段
  const currentDateField = ref('');
  
  // 应用版本
  const appVersion = ref('1.0.0');
  
  // 弹窗引用
  const calendar = ref(null);
  const logoutPopup = ref(null);
  
  // 是否处于编辑模式
  const isEditing = ref(false);
  
  // 模拟用户数据
  const userInfo = reactive({
    name: '张三',
    avatar: '/static/avatar.png',
    role: '设备管理员',
    department: '设备管理',
    position: '高级工程师',
    email: 'zhangsan@example.com',
    phone: '13812345678',
    employeeId: 'EMP10086',
    hireDate: '2020-01-15',
    gender: '男',
    taskCount: 8,
    approvalCount: 12,
    documentCount: 5
  });
  
  // 编辑中的信息
  const editingInfo = reactive({...userInfo});
  
  // 用户信息字段定义
  const userInfoFields = [
    { label: '部门', field: 'department', type: 'picker', options: ['研发部', '市场部', '人事部', '财务部', '运营部'] },
    { label: '职位', field: 'position', type: 'input', maxLength: 20 },
    { label: '邮箱', field: 'email', type: 'input', maxLength: 50 },
    { label: '手机号', field: 'phone', type: 'input', maxLength: 11 },
    { label: '工号', field: 'employeeId', type: 'input', maxLength: 20 },
    { label: '入职日期', field: 'hireDate', type: 'date' },
    { label: '性别', field: 'gender', type: 'picker', options: ['男', '女'] }
  ];
  
  // 获取系统信息
  onMounted(() => {
    try {
      const systemInfo = uni.getSystemInfoSync();
      statusBarHeight.value = systemInfo.statusBarHeight;
    } catch (e) {
      console.error('获取系统信息失败', e);
    }
  });
  
  // 开始编辑
  const startEdit = () => {
    // 复制一份数据用于编辑
    Object.assign(editingInfo, userInfo);
    isEditing.value = true;
  };
  
  // 取消编辑
  const cancelEdit = () => {
    isEditing.value = false;
    uni.showToast({
      title: '已取消编辑',
      icon: 'none'
    });
  };
  
  // 保存编辑
  const saveEdit = () => {
    // 进行表单验证
    if (!editingInfo.name || editingInfo.name.trim() === '') {
      uni.showToast({
        title: '姓名不能为空',
        icon: 'none'
      });
      return;
    }
    
    if (editingInfo.email && !validateEmail(editingInfo.email)) {
      uni.showToast({
        title: '邮箱格式不正确',
        icon: 'none'
      });
      return;
    }
    
    if (editingInfo.phone && !validatePhone(editingInfo.phone)) {
      uni.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      });
      return;
    }
    
    // 显示保存中
    uni.showLoading({
      title: '保存中...'
    });
    
    // 模拟网络请求
    setTimeout(() => {
      // 将编辑的数据保存回用户信息
      Object.assign(userInfo, editingInfo);
      
      // 关闭加载提示
      uni.hideLoading();
      
      // 显示成功提示
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      });
      
      // 退出编辑模式
      isEditing.value = false;
    }, 1000);
  };
  
  // 选择器值变化
  const handlePickerChange = (e, field) => {
    const index = e.detail.value;
    const item = userInfoFields.find(item => item.field === field);
    editingInfo[field] = item.options[index];
  };
  
  // 打开日期选择器
  const openDatePicker = (field) => {
    currentDateField.value = field;
    calendar.value.open();
  };
  
  // 确认日期选择
  const confirmDate = (e) => {
    if (currentDateField.value) {
      editingInfo[currentDateField.value] = e.fulldate;
      currentDateField.value = '';
    }
  };
  
  // 修改头像
  const changeAvatar = () => {
    if (!isEditing.value) {
      return;
    }
    
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        
        // 预览并裁剪（实际应用中可能需要调用裁剪API）
        uni.showLoading({
          title: '处理中...'
        });
        
        // 模拟上传过程
        setTimeout(() => {
          uni.hideLoading();
          // 更新头像预览
          editingInfo.avatar = tempFilePath;
        }, 1000);
      }
    });
  };
  
  // 退出登录
  const handleLogout = () => {
    logoutPopup.value.open();
  };
  
  // 确认退出
  const confirmLogout = () => {
    uni.showLoading({
      title: '退出中...'
    });
    
    // 模拟网络请求
    setTimeout(() => {
      uni.hideLoading();
      
      // 清除登录状态
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
      
      // 跳转到登录页
      uni.reLaunch({
        url: '/pages/login/index'
      });
    }, 1000);
  };
  
  // 关闭弹窗
  const closeDialog = () => {
    logoutPopup.value.close();
  };
  
  // 跳转到其他页面
  const goToPage = (page) => {
    const pages = {
      resetPassword: '/pages/profile/password',
      bindPhone: '/pages/profile/phone',
      privacySettings: '/pages/profile/privacy'
    };
    
    if (pages[page]) {
      uni.navigateTo({
        url: pages[page]
      });
    }
  };
  
  // 格式化手机号，中间4位显示为*
  const formatPhone = (phone) => {
    if (!phone) return '未绑定';
    if (phone.length !== 11) return phone;
    
    return phone.substring(0, 3) + '****' + phone.substring(7);
  };
  
  // 验证邮箱格式
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };
  
  // 验证手机号格式
  const validatePhone = (phone) => {
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(phone);
  };
  </script>
  
  <style lang="scss" scoped>
  .profile-page {
    min-height: 100vh;
    background-color: #f7f8fa;
    padding-bottom: 60rpx;
  }
  
  /* 状态栏 */
  .status-bar {
    width: 100%;
    background-color: #fff;
  }
  
  /* 导航栏 */
  .nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 88rpx;
    padding: 0 30rpx;
    background-color: #fff;
    position: relative;
    
    .page-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
    }
    
    .right-action {
      .edit-text {
        font-size: 30rpx;
        color: #2979ff;
        font-weight: 500;
        
        &:active {
          opacity: 0.7;
        }
      }
    }
  }
  
  /* 用户信息卡片 */
  .user-card {
    position: relative;
    margin: 30rpx;
    padding: 40rpx 30rpx 30rpx;
    background-color: #fff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
    overflow: hidden;
    
    .card-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 180rpx;
      overflow: hidden;
      
      .bg-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        background: linear-gradient(135deg, #2979ff, #36cfc9);
        opacity: 0.8;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -20rpx;
          left: 0;
          right: 0;
          height: 60rpx;
          background-color: #fff;
          border-radius: 50% 50% 0 0;
        }
      }
    }
    
    .avatar-section {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .avatar-container {
        position: relative;
        width: 160rpx;
        height: 160rpx;
        border-radius: 80rpx;
        border: 6rpx solid #fff;
        box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.1);
        margin-bottom: 20rpx;
        overflow: hidden;
        
        .avatar {
          width: 100%;
          height: 100%;
        }
        
        .avatar-edit {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50rpx;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      
      .user-name-section {
        text-align: center;
        
        .user-name {
          font-size: 36rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .role-tag {
          display: inline-block;
          padding: 4rpx 16rpx;
          font-size: 24rpx;
          color: #2979ff;
          background-color: rgba(41, 121, 255, 0.1);
          border-radius: 20rpx;
        }
      }
      
      .user-name-edit {
        width: 100%;
        margin-bottom: 20rpx;
        
        .name-input {
          width: 100%;
          height: 80rpx;
          background-color: #f5f7fa;
          border-radius: 10rpx;
          padding: 0 20rpx;
          font-size: 32rpx;
          color: #333;
          text-align: center;
        }
      }
    }
    
    .user-stats {
      display: flex;
      justify-content: space-between;
      padding: 30rpx 20rpx 10rpx;
      margin-top: 20rpx;
      border-top: 1rpx solid #f0f0f0;
      
      .stat-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .stat-value {
          font-size: 36rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .stat-label {
          font-size: 26rpx;
          color: #999;
        }
      }
    }
  }
  
  /* 信息区域 */
  .info-section, .actions-section {
    margin: 40rpx 30rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 20rpx;
      padding-left: 20rpx;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 6rpx;
        bottom: 6rpx;
        width: 6rpx;
        background-color: #2979ff;
        border-radius: 3rpx;
      }
    }
    
    .info-card {
      background-color: #fff;
      border-radius: 16rpx;
      padding: 20rpx 30rpx;
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
      
      &.editing {
        background-color: #f8fafe;
      }
      
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24rpx 0;
        border-bottom: 1rpx solid #f0f0f0;
        
        &:last-of-type {
          border-bottom: none;
        }
        
        .info-label {
          font-size: 28rpx;
          color: #666;
        }
        
        .info-value-container {
          display: flex;
          align-items: center;
          
          .info-value {
            font-size: 28rpx;
            color: #333;
            margin-right: 10rpx;
            text-align: right;
          }
          
          .info-input {
            width: 300rpx;
            height: 60rpx;
            background-color: #fff;
            border-radius: 8rpx;
            padding: 0 16rpx;
            font-size: 28rpx;
            color: #333;
            border: 1rpx solid #e0e0e0;
            text-align: right;
          }
          
          .picker-value, .date-picker {
            display: flex;
            align-items: center;
            width: 300rpx;
            height: 60rpx;
            background-color: #fff;
            border-radius: 8rpx;
            padding: 0 16rpx;
            font-size: 28rpx;
            color: #333;
            border: 1rpx solid #e0e0e0;
            justify-content: flex-end;
            
            text {
              margin-right: 10rpx;
            }
          }
        }
      }
      
      .save-btn {
        width: 100%;
        height: 88rpx;
        line-height: 88rpx;
        margin-top: 30rpx;
        border-radius: 44rpx;
        font-size: 30rpx;
        color: #fff;
        background-color: #2979ff;
        box-shadow: 0 4rpx 8rpx rgba(41, 121, 255, 0.2);
        
        &::after {
          border: none;
        }
        
        &:active {
          transform: translateY(2rpx);
          box-shadow: 0 2rpx 4rpx rgba(41, 121, 255, 0.2);
        }
      }
    }
  }
  
  /* 操作卡片 */
  .action-card {
    background-color: #fff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
    overflow: hidden;
    
    .action-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      &:active {
        background-color: #f9f9f9;
      }
      
      .action-icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 40rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20rpx;
        
        &.password-icon {
          background: linear-gradient(135deg, #ff9500, #ff5e3a);
        }
        
        &.phone-icon {
          background: linear-gradient(135deg, #54c7ec, #2979ff);
        }
        
        &.privacy-icon {
          background: linear-gradient(135deg, #5e5ce6, #9254de);
        }
      }
      
      .action-content {
        flex: 1;
        
        .action-title {
          font-size: 30rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 6rpx;
        }
        
        .action-desc {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
  
  /* 退出登录区域 */
  .logout-section {
    margin: 40rpx 30rpx;
    
    .logout-btn {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      border-radius: 44rpx;
      font-size: 32rpx;
      color: #ff4d4f;
      background-color: #fff;
      border: 1rpx solid #ff4d4f;
      
      &::after {
        border: none;
      }
      
      &:active {
        background-color: rgba(255, 77, 79, 0.05);
      }
    }
  }
  
  /* 系统信息 */
  .system-info {
    margin: 40rpx 0 60rpx;
    padding: 0 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .version-info {
      font-size: 24rpx;
      color: #999;
      margin-bottom: 8rpx;
    }
    
    .copyright {
      font-size: 22rpx;
      color: #bbb;
    }
  }
  </style>