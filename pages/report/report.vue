<template>
	<view class="report">
		<h1>Report Page</h1>
		<tab-bar :module-id="moduleStore.currentModuleId" active-tab="工作台" @tab-change="handleTabChange"></tab-bar>
	</view>
</template>

<script setup>
import TabBar from '@/components/NavTab/NavTab.vue';
  import { useModuleStore } from '@/stores/moduleStore';
  
  // 处理标签切换
  const handleTabChange = (tabInfo) => {
  	console.log('标签切换:', tabInfo);
  };
  const moduleStore = useModuleStore();
</script>

<style scoped>
	.report {
		/* Add your styles here */
	}
</style>