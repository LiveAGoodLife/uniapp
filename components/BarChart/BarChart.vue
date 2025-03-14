<template>
  <view class="bar-chart-container" :style="{ 
    height: height + 'rpx',
    backgroundColor: backgroundColor,
    borderRadius: borderRadius + 'rpx',
    boxShadow: showShadow ? '0 2rpx 10rpx rgba(0, 0, 0, 0.05)' : 'none'
  }">
    <view class="chart-header" v-if="title">
      <text class="chart-title" :style="{ color: titleColor }">{{ title }}</text>
      <view class="chart-legend" v-if="showLegend && seriesData.length > 1">
        <view 
          class="legend-item" 
          v-for="(series, index) in seriesData" 
          :key="index"
        >
          <view 
            class="legend-color" 
            :style="{ backgroundColor: getSeriesBaseColor(index) }"
          ></view>
          <text class="legend-text" :style="{ color: legendTextColor }">{{ series.name }}</text>
        </view>
      </view>
    </view>
    
    <view class="chart-body">
      <!-- Y轴刻度和标签 (可选显示) -->
      <view class="y-axis" v-if="showYAxis">
        <view 
          class="axis-label" 
          v-for="(value, index) in yAxisLabels" 
          :key="index"
          :style="{ bottom: (index / (yAxisLabels.length - 1)) * 100 + '%' }"
        >
          <text :style="{ color: axisLabelColor }">{{ value }}</text>
        </view>
      </view>
      
      <!-- 图表内容区域 -->
      <scroll-view 
        class="chart-scroll-area" 
        scroll-x="true" 
        :show-scrollbar="false"
        :scroll-x="scrollable"
      >
        <view 
          class="chart-content" 
          :style="{ 
            width: scrollable ? Math.max(categories.length * (barGroupWidth + barGap), '100%') + 'rpx' : '100%',
            minWidth: '100%'
          }"
        >
          <!-- 背景网格线 (可选显示) -->
          <view class="grid-lines" v-if="showGridLines">
            <view 
              class="grid-line" 
              v-for="(value, index) in yAxisLabels" 
              :key="index"
              :style="{ 
                bottom: (index / (yAxisLabels.length - 1)) * 100 + '%',
                backgroundColor: gridLineColor 
              }"
            ></view>
          </view>
          
          <!-- 图表区域 -->
          <view class="chart-area">
            <!-- 柱状图组 -->
            <view class="bar-groups">
              <view 
                class="bar-group" 
                v-for="(category, categoryIndex) in categories" 
                :key="categoryIndex"
                :style="{ 
                  width: `${100 / categories.length}%`
                }"
              >
                <!-- 每个系列的柱子 -->
                <view 
                  class="bar-wrapper"
                  v-for="(series, seriesIndex) in seriesData" 
                  :key="seriesIndex"
                >
                  <!-- 柱子上的数值标签 -->
                  <text 
                    v-if="showBarValues" 
                    class="bar-value" 
                    :style="{ 
                      color: getValueColor(seriesIndex, categoryIndex, series.data[categoryIndex]),
                      bottom: `calc(${getBarHeight(series.data[categoryIndex])}% + 10rpx)`
                    }"
                  >
                    {{ formatValue(series.data[categoryIndex]) }}
                  </text>
                  
                  <view 
                    class="bar" 
                    :style="{ 
                      height: getBarHeight(series.data[categoryIndex]) + '%',
                      backgroundColor: getBarColor(seriesIndex, categoryIndex, series.data[categoryIndex]),
                      borderRadius: barBorderRadius + 'rpx ' + barBorderRadius + 'rpx 0 0',
                      width: props.barWidth + 'rpx'
                    }"
                    @click="handleBarClick(seriesIndex, categoryIndex, series.data[categoryIndex])"
                  >
                  </view>
                </view>
              </view>
            </view>
          </view>
          
          <!-- X轴类别标签独立区域 -->
          <view class="x-axis">
            <view 
              class="x-axis-item" 
              v-for="(category, categoryIndex) in categories" 
              :key="categoryIndex"
              :style="{
                width: `${100 / categories.length}%`,
                left: `${(categoryIndex * 100) / categories.length}%`
              }"
            >
              <text class="category-label" :style="{ color: categoryLabelColor }">{{ category }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  // 图表标题
  title: {
    type: String,
    default: ''
  },
  // 图表高度
  height: {
    type: [Number, String],
    default: 500
  },
  // X轴类别
  categories: {
    type: Array,
    default: () => []
  },
  // 系列数据，格式：[{name: '系列1', data: [值1,值2...], colors: ['#color1', '#color2', ...]}, {...}]
  seriesData: {
    type: Array,
    default: () => []
  },
  // 默认系列颜色，如果没有为特定柱子设置颜色，则使用这些颜色
  colors: {
    type: Array,
    default: () => ['#2979ff', '#ff9500', '#4cd964', '#9c27b0', '#ff5722']
  },
  // 柱子颜色配置，可以指定每个柱子的颜色
  barColors: {
    type: Array,
    default: () => []
  },
  // 颜色条件配置: 根据值范围设置颜色
  colorRanges: {
    type: Array,
    default: () => []
  },
  // Y轴最大值，默认自动计算
  maxValue: {
    type: Number,
    default: null
  },
  // Y轴刻度数量
  yAxisSteps: {
    type: Number,
    default: 5
  },
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true
  },
  // 是否显示柱子上的数值
  showBarValues: {
    type: Boolean,
    default: true
  },
  // 柱子宽度
  barWidth: {
    type: Number,
    default: 40
  },
  // 柱组之间的间距
  barGap: {
    type: Number,
    default: 30
  },
  // 是否可横向滚动
  scrollable: {
    type: Boolean,
    default: true
  },
  // 值格式化函数
  valueFormatter: {
    type: Function,
    default: null
  },
  // 是否显示Y轴
  showYAxis: {
    type: Boolean,
    default: true
  },
  // 是否显示网格线
  showGridLines: {
    type: Boolean,
    default: true
  },
  // 背景颜色
  backgroundColor: {
    type: String,
    default: '#FFFFFF'
  },
  // 图表容器边框圆角
  borderRadius: {
    type: Number,
    default: 12
  },
  // 是否显示阴影
  showShadow: {
    type: Boolean,
    default: true
  },
  // 标题颜色
  titleColor: {
    type: String,
    default: '#333333'
  },
  // 图例文本颜色
  legendTextColor: {
    type: String,
    default: '#666666'
  },
  // 坐标轴标签颜色
  axisLabelColor: {
    type: String,
    default: '#999999'
  },
  // 网格线颜色
  gridLineColor: {
    type: String,
    default: '#f0f0f0'
  },
  // 类别标签颜色
  categoryLabelColor: {
    type: String,
    default: '#666666'
  },
  // 柱状值标签颜色
  barValueColor: {
    type: String,
    default: '#666666'
  },
  // 柱子圆角大小
  barBorderRadius: {
    type: Number,
    default: 6
  },
  // X轴区域高度
  xAxisHeight: {
    type: Number,
    default: 60
  },
  // 是否使用柱子颜色作为数值标签颜色
  useBarColorForValue: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['bar-click']);

// 计算Y轴最大值
const computedMaxValue = computed(() => {
  if (props.maxValue !== null) return props.maxValue;
  
  let max = 0;
  props.seriesData.forEach(series => {
    const seriesMax = Math.max(...series.data.filter(val => val !== undefined && val !== null));
    if (seriesMax > max) max = seriesMax;
  });
  
  // 如果所有数据都是undefined或null，则返回1作为默认最大值
  if (max === 0) return 1;
  
  // 向上取整到合适的值以使图表更美观
  const power = Math.floor(Math.log10(max));
  const unit = Math.pow(10, power);
  return Math.ceil(max / unit) * unit;
});

// 计算Y轴标签
const yAxisLabels = computed(() => {
  const labels = [];
  const step = computedMaxValue.value / (props.yAxisSteps - 1);
  
  for (let i = 0; i < props.yAxisSteps; i++) {
    const value = i * step;
    labels.push(formatValue(value));
  }
  
  return labels;
});

// 计算每个柱组的总宽度
const barGroupWidth = computed(() => {
  if (props.seriesData.length === 1) {
    return props.barWidth;
  }
  return props.barWidth * props.seriesData.length + (props.seriesData.length - 1) * 10;
});

// 获取系列的基础颜色（用于图例显示）
const getSeriesBaseColor = (seriesIndex) => {
  // 如果在seriesData中有定义colors并且有至少一种颜色，则使用第一种颜色作为系列颜色
  if (props.seriesData[seriesIndex].colors && props.seriesData[seriesIndex].colors.length > 0) {
    return props.seriesData[seriesIndex].colors[0];
  }
  
  // 否则使用默认颜色数组
  return props.colors[seriesIndex % props.colors.length];
};

// 获取特定柱子的颜色
const getBarColor = (seriesIndex, categoryIndex, value) => {
  // 检查值是否有效
  if (value === undefined || value === null) return '#eeeeee';
  
  // 优先级1: 检查barColors是否有该柱子的特定颜色
  if (props.barColors && 
      props.barColors[seriesIndex] && 
      props.barColors[seriesIndex][categoryIndex]) {
    return props.barColors[seriesIndex][categoryIndex];
  }
  
  // 优先级2: 检查seriesData中是否定义了该系列的colors
  if (props.seriesData[seriesIndex].colors && 
      props.seriesData[seriesIndex].colors[categoryIndex]) {
    return props.seriesData[seriesIndex].colors[categoryIndex];
  }
  
  // 优先级3: 根据值范围设置颜色
  if (props.colorRanges && props.colorRanges.length > 0) {
    for (const range of props.colorRanges) {
      if (value >= range.min && value <= range.max) {
        return range.color;
      }
    }
  }
  
  // 优先级4: 使用系列默认颜色
  return props.colors[seriesIndex % props.colors.length];
};

// 获取数值标签的颜色（与柱子颜色相匹配）
const getValueColor = (seriesIndex, categoryIndex, value) => {
  if (!props.useBarColorForValue) {
    return props.barValueColor;
  }
  return getBarColor(seriesIndex, categoryIndex, value);
};

// 计算柱子高度（百分比）
const getBarHeight = (value) => {
  if (value === undefined || value === null) return 0;
  return (value / computedMaxValue.value) * 100;
};

// 格式化值显示
const formatValue = (value) => {
  if (props.valueFormatter) {
    return props.valueFormatter(value);
  }
  
  // 默认格式化：大于1000显示为k，大于1000000显示为M
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'k';
  }
  
  return value.toFixed(0);
};

// 柱子点击事件
const handleBarClick = (seriesIndex, categoryIndex, value) => {
  emit('bar-click', {
    seriesIndex,
    categoryIndex,
    category: props.categories[categoryIndex],
    seriesName: props.seriesData[seriesIndex].name,
    value
  });
};
</script>

<style lang="scss">
.bar-chart-container {
  padding: 30rpx;
  position: relative;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.chart-title {
  font-size: 30rpx;
  font-weight: 500;
}

.chart-legend {
  display: flex;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-left: 20rpx;
}

.legend-color {
  width: 24rpx;
  height: 12rpx;
  border-radius: 6rpx;
  margin-right: 8rpx;
}

.legend-text {
  font-size: 24rpx;
}

.chart-body {
  display: flex;
  flex: 1;
  position: relative;
  min-height: 300rpx;
}

.y-axis {
  width: 80rpx;
  height: 100%;
  position: relative;
  padding-right: 10rpx;
}

.axis-label {
  position: absolute;
  right: 10rpx;
  transform: translateY(50%);
  
  text {
    font-size: 22rpx;
  }
}

.chart-scroll-area {
  flex: 1;
  height: 100%;
  position: relative;
}

.chart-content {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.chart-area {
  flex: 1;
  position: relative;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1rpx;
}

.bar-groups {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: flex-end;
}

.bar-group {
  display: flex;
  justify-content: center;
  position: relative;
  height: 100%;
  box-sizing: border-box;
}

.bar-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.bar {
  position: relative;
  transition: height 0.3s ease-in-out, background-color 0.3s ease-in-out;
  min-height: 4rpx;
}

.bar-value {
  position: absolute;
  font-size: 22rpx;
  white-space: nowrap;
  text-align: center;
  width: 100%;
  transition: opacity 0.3s ease;
}

/* X轴样式 */
.x-axis {
  height: 60rpx;
  position: relative;
  margin-top: 10rpx;
  display: flex;
  width: 100%;
}

.x-axis-item {
  position: absolute;
  display: flex;
  justify-content: center;
  height: 100%;
  box-sizing: border-box;
}

.category-label {
  font-size: 24rpx;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; /* 确保不会溢出 */
}
</style>