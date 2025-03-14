<template>
  <view class="search-box">
    <uni-icons type="search" size="18" color="#999"></uni-icons>
    <input 
      class="search-input" 
      :placeholder="placeholder" 
      confirm-type="search"
      v-model="keyword"
      @confirm="onSearch"
    />
    <uni-icons 
      v-if="keyword" 
      type="clear" 
      size="16" 
      color="#ccc" 
      @click="clearSearch"
    ></uni-icons>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索'
  },
  delay: {
    type: Number,
    default: 500
  }
});

const emit = defineEmits(['search', 'clear']);

const keyword = ref('');

// 搜索事件
const onSearch = () => {
  if (keyword.value.trim()) {
    emit('search', keyword.value);
  }
};

// 清除搜索
const clearSearch = () => {
  keyword.value = '';
  emit('clear');
};

// 监听输入变化，实现延迟搜索
let timer = null;
watch(keyword, (newVal) => {
  clearTimeout(timer);
  if (newVal.trim()) {
    timer = setTimeout(() => {
      emit('search', newVal);
    }, props.delay);
  }
});
</script>

<style lang="scss" scoped>
@import '@/static/common.scss';

.search-box {
  display: flex;
  align-items: center;
  margin: $spacing-medium $spacing-large;
  height: 72rpx;
  background-color: $card-background;
  border-radius: $radius-large;
  padding: 0 $spacing-medium;
  box-shadow: $shadow-light;
  
  .search-input {
    flex: 1;
    height: 72rpx;
    font-size: $font-size-medium;
    margin: 0 $spacing-base;
    color: $text-regular;
  }
}
</style>