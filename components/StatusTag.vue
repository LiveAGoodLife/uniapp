<template>
  <view class="status-tag" :class="getStatusClass">
    {{ text }}
  </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    default: 'default'
  },
  text: {
    type: String,
    default: '状态'
  }
});

const getStatusClass = computed(() => {
  const statusMap = {
    'pending': 'status-pending',
    'inprogress': 'status-inprogress',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled',
    'available': 'status-available',
    'fault': 'status-fault',
    'default': 'status-default'
  };
  
  return statusMap[props.status] || 'status-default';
});
</script>

<style lang="scss" scoped>
@import '@/static/common.scss';

.status-tag {
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  font-size: $font-size-mini;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &.status-pending {
    background-color: rgba($secondary-color, 0.1);
    color: $secondary-color;
  }
  
  &.status-inprogress {
    background-color: rgba($info-color, 0.1);
    color: $info-color;
  }
  
  &.status-completed {
    background-color: rgba($success-color, 0.1);
    color: $success-color;
  }
  
  &.status-cancelled {
    background-color: rgba($text-placeholder, 0.1);
    color: $text-placeholder;
  }
  
  &.status-available {
    background-color: rgba($success-color, 0.1);
    color: $success-color;
  }
  
  &.status-fault {
    background-color: rgba($error-color, 0.1);
    color: $error-color;
  }
  
  &.status-default {
    background-color: rgba($text-secondary, 0.1);
    color: $text-secondary;
  }
}
</style>