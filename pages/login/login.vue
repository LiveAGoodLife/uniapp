<template>
	<view class="login-container">
		<!-- 顶部欢迎文字 -->
		<view class="welcome-section">
			<text class="greeting">您好！</text>
			<text class="welcome-text">欢迎来到IMES智能制造</text>
		</view>

		<!-- 登录表单 -->
		<view class="login-form">
			<!-- 手机号输入框 -->
			<view class="input-group">
				<input v-model="phone" placeholder="请输入手机号" clearable :maxlength="11" type="number"
					class="phone-input" />
			</view>

			<!-- 验证码输入框和按钮 -->
			<view class="input-group verification-group">
				<input v-model="verificationCode" placeholder="请输入验证码" clearable :maxlength="6" type="number"
					class="verification-input"/>
				<button class="verification-button" type="primary"  :disabled="isSending"
					@click="getVerificationCode">{{verificationBtnText}}</button>
			</view>

			<!-- 登录按钮 -->
			<button type="primary" class="login-button" @click="handleLogin">登录</button>

			<!-- 账号密码登录选项 -->
			<view class="alternative-login">
				<text @click="switchToPasswordLogin">使用账号密码登录</text>
			</view>
		</view>

		<!-- Toast 提示组件 -->
		<uni-popup ref="popup" type="center" border-radius="10px 10px 0 0">
			<uni-popup-message :type="toastType" :message="toastMessage" :duration="1000"></uni-popup-message>
		</uni-popup>
		
	</view>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue';

// 响应式状态
const phone = ref('');
const verificationCode = ref('');
const isSending = ref(false);
const countdown = ref(60);
const verificationBtnText = ref('获取验证码');
const toastMessage = ref('');
const toastType = ref('success');

// 引用 DOM 元素
const popup = ref(null);

// 定时器
let timer = null;

// 获取验证码
const getVerificationCode = () => {
  // 检查手机号格式
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    showToast('请输入正确的手机号', 'error');
    return;
  }
  
  // 开始倒计时
  isSending.value = true;
  countdown.value = 60;
  verificationBtnText.value = `${countdown.value}s`;
  
  timer = setInterval(() => {
    if (countdown.value > 1) {
      countdown.value--;
      verificationBtnText.value = `${countdown.value}s`;
    } else {
      clearInterval(timer);
      isSending.value = false;
      verificationBtnText.value = '获取验证码';
    }
  }, 1000);
  
  // 发送验证码请求
  // 这里添加您的验证码API请求
  showToast('验证码已发送', 'success');
};

// 显示 Toast 提示
const showToast = (message, type = 'success') => {
	
  toastMessage.value = message;
  toastType.value = type;
  popup.value.open();
};

// 处理登录
const handleLogin = () => {
  if (!phone.value) {
    showToast('请输入手机号', 'error');
    return;
  }
  
  if (!verificationCode.value) {
    showToast('请输入验证码', 'error');
    return;
  }
  
  // 执行登录请求
  // 这里添加您的登录API请求
  uni.showLoading({
    title: '登录中...'
  });
  
  setTimeout(() => {
	  uni.setStorageSync('token',"111");
    uni.hideLoading();
    // 登录成功后跳转到首页
    uni.reLaunch({
      url: '/pages/index/index'
    });
  }, 1500);
};

// 切换到账号密码登录
const switchToPasswordLogin = () => {
  // 根据实际需求跳转到密码登录页面
  uni.navigateTo({
    url: '/pages/login/password-login'
  });
};

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style lang="scss">
	.login-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: linear-gradient(to bottom, #4080FF, #4080FF);
		background-image: url(/static/background.png);
		position: relative;
		overflow: hidden;

	}

	.welcome-section {
		padding: 144rpx 30rpx 90rpx;
		z-index: 1;

		.greeting {
			font-size: 44rpx;
			color: #ffffff;
			font-weight: 700;
			display: block;
			margin-bottom: 20rpx;
		}

		.welcome-text {
			font-size: 32rpx;
			color: #ffffff;
		}
	}

	.login-form {

		background-color: #ffffff;
		border-radius: 40rpx;
		padding: 64rpx;
		z-index: 1;
		height: 576rpx;
		width: calc(100% - 60rpx);
		box-sizing: border-box;
		margin: 0 auto;
		.input-group {
			margin-bottom: 50rpx;
		}

		.phone-input,
		.verification-input {
			background-color:rgb(245, 247, 251); 
			display: block;
			height: 88rpx;
			border-radius: 44rpx;
			padding-bottom: 10rpx;
			box-sizing: border-box;
			padding: 20rpx 40rpx;
		}

		.verification-group {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.verification-input {
				flex: 1;
				border-radius: 44rpx 0 0 44rpx;
			}

			.verification-button {
				border-radius: 0 44rpx 44rpx 0 ;
				width: 200rpx;
				height: 88rpx;
				background-color: #4080FF;
				border: none;
				font-size: 28rpx;
				line-height: 88rpx;
				&[disabled] {
					background-color: #c2d3ff;
				}
			}
		}

		.login-button {
			margin-top: 80rpx;
			width: 100%;
			height: 90rpx;
			border-radius: 45rpx;
			background-color: #4080FF;
			line-height: 90rpx;
			border: none;
			font-size: 32rpx;
		}

		.alternative-login {
			margin-top: 40rpx;
			text-align: center;

			text {
				color: #4080FF;
				font-size: 28rpx;
			}
		}
	}
</style>