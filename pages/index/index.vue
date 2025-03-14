<template>
	<view class="container">
		<!-- 顶部设备选择和操作区 -->
		<view class="header">
			<view class="module-selector" @click="openDrawer">
				<image src="/static/icons/module.png"></image>
				<text>{{ currentModule.name }}</text>
				<uni-icons type="down" size="14" color="#666"></uni-icons>
			</view>

			<view class="action-buttons">
				<view class="scan-btn" @click="openScan">
					<uni-icons type="scan" size="24" color="#2979ff"></uni-icons>
				</view>
				<view class="settings-btn" @click="openSettings">
					<uni-icons type="gear" size="24" color="#666"></uni-icons>
				</view>
			</view>
		</view>

		<!-- 卡片 -->
		<stats-card :user-info="user" :stats-items="statsData" :fixed-top="true" @tag-click="handleTagClick"
			@stats-item-click="handleStatsClick" />

		<!-- 待办任务组件 -->
		<todo-section :tasks="currentTasks" :module-id="currentModule.id"
			:indicator-color="getIndicatorColor(currentModule.id)" @view-more="viewAllTodos"
			@task-click="handleTaskClick" />

		<!-- 常用功能组件 -->
		<function-grid :functions="currentFunctions" :columns-per-row="4" @function-click="openFunction" />

		<!-- 柱状图 -->
		<view class="today-reality" v-if="currentModule.id === 'warehouse'">
			<view class="section-header">
				<view class="checkmark-icon">
					<image class="name-icon" src="/static/icons/daiban.png" mode=""></image>
				</view>
				<text class="section-title">今日实况</text>
			</view>
			<view class="section-body">
				<BarChart :height="480" :categories="barCategories" :series-data="barSeriesData" :show-y-axis="false"
					:show-grid-lines="false" background-color="#F8F8FA" :bar-width="80" :bar-gap="20"
					:use-bar-color-for-value="true" title="总工单数:50(单)" />
			</view>
		</view>

		<!-- 折线图 -->
		<view class="today-reality" v-if="currentModule.id === 'warehouse'">
			<view class="section-header">
				<view class="checkmark-icon">
					<image class="name-icon" src="/static/icons/daiban.png" mode=""></image>
				</view>
				<text class="section-title">预警分析</text>
			</view>
			<view class="section-body">
				<qiun-data-charts type="line" :chartData="lineChartData" :opts="lineChartOpts" :canvas2d="true" />
			</view>
		</view>

		<task-tabs v-if="currentModule.id === 'quality'" :production-tasks="productionTasks"
			:inspection-tasks="inspectionTasks" :maintenance-tasks="maintenanceTasks" :initial-tab="currentTabIndex"
			@tab-change="onTabChange" @task-click="onTaskClick" @action-click="onActionClick" />

		<!-- 底部导航栏 - 根据不同模块显示不同导航栏 -->
		<tab-bar :module-id="moduleStore.currentModuleId" active-tab="工作台" @tab-change="handleTabChange"></tab-bar>

		<!-- 系统模块选择抽屉 -->
		<uni-drawer ref="drawer" mode="left" :mask-click="true" :width="300">
			<view class="drawer-content">
				<view class="drawer-header">
					<text class="drawer-title">选择模块</text>
				</view>

				<uni-section title="系统模块" type="line">
					<view class="module-list">
						<view class="module-list-item" v-for="module in systemModules" :key="module.id"
							:class="{ active: currentModule.id === module.id }" @click="selectModule(module)">
							<view class="module-item-left">
								<image :src="module.icon" class="module-icon"></image>
								<view class="module-info">
									<text class="module-name">{{ module.name }}</text>
									<text class="module-desc">{{ module.description }}</text>
								</view>
							</view>
							<uni-icons v-if="currentModule.id === module.id" type="checkmarkempty" size="18"
								color="#2979ff"></uni-icons>
						</view>
					</view>
				</uni-section>

				<view class="drawer-footer">
					<button class="close-btn" @click="closeDrawer()">关闭</button>
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script setup>
import StatsCard from '@/components/StatsCard/StatsCard.vue';
import TodoSection from '@/components/TodoSection/TodoSection.vue';
import FunctionGrid from '@/components/FunctionGrid/FunctionGrid.vue';
import BarChart from '@/components/BarChart/BarChart.vue';
import TaskTabs from '@/components/TaskTabs/TaskTabs.vue';
import TabBar from '@/components/NavTab/NavTab.vue';
import {
	ref,
	reactive,
	computed,
	onMounted,
} from 'vue';
import { useModuleStore } from '@/stores/moduleStore';
// 获取 Pinia store
const moduleStore = useModuleStore();

// 用户信息
const user = ref({
	name: '赵钱孙',
	avatar: '/static/avatar.png',
	greeting: 'Hello',
	tagName: '连接员'
});

// 统计数据
const statsData = ref([{
	id: 1,
	count: 8,
	unit: '单',
	label: '待出库单'
},
{
	id: 2,
	count: 8,
	unit: '单',
	label: '待入库单'
},
{
	id: 3,
	count: 8,
	unit: '单',
	label: '待发运单'
},
{
	id: 4,
	count: 8,
	unit: '单',
	label: '今日接收'
}
]);

// 自定义统计数据
const customStats = ref([{
	id: 1,
	count: 92,
	unit: '%',
	label: '完成率'
},
{
	id: 2,
	count: 157,
	label: '今日总量'
}
]);

// 标签点击事件处理
const handleTagClick = (userInfo) => {
	uni.navigateTo({
		url: '/pages/connect/index'
	});
};

// 统计项点击事件处理
const handleStatsClick = (item) => {
	uni.navigateTo({
		url: `/pages/detail/index?type=${item.id}&label=${item.label}`
	});
};

// 系统模块选项
const systemModules = ref([{
	id: 'device',
	name: '设备',
	icon: '/static/icons/device.png',
	description: '设备管理与维护'
},
{
	id: 'quality',
	name: '技术质量',
	icon: '/static/icons/quality.png',
	description: '质量检测与标准管理'
},
{
	id: 'warehouse',
	name: '仓库管理',
	icon: '/static/icons/warehouse.png',
	description: '库存与物料管理'
}
]);



// 抽屉是否显示
const drawer = ref(null);

// 不同模块的待办任务数据
const moduleTasksData = {
	device: [{
		id: 1,
		title: '设备保修待审核',
		time: '06.29 10:30'
	},
	{
		id: 2,
		title: '设备保修待审核',
		time: '06.29 10:12'
	},
	{
		id: 3,
		title: '设备保修待审核',
		time: '06.29 08:30'
	}
	],
	quality: [{
		id: 1,
		title: '质量检测待处理',
		time: '06.29 11:30'
	},
	{
		id: 2,
		title: '技术标准待审核',
		time: '06.29 09:45'
	}
	],
	warehouse: [{
		id: 1,
		title: '物料入库待确认',
		time: '06.29 14:20'
	},
	{
		id: 2,
		title: '出库申请待审核',
		time: '06.29 13:10'
	},
	{
		id: 3,
		title: '库存盘点任务',
		time: '06.29 09:00'
	}
	]
};

// 常用功能列表
const moduleFunctionsData = {
	device: [{
		id: 'd1',
		name: '基本信息',
		icon: '/static/icons/info.png',
		color: '#2979ff'
	},
	{
		id: 'd2',
		name: '运维管理',
		icon: '/static/icons/operation.png',
		color: '#ff9500'
	},
	{
		id: 'd3',
		name: '设备报修',
		icon: '/static/icons/repair.png',
		color: '#4cd964'
	},
	{
		id: 'd4',
		name: '盘点',
		icon: '/static/icons/inventory.png',
		color: '#2979ff'
	},
	{
		id: 'd5',
		name: '开关机管理',
		icon: '/static/icons/purchase.png',
		color: '#4cd964'
	}
	],
	quality: [{
		id: 'q1',
		name: '生产工单',
		icon: '/static/icons/quality.png',
		color: '#2979ff'
	},
	{
		id: 'q2',
		name: '外协工单',
		icon: '/static/icons/standard.png',
		color: '#ff9500'
	},
	{
		id: 'q3',
		name: '在途采购',
		icon: '/static/icons/report.png',
		color: '#4cd964'
	},
	{
		id: 'q4',
		name: '待审批',
		icon: '/static/icons/plan.png',
		color: '#2979ff'
	}
	],
	warehouse: [{
		id: 'w1',
		name: '收货单',
		icon: '/static/icons/inbound.png',
		color: '#0096FF'
	},
	{
		id: 'w2',
		name: '出库管理',
		icon: '/static/icons/outbound.png',
		color: '#0096FF'
	},
	{
		id: 'w3',
		name: '入库管理',
		icon: '/static/icons/inventory.png',
		color: '#0096FF'
	},
	{
		id: 'w4',
		name: '盘点单',
		icon: '/static/icons/material.png',
		color: '#0096FF'
	},
	{
		id: 'w5',
		name: '签收单',
		icon: '/static/icons/check.png',
		color: '#0096FF'
	},
	{
		id: 'w6',
		name: '移位单',
		icon: '/static/icons/check.png',
		color: '#0096FF'
	},
	{
		id: 'w7',
		name: '装箱单',
		icon: '/static/icons/check.png',
		color: '#0096FF'
	},
	{
		id: 'w8',
		name: '包装管理',
		icon: '/static/icons/check.png',
		color: '#0096FF'
	},
	{
		id: 'w9',
		name: '承运单',
		icon: '/static/icons/check.png',
		color: '#0096FF'
	},
	{
		id: 'w10',
		name: '审批消息',
		icon: '/static/icons/check.png',
		color: '#0096FF'
	},
	]
};

// 当前模块
const currentModule = ref({
	id: 'device',
	name: '设备'
});

// 为每个模块分别保存激活的tab
const activeTabMap = reactive({
	device: '工作台',
	quality: '工作台',
	warehouse: '工作台'
});


// 处理标签切换
const handleTabChange = (tabInfo) => {
	console.log('标签切换:', tabInfo);
};






// 打开扫码功能
const openScan = () => {
	uni.scanCode({
		success: (res) => {
			uni.showToast({
				title: '扫码成功: ' + res.result,
				icon: 'none'
			});
		}
	});
};

// 打开设置
const openSettings = () => {
	uni.navigateTo({
		url: '/pages/settings/index'
	});
};

// 查看全部待办
const viewAllTodos = (moduleId) => {
	uni.navigateTo({
		url: `/pages/common/todotask?module=${moduleId || currentModule.value.id}`
	});
};

// 处理任务点击
const handleTaskClick = (task) => {
	uni.navigateTo({
		url: `/pages/common/detail?id=${task.id}&module=${currentModule.value.id}&title=${encodeURIComponent(task.title)}`
	});
};

// 打开功能页面
const openFunction = (func) => {

	if (currentModule.value.id === 'device') {
		console.log('打开功能:', func.id);
		switch (func.id) {
			case 'd1':
				uni.navigateTo({
					url: '/pages/device/basicInformation'
				});
				break;
			case 'd2':
				uni.navigateTo({
					url: '/pages/device/maintenance'
				});
				break;
			case 'd3':
				uni.navigateTo({
					url: '/pages/device/warranty'
				});
				break;
			case 'd4':
				uni.navigateTo({
					url: '/pages/device/stocktaking'
				});
				break;
				case 'd5':
				uni.navigateTo({
					url: '/pages/device/onoff'
				});
				break;
		}

	}

};

// 打开抽屉
const openDrawer = () => {
	drawer.value.open();
};

// 关闭抽屉
const closeDrawer = () => {
	drawer.value.close();
};

// 选择设备
const selectDevice = () => {
	uni.navigateTo({
		url: '/pages/device/select'
	});
};

// 根据当前模块获取对应的待办任务
const currentTasks = computed(() => {
	return moduleTasksData[currentModule.value.id] || [];
});

// 根据当前模块获取对应的常用功能
const currentFunctions = computed(() => {
	return moduleFunctionsData[currentModule.value.id] || [];
});

// 根据模块获取指示器颜色
const getIndicatorColor = (moduleId) => {
	switch (moduleId) {
		case 'device':
			return '#2979ff';
		case 'quality':
			return '#ff9500';
		case 'warehouse':
			return '#4cd964';
		default:
			return '#2979ff';
	}
};

// 选择系统模块
const selectModule = (module) => {
	// 如果选择的是当前模块，只需关闭选择器
	if (currentModule.value.id === module.id) {
		closeDrawer();
		return;
	}

	// 切换到新模块
	currentModule.value = module;
	moduleStore.switchModule(module.id,module.name)
	// 关闭抽屉
	closeDrawer();

	// 提示用户已切换模块
	uni.showToast({
		title: `已切换到${module.name}模块`,
		icon: 'none',
		duration: 1500
	});
};

// 根据当前模块获取页面标题
const getPageTitle = computed(() => {
	switch (currentModule.value.id) {
		case 'device':
			return '设备管理';
		case 'quality':
			return '技术质量';
		case 'warehouse':
			return '仓库管理';
		default:
			return 'IMES智能制造';
	}
});

// 柱状图数据
const barCategories = ref(['配送出库', '普通入库', '检维入库', '生产入库', '领料出库']);
const barSeriesData = ref([{
	name: '数量',
	data: [24, 12, 6, 2, 8],
	colors: ['#0072FF', '#5470C5', '#FAC758', '#FF845B', '#92CB76']
}]);

// 折线图数据
const lineChartData = ref({
	categories: [1, 2, 3, 4, 31],
	series: [{
		name: '数量',
		data: [24, 12, 6, 2, 8],
		color: '#0072FF'
	}]
});

// 折线图配置
const lineChartOpts = ref({
	color: ['#0072FF'],
	yAxis: {
		disabled: true // 隐藏Y轴
	},
	xAxis: {
		disableGrid: true
	},
	extra: {
		line: {
			type: 'curve',
			width: 3,
			activeType: 'none'
		},
		area: {
			addLine: true,
			opacity: 0.2,
			gradient: true
		}
	},
	enableScroll: false,
	dataLabel: true,
	dataPointShape: true,
	dataPointShapeType: 'solid',
	padding: [15, 15, 0, 5]
});

// 响应式状态
const currentTabIndex = ref(0);

// 生产任务数据 - 已更新结构与图片更符合
const productionTasks = ref([{
	id: 'P001',
	title: '追火炉增温设备',
	tags: [{
		name: '铝产品',
		selected: true
	},
	{
		name: '加热炉',
		selected: true
	},
	{
		name: '机加工',
		selected: true
	}
	],
	startTime: '2023.08.01 09:00',
	duration: '2h',
	count: 2,
	workers: '1、技术要求是机制阀阀体中对零件件加工工艺...',
	status: '未开始',
	actionText: '未开始'
},
{
	id: 'P002',
	title: '冷却系统维护',
	tags: [{
		name: '钢材',
		selected: false
	},
	{
		name: '加工中心',
		selected: true
	}
	],
	startTime: '2023.08.02 14:30',
	duration: '3h',
	count: 5,
	workers: '1、按照图纸要求完成钢材的精细加工...',
	status: '进行中'
}
]);

// 点检任务数据
const inspectionTasks = ref([{
	id: 'I001',
	title: '注塑机日常点检',
	tags: [{
		name: '注塑机',
		selected: true
	},
	{
		name: '日常点检',
		selected: true
	}
	],
	startTime: '2023.08.01 08:00',
	duration: '30min',
	workers: '1、检查设备各部件运行状态及温控系统...',
	status: '未开始',
	actionText: '未开始'
}]);

// 保养任务数据
const maintenanceTasks = ref([{
	id: 'M001',
	title: '追火炉季度保养',
	tags: [{
		name: '追火炉',
		selected: true
	},
	{
		name: '季度保养',
		selected: true
	}
	],
	startTime: '2023.08.10 09:00',
	duration: '4h',
	workers: '1、清理炉内积灰，2、检查加热元件...',
	status: '未开始',
	actionText: '未开始'
}]);


// Tab切换事件处理
const onTabChange = (tabInfo) => {
	console.log('Tab切换:', tabInfo);
	// 可以在这里根据选中的tab加载更多数据
};

// 任务点击事件处理
const onTaskClick = (info) => {
	console.log('任务点击:', info.task.id);
	// 导航到任务详情页
	uni.navigateTo({
		url: `/pages/task/detail?id=${info.task.id}&type=${info.tabKey}`
	});
};

// 操作按钮点击事件处理
const onActionClick = (info) => {
	console.log('操作按钮点击:', info.task.id);
	// 开始任务逻辑
	uni.showModal({
		title: '确认',
		content: '确定要开始执行该任务吗？',
		success: (res) => {
			if (res.confirm) {
				// 开始任务的业务逻辑
				startTask(info.task, info.tabKey);
			}
		}
	});
};

// 开始任务
const startTask = (task, tabKey) => {
	// 模拟任务开始逻辑
	uni.showLoading({
		title: '操作中...'
	});

	setTimeout(() => {
		// 更新任务状态
		task.status = '进行中';

		uni.hideLoading();
		uni.showToast({
			title: '任务已开始',
			icon: 'success'
		});
	}, 1000);
};

// 在组件挂载后执行
onMounted(() => {
	// 可以在这里加载初始数据或执行其他初始化逻辑
});
</script>


<style lang="scss" scoped>
/* 整体容器优化 */
.container {
  padding-top: 88rpx;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fc; // 更柔和的背景色
  padding-bottom: 100rpx;
  box-sizing: border-box;
}

/* 顶部导航栏优化 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  background: linear-gradient(to right, #ffffff, #f8f9fc); // 渐变背景
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.03);
}

.module-selector {
  display: flex;
  align-items: center;
  font-size: 34rpx;
  font-weight: 600;
  color: #2C3E50;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
  
  image {
    width: 38rpx;
    height: 38rpx;
    margin-right: 12rpx;
    filter: drop-shadow(0 1rpx 2rpx rgba(0, 0, 0, 0.1));
  }
  
  .uni-icons {
    margin-left: 10rpx;
    transition: transform 0.3s ease;
  }
  
  &:hover .uni-icons {
    transform: translateY(2rpx);
  }
}

.action-buttons {
  display: flex;
  align-items: center;

  .scan-btn,
  .settings-btn {
    margin-left: 40rpx;
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.3s;
    
    &:active {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
  
  .scan-btn {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      width: 12rpx;
      height: 12rpx;
      background-color: #2979ff;
      border-radius: 50%;
      top: 15rpx;
      right: 15rpx;
      border: 2rpx solid #fff;
    }
  }
}

/* 底部导航栏优化 */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background-color: #fff;
  display: flex;
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.95);
  }

  .tab-icon {
    width: 48rpx;
    height: 48rpx;
    transition: all 0.3s;
  }

  text {
    font-size: 24rpx;
    color: #8C9BAB;
    margin-top: 8rpx;
    transition: all 0.3s;
  }

  .active-text {
    color: #2979ff;
    font-weight: 500;
  }
  
  &.active {
    .tab-icon {
      transform: translateY(-4rpx);
    }
  }
}

/* 抽屉样式优化 */
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}

.drawer-header {
  padding: 32rpx 40rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(to right, #f8f9fc, #ffffff);
}

.drawer-title {
  font-size: 38rpx;
  font-weight: 600;
  color: #2C3E50;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 60rpx;
    height: 6rpx;
    background-color: #2979ff;
    bottom: -12rpx;
    left: 0;
    border-radius: 3rpx;
  }
}

.module-list {
  background-color: #fff;
  margin-top: 20rpx;
}

.module-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 40rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &.active {
    background-color: rgba(41, 121, 255, 0.05);
    border-left: 8rpx solid #2979ff;
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.02);
  }
}

.module-item-left {
  display: flex;
  align-items: center;
}

.module-icon {
  width: 88rpx;
  height: 88rpx;
  margin-right: 24rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  .active & {
    transform: scale(1.05);
  }
}

.module-info {
  display: flex;
  flex-direction: column;
}

.module-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 10rpx;
}

.module-desc {
  font-size: 26rpx;
  color: #8C9BAB;
  line-height: 1.5;
}

.drawer-footer {
  margin-top: auto;
  padding: 32rpx 40rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
  background-color: #f8f9fc;
}

.close-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background-color: #fff;
  color: #2C3E50;
  font-size: 32rpx;
  font-weight: 500;
  border-radius: 45rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  border: none;
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
  }
  
  &::after {
    border: none;
  }
}

/* 图表区域优化 */
.today-reality {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:active {
    transform: scale(0.99);
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
  }

  .section-header {
    display: flex;
    align-items: center;
    padding: 24rpx 32rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
    background: linear-gradient(to right, #fcfcfc, #ffffff);
  }

  .section-body {
    margin: 32rpx 24rpx;
    border-radius: 12rpx;
    overflow: hidden;
  }

  .chart-container {
    width: 100%;
    height: 488rpx;
    border-radius: 12rpx;
    overflow: hidden;
  }
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2C3E50;
  position: relative;
}

.name-icon {
  width: 40rpx;
  height: 40rpx;
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.1));
}

.checkmark-icon {
  margin-right: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50rpx;
  height: 50rpx;
  border-radius: 25rpx;
  background-color: rgba(41, 121, 255, 0.1);
}

/* 添加一些动画效果 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes slideIn {
  from { transform: translateX(-20rpx); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* 为特定元素添加动画 */
.module-selector {
  animation: slideIn 0.5s ease;
}

.scan-btn {
  animation: pulse 2s infinite;
}

/* 添加卡片间的间距和过渡效果 */
:deep(.stats-card),
:deep(.todo-section),
:deep(.function-grid) {
  margin-bottom: 30rpx;
  transition: transform 0.3s ease;
  
  &:active {
    transform: scale(0.99);
  }
}

/* 为功能网格添加悬浮效果 */
:deep(.function-item) {
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:active {
    transform: translateY(-4rpx);
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
  }
}

/* 添加自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8rpx;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4rpx;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4rpx;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
