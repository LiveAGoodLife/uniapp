// stores/moduleStore.js
import { defineStore } from 'pinia';

export const useModuleStore = defineStore('module', {
  // 状态定义
  state: () => ({
    // 当前模块信息
    currentModuleId: 'device',
    currentModuleName: '设备',
    
    // 各模块的标签状态
    tabStates: {
      device: '工作台',
      quality: '工作台',
      warehouse: '工作台'
    },
    
    // 是否已初始化
    initialized: false
  }),
  
  // Getters
  getters: {
    // 获取当前模块的活动标签
    currentTabName(state) {
      return state.tabStates[state.currentModuleId] || '工作台';
    },
    
    // 获取当前模块信息
    currentModule(state) {
      return {
        id: state.currentModuleId,
        name: state.currentModuleName
      };
    }
  },
  
  // Actions
  actions: {
    // 初始化 store
    async initialize() {
      if (this.initialized) return;
      
      try {
        // 从本地存储恢复模块状态
        const moduleId = uni.getStorageSync('current_module_id');
        const moduleName = uni.getStorageSync('current_module_name');
        
        if (moduleId) {
          this.currentModuleId = moduleId;
        } else {
          // 设置默认值并保存
          uni.setStorageSync('current_module_id', this.currentModuleId);
        }
        
        if (moduleName) {
          this.currentModuleName = moduleName;
        } else {
          // 设置默认值并保存
          uni.setStorageSync('current_module_name', this.currentModuleName);
        }
        
        // 恢复各模块的标签状态
        const moduleIds = ['device', 'quality', 'warehouse'];
        moduleIds.forEach(id => {
          const tabState = uni.getStorageSync(`tab_state_${id}`);
          if (tabState) {
            this.tabStates[id] = tabState;
          } else {
            uni.setStorageSync(`tab_state_${id}`, this.tabStates[id]);
          }
        });
        
        this.initialized = true;
        console.log('模块 store 已初始化', this.$state);
      } catch (e) {
        console.error('初始化模块 store 失败:', e);
      }
    },
    
    // 更新当前模块
    switchModule(moduleId, moduleName) {
      this.currentModuleId = moduleId;
      this.currentModuleName = moduleName;
      
      // 保存到本地存储
      try {
        uni.setStorageSync('current_module_id', moduleId);
        uni.setStorageSync('current_module_name', moduleName);
        console.log(`已切换到模块: ${moduleId} (${moduleName})`);
      } catch (e) {
        console.error('保存模块状态失败:', e);
      }
    },
    
    // 更新标签状态
    updateTabState(moduleId, tabName) {
      if (this.tabStates[moduleId] !== undefined) {
        this.tabStates[moduleId] = tabName;
        
        // 保存到本地存储
        try {
          uni.setStorageSync(`tab_state_${moduleId}`, tabName);
          console.log(`已更新 ${moduleId} 模块的标签状态: ${tabName}`);
        } catch (e) {
          console.error('保存标签状态失败:', e);
        }
      }
    }
  }
});