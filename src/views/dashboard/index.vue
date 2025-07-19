<template>
  <div class="dashboard-container">
    <!-- 顶部导航 -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">生产数据看板</h1>
        <div class="header-actions">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="fetchData"
            class="date-picker"
          />
          <el-button type="primary" @click="fetchData" class="refresh-btn">
            <el-icon><Refresh /></el-icon> 刷新数据
          </el-button>
        </div>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="dashboard-main">
      <!-- 关键指标卡片 -->
      <section class="kpi-section">
        <div class="kpi-grid">
          <el-card class="kpi-card">
            <div class="kpi-card-content">
              <div class="kpi-title">总生产量</div>
              <div class="kpi-value">{{ summaryData.totalProduction || 0 }}</div>
              <div class="kpi-meta">
                <span class="trend-up"
                  ><el-icon><CaretTop /></el-icon> 12.5%</span
                >
                <span class="period">较上月</span>
              </div>
            </div>
          </el-card>

          <el-card class="kpi-card">
            <div class="kpi-card-content">
              <div class="kpi-title">平均生产效率</div>
              <div class="kpi-value">{{ summaryData.avgEfficiency || 0 }}%</div>
              <div class="kpi-meta">
                <span class="trend-up"
                  ><el-icon><CaretTop /></el-icon> 3.2%</span
                >
                <span class="period">较上月</span>
              </div>
            </div>
          </el-card>

          <el-card class="kpi-card">
            <div class="kpi-card-content">
              <div class="kpi-title">生产合格率</div>
              <div class="kpi-value">{{ summaryData.qualifiedRate || 0 }}%</div>
              <div class="kpi-meta">
                <span class="trend-down"
                  ><el-icon><CaretBottom /></el-icon> 1.8%</span
                >
                <span class="period">较上月</span>
              </div>
            </div>
          </el-card>

          <el-card class="kpi-card">
            <div class="kpi-card-content">
              <div class="kpi-title">袋型产量占比</div>
              <div class="kpi-value">{{ summaryData.bagTypeRatio || 0 }}%</div>
              <div class="kpi-meta">
                <span class="trend-up"
                  ><el-icon><CaretTop /></el-icon> 5.7%</span
                >
                <span class="period">较上月</span>
              </div>
            </div>
          </el-card>
        </div>
      </section>

      <!-- 图表区域 -->
      <section class="charts-section">
        <div class="charts-grid">
          <!-- 袋型分布饼图 -->
          <el-card class="chart-card">
            <div class="chart-header">
              <h2 class="chart-title">袋型产量分布</h2>
              <el-select v-model="bagTypePeriod" size="small" @change="fetchData">
                <el-option label="日" value="day"></el-option>
                <el-option label="周" value="week"></el-option>
                <el-option label="月" value="month"></el-option>
              </el-select>
            </div>
            <div class="chart-container">
              <v-chart :option="bagTypePieOption" class="chart" :auto-resize="true" />
            </div>
          </el-card>

          <!-- 生产趋势图 -->
          <el-card class="chart-card">
            <div class="chart-header">
              <h2 class="chart-title">生产趋势</h2>
              <el-select
                v-model="selectedBagType"
                size="small"
                @change="updateTrendChart"
              >
                <el-option label="全部袋型" value="all"></el-option>
                <el-option
                  v-for="type in bagTypes"
                  :key="type"
                  :label="type"
                  :value="type"
                ></el-option>
              </el-select>
            </div>
            <div class="chart-container">
              <v-chart :option="trendLineOption" class="chart" :auto-resize="true" />
            </div>
          </el-card>

          <!-- 袋型详细数据表格 -->
          <el-card class="table-card">
            <div class="table-header">
              <h2 class="table-title">袋型生产数据明细</h2>
              <el-input
                v-model="searchKeyword"
                placeholder="搜索袋型..."
                size="small"
                class="table-search"
                prefix-icon="Search"
              />
            </div>
            <el-table
              :data="filteredBagTypeData"
              stripe
              border
              size="small"
              v-loading="loading"
            >
              <template #empty>
                <div class="empty-state">
                  <el-icon class="empty-icon"><WarningFilled /></el-icon>
                  <div class="empty-text">未找到生产数据，请检查日期范围或联系管理员</div>
                </div>
              </template>
              <el-table-column prop="id" label="ID" width="60"></el-table-column>
              <el-table-column prop="bagType" label="袋型名称"></el-table-column>
              <el-table-column prop="report_date" label="生产日期"></el-table-column>
              <el-table-column
                prop="productionQuantity"
                label="生产量"
                align="right"
                :formatter="formatNumber"
              ></el-table-column>
              <el-table-column prop="productionEfficiency" label="生产效率(%)">
                <template #default="scope"
                  >{{ scope.row.productionEfficiency }}%</template
                >
              </el-table-column>
              <el-table-column prop="passRate" label="合格率(%)">
                <template #default="scope">
                  <span
                    :class="
                      scope.row.passRate >= 98
                        ? 'text-success'
                        : scope.row.passRate >= 95
                        ? 'text-warning'
                        : 'text-danger'
                    "
                    >{{ scope.row.passRate }}%</span
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                :current-page="currentPage"
                :page-size="pageSize"
                :total="filteredBagTypeData.length"
                layout="total, sizes, prev, pager, next, jumper"
                prev-text="上一页"
                next-text="下一页"
                :page-sizes="[5, 10, 20, 50]"
                page-sizes-text="每页条数"
                total-text="共 {total} 条数据"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                size="small"
              ></el-pagination>
            </div>
          </el-card>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { use } from "echarts/core";
import { PieChart, LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";
import { Refresh, CaretTop, CaretBottom, Search } from "@element-plus/icons-vue";

// 注册ECharts组件
use([
  PieChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
  CanvasRenderer,
]);

// 导入API和组件
import { getProductionSummary, getProductionData } from "@/api/report";
import {
  ElDatePicker,
  ElButton,
  ElCard,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElSelect,
  ElOption,
  ElInput,
  ElMessage,
} from "element-plus";

// 状态变量
const dateRange = ref([]);
const summaryData = ref({});
const selectedBagType = ref("all");
const bagTypes = ref([]);
const isValidDate = (date) => !isNaN(date.getTime());
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 确保在setup顶层声明以自动暴露给模板
function formatNumber(row, column, value) {
  if (value === undefined || value === null) return "-";
  return Number(value).toLocaleString();
}

const bagTypeData = ref([]);
const totalCount = ref(0);

// 客户端搜索过滤
const filteredBagTypeData = computed(() => {
  if (!searchKeyword.value) return bagTypeData.value;
  const keyword = searchKeyword.value.toLowerCase();
  return bagTypeData.value.filter((item) =>
    item.bagType?.toLowerCase().includes(keyword)
  );
});

const searchKeyword = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const bagTypePeriod = ref("daily");
const trendType = ref("production");
const loading = ref(false);

// 图表配置
const bagTypePieOption = ref({});
const trendLineOption = ref({});

// 日期格式化工具函数
const formatDateISO = (date) => date.toISOString().split("T")[0];

// 获取汇总数据
const fetchSummaryData = async () => {
  try {
    loading.value = true;
    const params = dateRange.value
      ? {
          startDate: formatDateISO(dateRange.value[0]),
          endDate: formatDateISO(dateRange.value[1]),
        }
      : {};
    console.log("汇总数据API请求参数:", JSON.stringify(params, null, 2));
    console.log("搜索关键词状态:", {
      value: searchKeyword.value,
      hasValue: !!searchKeyword.value,
      formatted: searchKeyword.value ? `%${searchKeyword.value}%` : "undefined",
    });
    const response = await getProductionSummary(params);
    const summaryResponse = response.data;

    // 调试日志 - 检查API返回的原始数据
    console.log("完整API响应数据:", summaryResponse);

    // 获取详细生产数据用于计算KPI指标
    const kpiParams = dateRange.value
      ? {
          startDate: formatDateISO(dateRange.value[0]),
          endDate: formatDateISO(dateRange.value[1]),
          period: bagTypePeriod.value,

          // 调试日志：检查搜索关键词参数
          debugKeyword: searchKeyword.value,
        }
      : {
          period: bagTypePeriod.value,
        };
    const kpiDataResponse = await getProductionData(kpiParams);
    const productionRecords = Array.isArray(kpiDataResponse.data.records)
      ? kpiDataResponse.data.records
      : [];

    // 计算平均生产效率
    const efficiencyValues = productionRecords
      .filter((item) => item.completedQuantity > 0)
      .map((item) => (Number(item.completedQuantity) / (9.5 * 3000)) * 100);
    const avgEfficiency =
      efficiencyValues.length > 0
        ? (
            efficiencyValues.reduce((sum, val) => sum + val, 0) / efficiencyValues.length
          ).toFixed(2)
        : 0;

    // 计算平均合格率
    const passRateValues = productionRecords
      .filter((item) => item.completedQuantity > 0)
      .map((item) => {
        const completedQty = Number(item.completedQuantity) || 0;
        const defectCount = Number(item.defectCount) || 0;
        return completedQty > 0
          ? Math.max(0, ((completedQty - defectCount) / completedQty) * 100)
          : 0;
      });
    const qualifiedRate =
      passRateValues.length > 0
        ? (
            passRateValues.reduce((sum, val) => sum + val, 0) / passRateValues.length
          ).toFixed(2)
        : 0;

    // 计算袋型产量占比
    const totalProduction = productionRecords.reduce(
      (sum, item) => sum + Number(item.completedQuantity || 0),
      0
    );
    const bagTypeProduction = {};
    productionRecords.forEach((item) => {
      const type = item.bagType || "未知";
      bagTypeProduction[type] =
        (bagTypeProduction[type] || 0) + Number(item.completedQuantity || 0);
    });
    const maxTypeProduction =
      Object.values(bagTypeProduction).sort((a, b) => b - a)[0] || 0;
    const bagTypeRatio =
      totalProduction > 0 ? ((maxTypeProduction / totalProduction) * 100).toFixed(2) : 0;

    // 合并基础汇总数据和计算出的KPI指标
    summaryData.value = {
      ...summaryResponse,
      avgEfficiency: Number(avgEfficiency),
      qualifiedRate: Number(qualifiedRate),
      bagTypeRatio: Number(bagTypeRatio),
      totalProduction: totalProduction,
    };

    // 从records中提取并聚合袋型数据
    // 获取袋型分布数据
    // 合并日期范围和周期参数，确保数据正确过滤
    const distributionParams = dateRange.value
      ? {
          startDate: formatDateISO(dateRange.value[0]),
          endDate: formatDateISO(dateRange.value[1]),
          period: bagTypePeriod.value,
          keyword: searchKeyword.value ? `%${searchKeyword.value}%` : undefined,
        }
      : {
          period: bagTypePeriod.value,
          keyword: searchKeyword.value ? `%${searchKeyword.value}%` : undefined,
        };
    console.log("袋型分布API请求参数:", JSON.stringify(distributionParams, null, 2));
    console.log("搜索关键词状态:", {
      value: searchKeyword.value,
      hasValue: !!searchKeyword.value,
      formatted: searchKeyword.value ? `%${searchKeyword.value}%` : "undefined",
    });
    const distributionResponse = await getProductionData(distributionParams);
    console.log("完整袋型分布响应:", distributionResponse);
    console.log("袋型分布响应数据:", distributionResponse.data);
    // 直接从已知路径提取记录数据
    const records = Array.isArray(distributionResponse.data.records)
      ? distributionResponse.data.records
      : [];
    console.log("直接提取的记录数据:", records);
    console.log("记录数据长度:", records.length);
    console.log("第一条记录内容:", records[0]);
    // 检查记录数据结构
    console.log(
      "记录数据项详情:",
      records.map((item) => ({
        bagType: item.bagType,
        completedQuantity: item.completedQuantity,
      }))
    );
    const rawDistribution = records
      .map((item) => ({
        bagType: item.bagType,
        value: Number(item.completedQuantity) || 0,
      }))
      .filter((item) => item.bagType && item.value > 0);

    console.log("API响应可用属性:", Object.keys(response.data));

    console.log("原始数据长度:", rawDistribution.length);
    console.log("原始数据前两条:", rawDistribution.slice(0, 2));
    // 使用数组直接聚合袋型数据
    const uniqueDistribution = [];
    rawDistribution.forEach((item) => {
      const existingItem = uniqueDistribution.find((d) => d.name === item.bagType);
      if (existingItem) {
        existingItem.value += item.value;
      } else {
        uniqueDistribution.push({ name: item.bagType, value: item.value });
      }
    });
    // 提取唯一袋型列表
    bagTypes.value = [...new Set(bagTypeData.value.map((item) => item.bagType))];

    // 调试日志 - 检查处理后的唯一袋型数据
    console.log("处理后的唯一袋型数据:", uniqueDistribution);

    // 检查是否有数据，无数据时显示提示
    if (uniqueDistribution.length === 0) {
      console.warn("袋型数据为空，无法渲染饼图");
      ElMessage.warning("暂无袋型产量数据可供显示");
    }

    updateBagTypePieChart(uniqueDistribution);
  } catch (error) {
    console.error("获取汇总数据失败:", error);
    ElMessage.error(`获取汇总数据失败: ${error.message || "未知错误"}`);
  } finally {
    loading.value = false;
  }
};

// 获取袋型生产数据
const fetchBagTypeData = async () => {
  try {
    loading.value = true;
    const params = dateRange.value
      ? {
          startDate: formatDateISO(dateRange.value[0]),
          endDate: formatDateISO(dateRange.value[1]),
          period: bagTypePeriod.value,
          pageNum: currentPage.value,
          pageSize: pageSize.value,
        }
      : {
          period: bagTypePeriod.value,
          pageNum: currentPage.value,
          pageSize: pageSize.value,
          keyword: searchKeyword.value ? `%${searchKeyword.value}%` : undefined,
        };
    const response = await getProductionData(params);
    console.log("袋型数据API响应:", JSON.stringify(response.data, null, 2));
    console.log("分页参数:", {
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      totalCount: totalCount.value,
    });
    totalCount.value = response.data.total || 0;
    bagTypeData.value = (response.data.records || []).map((item) => {
      const completedQty = Number(item.completedQuantity) || 0;
      const defectCount = Number(item.defectCount) || 0;
      const date =
        typeof item.reportDate === "number"
          ? new Date(item.reportDate * 1000)
          : new Date(item.reportDate);
      return {
        ...item,
        report_date: item.reportDate ? (isValidDate(date) ? formatDate(date) : "-") : "-",
        productionQuantity: completedQty,
        productionEfficiency:
          completedQty > 0 ? ((completedQty / (9.5 * 3000)) * 100).toFixed(2) : "-", // 假设8小时工作制，标准产能125件/小时
        passRate:
          completedQty > 0
            ? Math.max(0, ((completedQty - defectCount) / completedQty) * 100).toFixed(2)
            : "-",
      };
    });
    updateTrendChart();
  } catch (error) {
    console.error("获取袋型数据失败:", error);
    ElMessage.error(`获取袋型数据失败: ${error.message || "未知错误"}`);
  } finally {
    loading.value = false;
  }
};

// 统一数据获取方法
const fetchData = () => {
  fetchSummaryData();
  fetchBagTypeData();
};

// 更新袋型分布饼图
const updateBagTypePieChart = (distributionData) => {
  // 检查数据是否为空
  if (!distributionData || distributionData.length === 0) {
    bagTypePieOption.value = {
      graphic: {
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: "暂无袋型产量数据",
          fontSize: 14,
          fontWeight: "normal",
          fill: "#909399",
        },
      },
      series: [],
    };
    return;
  }

  bagTypePieOption.value = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: 10,
      textStyle: { fontSize: 12 },
    },
    series: [
      {
        name: "袋型产量",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: distributionData,
      },
    ],
    color: ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C", "#909399", "#C0C4CC"],
  };
};

// 准备图表数据
const prepareChartData = (data, selectedType) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.report_date) - new Date(b.report_date)
  );
  const dates = [...new Set(sortedData.map((item) => item.report_date))];

  // 根据选择的袋型筛选数据
  let filteredData = sortedData;
  if (selectedType !== "all") {
    filteredData = sortedData.filter((item) => item.bagType === selectedType);
  }

  const bagTypes = [...new Set(filteredData.map((item) => item.bagType))];
  return { sortedData, filteredData, dates, bagTypes };
};

// 更新趋势图表 - 按袋型分组显示产量趋势
const updateTrendChart = () => {
  if (!bagTypeData.value.length) {
    // 无数据时显示提示
    // 添加加载动画配置
    trendLineOption.value = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "#409EFF",
        borderWidth: 1,
        padding: 10,
        textStyle: { color: "#303133" },
        formatter: (params) => {
          let html = `${params[0].name}<br/>`;
          params.forEach((item) => {
            html += `<div style='display:flex;align-items:center;margin:4px 0'>
                      <span style='display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.color};margin-right:5px;'></span>
                      ${item.seriesName}: ${item.value}件
                    </div>`;
          });
          return html;
        },
      },
      loading: {
        show: loading.value,
        text: "数据加载中...",
        color: "#409EFF",
        textColor: "#606266",
        maskColor: "rgba(255, 255, 255, 0.8)",
        zlevel: 0,
      },
      graphic: {
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: "暂无生产趋势数据\n请选择其他日期范围或袋型",
          fontSize: 14,
          fontWeight: "normal",
          fill: "#909399",
          lineHeight: 24,
        },
      },
      series: [],
    };
    return;
  }

  const { sortedData, filteredData, dates, bagTypes: chartBagTypes } = prepareChartData(
    bagTypeData.value,
    selectedBagType.value
  );

  // 如果筛选后无数据
  if (!filteredData.length) {
    trendLineOption.value = {
      graphic: {
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: `所选袋型暂无数据\n请选择其他袋型或日期范围`,
          fontSize: 14,
          fontWeight: "normal",
          fill: "#909399",
          lineHeight: 24,
        },
      },
      series: [],
    };
    return;
  }

  // 准备图表颜色
  const colors = [
    "#409EFF",
    "#67C23A",
    "#E6A23C",
    "#F56C6C",
    "#909399",
    "#C0C4CC",
    "#722ED1",
    "#13C2C2",
  ];

  // 按袋型分组数据
  const series = chartBagTypes.map((type, index) => {
    return {
      name: type,
      type: "line",
      data: dates.map((date) => {
        const dayData = sortedData.find(
          (item) => item.report_date === date && item.bagType === type
        );
        return dayData ? dayData.productionQuantity : 0;
      }),
      smooth: true,
      itemStyle: { color: colors[index % colors.length] },
      lineStyle: { width: 2 },
      markPoint: {
        data: [
          { type: "max", name: "最大值" },
          { type: "min", name: "最小值" },
        ],
      },
      markLine: {
        data: [{ type: "average", name: "平均值" }],
      },
    };
  });

  trendLineOption.value = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: "{b}<br/>{a}: {c}",
    },
    legend: {
      data: chartBagTypes,
      top: 0,
      textStyle: { fontSize: 12 },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: { rotate: 30, interval: 0, fontSize: 12 },
    },
    yAxis: {
      type: "value",
      name: "生产量",
      nameTextStyle: { fontSize: 12 },
      min: 0,
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
      {
        type: "inside",
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
    ],
    series: series,
  };
};

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // 重置为第一页
  fetchData();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchData();
};

// 页面加载时初始化
onMounted(() => {
  // 设置默认日期范围为最近30天
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);
  dateRange.value = [startDate, endDate];
  fetchData();
});
</script>

<style scoped>
/* 基础样式 */
.dashboard-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  color: #303133;
}

/* 头部样式 */
.dashboard-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  padding: 0 20px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.dashboard-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.date-picker {
  width: 280px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 主要内容区 */
.dashboard-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* KPI指标区 */
.kpi-section {
  margin-bottom: 24px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.kpi-card {
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.kpi-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.kpi-card-content {
  padding: 16px;
}

.kpi-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #303133;
}

.kpi-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.trend-up {
  color: #67c23a;
}

.trend-down {
  color: #f56c6c;
}

.period {
  color: #909399;
}

/* 图表区域 */
.charts-section {
  margin-bottom: 24px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 20px;
}

.chart-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.chart-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.chart-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.chart-container {
  padding: 16px;
  height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
}

/* 表格区域 */
.table-card {
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.table-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.table-search {
  width: 200px;
}

.pagination {
  padding: 12px 16px;
  text-align: right;
  border-top: 1px solid #f0f0f0;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 12px 0;
    gap: 12px;
  }

  .dashboard-title {
    align-self: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .date-picker {
    width: 100%;
  }

  .kpi-grid {
    grid-template-columns: 1fr 1fr;
  }

  .chart-container {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-main {
    padding: 12px;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
