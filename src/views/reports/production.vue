<template>
  <div class="production-report-container">
    <div class="report-header">
      <h1 class="report-title">产能报表管理</h1>
      <div class="report-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入关键词搜索"
          class="search-input"
          clearable
        />
        <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="success" icon="Download" @click="handleExport"
          >导出报表</el-button
        >
      </div>
    </div>

    <el-table :data="tableData" border stripe class="report-table">
      <el-table-column prop="id" label="ID" align="center" width="80" />
      <el-table-column
        prop="reportDate"
        label="报表日期"
        align="center"
        :formatter="(row) => formatReportDate(row.reportDate)"
      />
      <el-table-column prop="shift" label="班次" align="center" />
      <el-table-column prop="machineId" label="机台" align="center" />
      <el-table-column prop="pickerName" label="捡袋员" align="center" />
      <el-table-column prop="machineOperator" label="机长" align="center" />
      <el-table-column prop="machineSpeed" label="机速" align="center" />
      <el-table-column prop="productionOrderNumber" label="生产单号" align="center" />
      <el-table-column prop="bagType" label="袋型" align="center" />
      <el-table-column
        prop="finishedProductSpecification"
        label="成品规格"
        align="center"
      />
      <el-table-column prop="incomingMaterialLength" label="来料米数" align="center" />
      <el-table-column prop="setupMaterialLength" label="调机米数" align="center" />
      <el-table-column prop="endMaterialLength" label="结束米数" align="center" />
      <el-table-column prop="completedQuantity" label="完成数量" align="center" />
      <el-table-column prop="scrapMaterialLength" label="废料" align="center" />
      <el-table-column prop="remainingMaterialLength" label="余料" align="center" />
      <el-table-column
        prop="workStartTime"
        label="工时起"
        align="center"
        :formatter="(row) => formatDate(row.workStartTime)"
      />
      <el-table-column
        prop="workEndTime"
        label="工时止"
        align="center"
        :formatter="(row) => formatDate(row.workEndTime)"
      />
      <el-table-column prop="anomalyReason" label="异常原因" align="center" />
      <el-table-column prop="defectCount" label="不良产品数量" align="center" />
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-button
            type="primary"
            icon="Edit"
            size="small"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="Delete"
            size="small"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="formData" ref="formRef" :rules="formRules" label-width="120px">
        <el-form-item label="报表日期" prop="reportDate">
          <el-date-picker
            v-model="formData.reportDate"
            type="datetime"
            placeholder="请选择报表日期"
          />
        </el-form-item>
        <el-form-item label="班次" prop="shift">
          <el-select v-model="formData.shift" placeholder="请选择班次">
            <el-option label="白班" value="白班" />
            <el-option label="夜班" value="夜班" />
          </el-select>
        </el-form-item>
        <el-form-item label="机台" prop="machineId">
          <el-select v-model="formData.machineId" placeholder="请选择机台">
            <el-option label="1号机" value="1号机" />
            <el-option label="2号机" value="2号机" />
            <el-option label="3号机" value="3号机" />
            <el-option label="4号机" value="4号机" />
            <el-option label="5号机" value="5号机" />
            <el-option label="6号机" value="6号机" />
            <el-option label="7号机" value="7号机" />
            <el-option label="8号机" value="8号机" />
          </el-select>
        </el-form-item>
        <el-form-item label="捡袋员" prop="pickerName">
          <el-input v-model="formData.pickerName" placeholder="请输入捡袋员" />
        </el-form-item>
        <el-form-item label="机长" prop="machineOperator">
          <el-input v-model="formData.machineOperator" placeholder="请输入机长" />
        </el-form-item>
        <el-form-item label="袋型" prop="bagType">
          <el-input v-model="formData.bagType" placeholder="请输入袋型" />
        </el-form-item>
        <el-form-item label="异常原因" prop="anomalyReason">
          <el-input v-model="formData.anomalyReason" placeholder="请输入异常原因" />
        </el-form-item>
        <el-form-item label="机器速度" prop="machineSpeed">
          <el-input v-model.number="formData.machineSpeed" placeholder="请输入机器速度" />
        </el-form-item>
        <el-form-item label="生产单号" prop="productionOrderNumber">
          <el-input
            v-model="formData.productionOrderNumber"
            placeholder="请输入生产单号"
          />
        </el-form-item>
        <el-form-item label="成品规格" prop="finishedProductSpecification">
          <el-input
            v-model="formData.finishedProductSpecification"
            placeholder="请输入成品规格"
          />
        </el-form-item>
        <el-form-item label="来料米数" prop="incomingMaterialLength">
          <el-input
            v-model.number="formData.incomingMaterialLength"
            placeholder="请输入来料米数"
          />
        </el-form-item>
        <el-form-item label="调机米数" prop="setupMaterialLength">
          <el-input
            v-model.number="formData.setupMaterialLength"
            placeholder="请输入调机米数"
          />
        </el-form-item>
        <el-form-item label="结束米数" prop="endMaterialLength">
          <el-input
            v-model.number="formData.endMaterialLength"
            placeholder="请输入结束米数"
          />
        </el-form-item>
        <el-form-item label="废料米数" prop="scrapMaterialLength">
          <el-input
            v-model.number="formData.scrapMaterialLength"
            placeholder="请输入废料米数"
          />
        </el-form-item>
        <el-form-item label="工时起" prop="workStartTime">
          <el-date-picker
            v-model="formData.workStartTime"
            type="datetime"
            placeholder="请选择工时起"
          />
        </el-form-item>
        <el-form-item label="工时止" prop="workEndTime">
          <el-date-picker
            v-model="formData.workEndTime"
            type="datetime"
            placeholder="请选择工时止"
          />
        </el-form-item>
        <el-form-item label="剩余料长" prop="remainingMaterialLength">
          <el-input
            v-model.number="formData.remainingMaterialLength"
            placeholder="请输入剩余料长"
          />
        </el-form-item>
        <el-form-item label="完成数量" prop="completedQuantity">
          <el-input
            v-model.number="formData.completedQuantity"
            placeholder="请输入完成数量"
          />
        </el-form-item>
        <el-form-item label="不良数量" prop="defectCount">
          <el-input v-model.number="formData.defectCount" placeholder="请输入不良数量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// 导入语句部分
import { ref, reactive, onMounted, getCurrentInstance, watch } from "vue";
import { isValid } from "date-fns";
import { ElMessage, ElMessageBox } from "element-plus";
import { getProductionData, createProduction, updateProduction, deleteProduction } from "@/api/report";
import { getToken } from "@/utils/auth";
import { exportJsonToExcel } from "@/utils/exportExcel";

const { proxy } = getCurrentInstance();

// 日期格式化函数
const formatDate = (dateValue) => {
  if (!dateValue) return "";

  // 参考dashboard/index.vue的日期处理方式 - 支持Date对象、字符串和数字时间戳
  let dateStr;
  if (dateValue instanceof Date) {
    dateStr = dateValue.toISOString();
  } else if (typeof dateValue === "string") {
    dateStr = dateValue;
  } else if (typeof dateValue === "number") {
    // 处理数字类型的时间戳（支持秒级和毫秒级）
    let timestamp = dateValue;
    // 若为10位数字则视为秒级时间戳，转换为毫秒
    if (timestamp.toString().length === 10) {
      timestamp *= 1000;
    }
    dateStr = new Date(timestamp).toISOString();
  } else {
    return "";
  }

  // 分割日期和时间部分
  const [datePart, timePart] = dateStr.split("T");
  if (datePart && timePart) {
    // 移除毫秒和时区信息，保留小时和分钟
    const cleanTime = timePart.split(/[.+-]/)[0].substring(0, 5);
    return `${datePart} ${cleanTime}`;
  }

  return datePart || "";
};

const formatReportDate = (dateValue) => {
  if (!dateValue) return "";
  const dateStr = dateValue instanceof Date ? dateValue.toISOString() : String(dateValue);
  const [datePart] = dateStr.split("T");
  return datePart || "";
};

// 表格数据
const tableData = ref([]);
// 搜索关键词
const searchKeyword = ref("");
// 分页参数
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
// 对话框状态
const dialogVisible = ref(false);
// 对话框标题
const dialogTitle = ref("新增产能数据");
// 表单数据
const formData = reactive({
  id: null,
  reportDate: "",
  shift: "",
  machineId: "",
  pickerName: "",
  machineOperator: "",
  machineSpeed: null,
  productionOrderNumber: "",
  bagType: "",
  finishedProductSpecification: "",
  incomingMaterialLength: null,
  setupMaterialLength: null,
  endMaterialLength: null,
  scrapMaterialLength: null,
  remainingMaterialLength: null,
  workStartTime: "",
  workEndTime: "",
  anomalyReason: "",
  completedQuantity: null,
  defectCount: null,
});
// 表单引用
const formRef = ref(null);
// 表单规则
const formRules = reactive({
  reportDate: [{ required: true, message: "请选择报表日期", trigger: "change" }],
  shift: [{ required: true, message: "请选择班次", trigger: "change" }],
  machineId: [{ required: true, message: "请选择机台", trigger: "change" }],
  workStartTime: [{ required: true, message: "请选择工时起", trigger: "change" }],
  workEndTime: [{ required: true, message: "请选择工时止", trigger: "change" }],

  machineSpeed: [
    { required: true, message: "请输入机器速度", trigger: "blur" },
    { type: "number", message: "机器速度必须为数字", trigger: "blur" },
  ],
  productionOrderNumber: [{ required: true, message: "请输入生产单号", trigger: "blur" }],
  pickerName: [{ required: true, message: "请输入操作员", trigger: "blur" }],
  machineOperator: [{ required: true, message: "请输入机长", trigger: "blur" }],
  bagType: [{ required: true, message: "请输入袋型", trigger: "blur" }],
  completedQuantity: [
    { required: true, message: "请输入完成数量", trigger: "blur" },
    { type: "number", message: "完成数量必须为数字", trigger: "blur" },
  ],
  defectCount: [
    { required: true, message: "请输入不良数量", trigger: "blur" },
    { type: "number", message: "不良数量必须为数字", trigger: "blur" },
  ],
  scrapMaterialLength: [
    { required: true, message: "请输入废料米数", trigger: "blur" },
    { type: "number", message: "废料米数必须为数字", trigger: "blur" },
  ],
  setupMaterialLength: [
    { required: true, message: "请输入调机米数", trigger: "blur" },
    { type: "number", message: "调机米数必须为数字", trigger: "blur" },
  ],
});

// 页面加载时获取数据
onMounted(() => {
  fetchTableData();
});

// 获取表格数据
const fetchTableData = async () => {
  try {
    const params = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      keyword: searchKeyword.value || '',
    };
    const response = await getProductionData(params);
    tableData.value = response.data.records;
    pagination.total = response.data.total;
  } catch (error) {
    ElMessage.error("获取数据失败: " + (error.message || "网络错误"));
  }
};

// 搜索按钮点击事件
const handleSearch = () => {
  if (!searchKeyword.value) {
    ElMessage.warning("请输入搜索关键词");
    return;
  }
  pagination.pageNum = 1; // 重置页码
  fetchTableData();
};

watch(searchKeyword, (newVal) => {
  if (newVal === '') {
    fetchTableData();
  }
});
// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val;
  fetchTableData();
};

// 当前页码改变
const handleCurrentChange = (val) => {
  pagination.pageNum = val;
  fetchTableData();
};

// 新增按钮点击事件
const handleAdd = () => {
  dialogTitle.value = "新增产能数据";
  formData.id = null;
  formData.reportDate = "";
  formData.shift = "";
  formData.machineId = "";
  formData.pickerName = "";
  formData.machineOperator = "";
  formData.machineSpeed = null;
  formData.productionOrderNumber = "";
  formData.bagType = "";
  formData.finishedProductSpecification = "";
  formData.incomingMaterialLength = null;
  formData.setupMaterialLength = null;
  formData.endMaterialLength = null;
  formData.scrapMaterialLength = null;
  formData.remainingMaterialLength = null;
  formData.workStartTime = "";
  formData.workEndTime = "";
  formData.anomalyReason = "";
  formData.completedQuantity = null;
  formData.defectCount = null;
  dialogVisible.value = true;
};

// 编辑按钮点击事件
const handleEdit = (row) => {
  if (!row || !row.id) {
    ElMessage.error("无效的记录数据，无法编辑");
    return;
  }
  dialogTitle.value = "编辑产能数据";
  formData.id = row.id;
  formData.reportDate = row.reportDate ? (new Date(row.reportDate).toString() !== 'Invalid Date' ? new Date(row.reportDate) : null) : null;
  formData.shift = row.shift;
  formData.machineId = row.machineId;
  formData.pickerName = row.pickerName;
  formData.bagType = row.bagType;
  formData.machineOperator = row.machineOperator;
  formData.finishedProductSpecification = row.finishedProductSpecification;
  formData.incomingMaterialLength = Number(row.incomingMaterialLength);
  formData.endMaterialLength = Number(row.endMaterialLength);
  formData.remainingMaterialLength = Number(row.remainingMaterialLength);
  formData.scrapMaterialLength = Number(row.scrapMaterialLength);
  formData.setupMaterialLength = Number(row.setupMaterialLength);
  formData.machineSpeed = Number(row.machineSpeed);
  formData.productionOrderNumber = row.productionOrderNumber;
  formData.completedQuantity = Number(row.completedQuantity);
  formData.defectCount = Number(row.defectCount);
  formData.anomalyReason = row.anomalyReason;
  formData.workStartTime = row.workStartTime ? (new Date(row.workStartTime).toString() !== 'Invalid Date' ? new Date(row.workStartTime) : null) : null;
  formData.workEndTime = row.workEndTime ? (new Date(row.workEndTime).toString() !== 'Invalid Date' ? new Date(row.workEndTime) : null) : null;
  dialogVisible.value = true;
};

// 删除按钮点击事件
const handleDelete = async (id) => {
  if (!id) {
    ElMessage.error("无效的记录ID，无法删除");
    return;
  }
  try {
    await ElMessageBox.confirm("确定要删除这条数据吗？", "确认删除", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    console.log('删除请求参数:', id);
    const deleteResponse = await deleteProduction(id, { headers: { Authorization: `Bearer ${getToken()}` } });
    console.log('删除响应:', deleteResponse);
    ElMessage.success("删除成功");
    fetchTableData();
  } catch (error) {
    if (error.toString() !== "Cancel") {
      console.error('完整错误信息:', error);
      const status = error.response?.status || '未知状态码';
      const statusText = error.response?.statusText || '未知状态文本';
      const errorDetails = error.response?.data || {};
      const errorMsg = errorDetails.message || error.message || "操作失败";
      ElMessage.error(`删除失败: ID=${id}, 状态码: ${status}, 状态文本: ${statusText}, 错误详情: ${JSON.stringify(errorDetails)}`);
    }
  }
};

// 保存按钮点击事件
const handleSave = async () => {
  try {
    await formRef.value.validate();

    const formDataCopy = {
    ...formData,
    reportDate: formData.reportDate && !isNaN(formData.reportDate.getTime()) ? formData.reportDate.toISOString() : null,
    workStartTime: formData.workStartTime && !isNaN(formData.workStartTime.getTime()) ? formData.workStartTime.toISOString() : null,
    workEndTime: formData.workEndTime && !isNaN(formData.workEndTime.getTime()) ? formData.workEndTime.toISOString() : null
  };
  // 移除id和null值
  if (formData.id) delete formDataCopy.id;
  Object.keys(formDataCopy).forEach(key => {
    if (formDataCopy[key] === null || formDataCopy[key] === undefined) {
      delete formDataCopy[key];
    }
  });

    if (formData.id) {
      // 编辑
      console.log('更新请求参数 - ID:', formData.id, '数据:', formDataCopy);
      const updateResponse = await updateProduction(formData.id, formDataCopy, { headers: { Authorization: `Bearer ${getToken()}` } });
      console.log('更新响应:', updateResponse);
      ElMessage.success("更新成功");
    } else {
      // 新增
      await createProduction(formDataCopy);
      ElMessage.success("新增成功");
    }

    dialogVisible.value = false;
    fetchTableData();
  } catch (error) {
    if (error.name !== "ValidationError") {
      console.error('完整错误信息:', error);
      const status = error.response?.status || '未知状态码';
      const statusText = error.response?.statusText || '未知状态文本';
      const errorDetails = error.response?.data || {};
      const errorMsg = errorDetails.message || error.message || "操作失败";
      ElMessage.error(`保存失败: ID=${formData.id}, 状态码: ${status}, 状态文本: ${statusText}, 错误详情: ${JSON.stringify(errorDetails)}`);
    }
  }
};

// 导出报表按钮点击事件
const handleExport = async () => {
  try {
    // 获取所有数据用于导出
    const params = {
      pageNum: 1,
      pageSize: 9999,
      keyword: searchKeyword.value || '',
    };
    console.log('导出请求参数:', params);
    const response = await getProductionData(params);
    console.log('API响应类型:', typeof response);
    console.log('API响应顶层结构:', Object.keys(response));

    // 扩展可能的数据提取路径，适配更多API响应格式
    const possibleDataPaths = [
      response.data?.records,
      response.records,
      response.data?.data,
      response.data,
      response.content?.records,
      response.result?.records,
      response.rows,
      response.data?.rows,
      response.items,
      response
    ];

    let exportData = [];
    for (const path of possibleDataPaths) {
      if (Array.isArray(path) && path.length > 0) {
        exportData = path;
        console.log('找到有效数据路径，数据长度:', exportData.length);
        break;
      }
    }

    // 最终验证数据是否为数组且有数据
    if (!Array.isArray(exportData) || exportData.length === 0) {
      console.error('数据提取失败，数据类型:', typeof exportData, '长度:', exportData.length);
      ElMessage.warning('没有可导出的数据');
      return;
    }

    console.log('提取数据长度:', exportData.length);
    console.log('提取数据示例:', JSON.stringify(exportData[0] || {}));

    // 准备导出表头和数据格式
    const headers = [
      "ID", "报表日期", "班次", "机台", "捡袋员", "机长", 
      "机速", "生产单号", "袋型", "成品规格", "来料米数", 
      "调机米数", "结束米数", "完成数量", "废料米数", "余料", 
      "工时起", "工时止", "异常原因", "不良产品数量"
    ];
    
    // 映射导出数据为对象数组格式，确保与表头字段匹配
    const data = exportData.map((item, index) => {
      try {
        return {
          "ID": item.id ?? item.ID ?? 'N/A',
          "报表日期": formatDate(item.reportDate || item.report_date) || 'N/A',
          "班次": item.shift || item.class || 'N/A',
          "机台": item.machineId || item.machine_id || 'N/A',
          "捡袋员": item.pickerName || item.picker_name || 'N/A',
          "机长": item.machineOperator || item.machine_operator || 'N/A',
          "机速": item.machineSpeed || item.machine_speed || 'N/A',
          "生产单号": item.productionOrderNumber || item.production_order_number || 'N/A',
          "袋型": item.bagType || item.bag_type || 'N/A',
          "成品规格": item.finishedProductSpecification || item.finished_product_specification || 'N/A',
          "来料米数": item.incomingMaterialLength || item.incoming_material_length || 'N/A',
          "调机米数": item.setupMaterialLength || item.setup_material_length || 'N/A',
          "结束米数": item.endMaterialLength || item.end_material_length || 'N/A',
          "完成数量": item.completedQuantity || item.completed_quantity || 'N/A',
          "废料米数": item.scrapMaterialLength || item.scrap_material_length || 'N/A',
          "余料": item.remainingMaterialLength || item.remaining_material_length || 'N/A',
          "工时起": formatDate(item.workStartTime || item.work_start_time) || 'N/A',
          "工时止": formatDate(item.workEndTime || item.work_end_time) || 'N/A',
          "异常原因": item.anomalyReason || item.anomaly_reason || 'N/A',
          "不良产品数量": item.defectCount || item.defect_count || 'N/A',
        };
      } catch (e) {
        console.error(`第${index+1}条数据映射失败:`, e);
        // 创建错误对象，保持与表头结构一致
        const errorObj = {};
        headers.forEach(header => errorObj[header] = '数据错误');
        return errorObj;
      }
    });
    
    // 验证最终导出数据
    console.log('最终导出数据行数:', data.length);
    if (data.length === 0) {
      ElMessage.error('数据处理失败，无法生成导出内容');
      return;
    }

    // 调用导出工具，使用正确的对象参数格式
    exportJsonToExcel({
      header: headers,
      data: data,
      filename: '产能报表'
    });
    ElMessage.success(`导出成功，共导出${data.length}条数据`);
  } catch (error) {
    ElMessage.error(`导出失败: ${error.message || '未知错误'}`);
  }
};
</script>

<style scoped>
.production-report-container {
  padding: 20px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.report-title {
  margin: 0;
  font-size: 24px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.report-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 280px;
}

.report-table {
  width: 100%;
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
