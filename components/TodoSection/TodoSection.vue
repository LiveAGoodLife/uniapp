<template>
	<view class="todo-section">
		<view class="section-header">
			<view class="section-title">
				<view class="checkmark-icon">
					<image class="name-icon" src="/static/icons/daiban.png" mode=""></image>
				</view>
				<text class="title-text">{{ title }}</text>
			</view>
			<view class="view-all" v-if="showMore" @click="onViewMore">
				<text>查看全部</text>
				<uni-icons type="right" size="14" color="#999"></uni-icons>
			</view>
		</view>
		<view class="todo-list" v-if="tasks.length > 0">
			<view class="todo-item" v-for="task in tasks" :key="task.id" @click="onTaskClick(task)">
				<view class="task-info">
					<view class="task-indicator" :style="{ backgroundColor: indicatorColor }"></view>
					<text class="task-title">{{ task.title }}</text>
				</view>
				<view class="task-time">
					{{ task.time }} <uni-icons type="right" size="14" color="#ccc"></uni-icons>
				</view>
			</view>
		</view>
		<view class="empty-state" v-else>
			<text>暂无待办任务</text>
		</view>
	</view>
</template>

<script setup>
	import {
		defineProps,
		defineEmits
	} from 'vue';

	const props = defineProps({
		// 标题
		title: {
			type: String,
			default: '待办任务'
		},
		// 待办任务列表
		tasks: {
			type: Array,
			default: () => []
		},
		// 是否显示"查看全部"按钮
		showMore: {
			type: Boolean,
			default: true
		},
		// 指示器颜色
		indicatorColor: {
			type: String,
			default: '#2979ff'
		},
		// 模块ID（用于查看全部时的跳转）
		moduleId: {
			type: String,
			default: ''
		}
	});

	const emit = defineEmits(['view-more', 'task-click']);

	// 查看全部待办
	const onViewMore = () => {
		emit('view-more', props.moduleId);
	};

	// 点击任务项
	const onTaskClick = (task) => {
		emit('task-click', task);
	};
</script>

<style lang="scss" scoped>
	.name-icon {
		width: 36rpx;
		height: 36rpx;
		vertical-align: bottom;
	}

	.todo-section {
		margin: 20rpx 30rpx;
		background-color: #fff;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.section-header {
		padding: 20rpx 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.section-title {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		font-weight: 500;
		color: #333;

		.checkmark-icon {
			margin-right: 10rpx;
		}
	}

	.view-all {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #999;
	}

	.todo-list {
		padding: 0 30rpx;
	}

	.todo-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f0f0f0;

		&:last-child {
			border-bottom: none;
		}
	}

	.task-info {
		display: flex;
		align-items: center;
	}

	.task-indicator {
		width: 6rpx;
		height: 36rpx;
		border-radius: 3rpx;
		margin-right: 20rpx;
	}

	.task-title {
		font-size: 28rpx;
		color: #333;
	}

	.task-time {
		font-size: 26rpx;
		color: #999;
		display: flex;
		align-items: center;
	}

	.empty-state {
		padding: 60rpx 0;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}
</style>