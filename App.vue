<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 获取存储的token或登录状态
			const token = uni.getStorageSync('token');

			// 如果未登录，跳转到登录页
			if (!token) {
				uni.reLaunch({
					url: '/pages/login/login'
				});
			} else {
				// 已登录则跳转到首页/主页
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>