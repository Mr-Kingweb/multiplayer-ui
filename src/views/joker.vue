<template>
  <el-table
    :data="tableData"
    style="width: 100%; height: calc(100vh - 210px)"
    fit="false"
    stripe="true"
  >
    <!--数据筛选 条件在表格里实现；实现数据操作（删除，编辑 ，保存数据）  -->
    <el-table-column
      show-overflow-tooltip="true"
      sortable
      fixed
      prop="orderNumber"
      label="订单单号"
      width="220px"
    >
      <template #default="scope">
        <el-input
          v-model="scope.row.orderNumber"
          placeholder="请输入订单单号"
        ></el-input>
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip="true"
      sortable
      prop="boxOrWorkerNumber"
      label="箱号/工号"
      width="220px"
    >
      <template #default="scope">
        <el-input
          v-model="scope.row.boxOrWorkerNumber"
          placeholder="请输入箱号/工号"
          ref="boxOrWorkerInput"
          @mousedown.left="startDragLeft(scope)"
          @keyup.down="startDragRight(scope,$event)"
          @mousemove="handleDrag(scope)"
          @mouseup="endDrag(scope.$index)"
        ></el-input>
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip="true"
      sortable
      prop="productionTime"
      label="生产时间"
      width="120px"
      ><template #default="scope">
        <el-input
          v-model="scope.row.productionTime"
          placeholder="请输入生产时间"
        ></el-input> </template
    ></el-table-column>
    <el-table-column
      show-overflow-tooltip="true"
      sortable
      prop="tableNumber"
      fixed="right"
      label="表号"
      width="220px"
      ><template #default="scope">
        <el-input
          v-model="scope.row.tableNumber"
          placeholder="请输入表号"
          ref="tableNumberInput"
          @keyup.enter="addRow(scope.row, scope.$index)"
        ></el-input> </template
    ></el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, Ref, nextTick } from "vue";
import { onMounted } from "vue";
import axios from "axios";
import {
  Menu as IconMenu,
  Location,
  EditPen,
  Upload,
  InfoFilled,
  DArrowRight,
  DArrowLeft,
  Setting,
} from "@element-plus/icons-vue";
interface Form {
  orderNumber: string;
  tableNumber: string;
  boxOrWorkerNumber: string;
  id?: null | number;
  operatorId?: null | number;
  productionTime?: Date; // 添加 productionTime 属性的类型定义
}
const tableData = ref<Form[]>([]);
const username = ref("");
const tableNumberInput = ref<HTMLInputElement | null>(null);

const boxOrWorkerInput = ref<HTMLInputElement | null>(null);
const startRowIndex = ref<number | null>(null);
const isDragging = ref(false);
const copiedText = ref(""); // 用于存储复制的文本
const startRowIndex1 = ref<number | null>(null);
const isDragging1 = ref(false);
const copiedText1 = ref(""); // 用于存储复制的文本
const copiedTextOrigin = ref(""); // 用于存储复制的文本

const startDragLeft = (scope: any) => {
  startRowIndex.value = scope.$index;
  isDragging.value = true;
  copiedText.value = scope.row.boxOrWorkerNumber;
};
const startDragRight = (scope: any,event: MouseEvent) => {
  startRowIndex1.value = scope.$index;
  isDragging1.value = true;
  copiedTextOrigin.value = scope.row.boxOrWorkerNumber;
  event.preventDefault();
};

const handleDrag = (scope: any) => {
  if (isDragging.value) {
    boxOrWorkerInput.value = scope.$index;
    const currentIndex = boxOrWorkerInput.value;
    if (
      currentIndex !== null &&
      startRowIndex.value !== null &&
      +currentIndex !== startRowIndex.value
    ) {
      const startIndex = Math.min(startRowIndex.value, +currentIndex);
      const endIndex = Math.max(startRowIndex.value, +currentIndex);
      for (let i = startIndex; i <= endIndex; i++) {
        tableData.value[i].boxOrWorkerNumber = copiedText.value;
      }
    }
  }
  if (isDragging1.value) {
    boxOrWorkerInput.value = scope.$index;
    const currentIndex = boxOrWorkerInput.value;
    if (
      currentIndex !== null &&
      startRowIndex1.value !== null &&
      +currentIndex !== startRowIndex1.value
    ) {
      const startIndex = Math.min(startRowIndex1.value, +currentIndex);
      const endIndex = Math.max(startRowIndex1.value, +currentIndex);
      for (let i = startIndex + 1; i <= endIndex; i++) {
        let arr = copiedTextOrigin.value.split("-");
        let lastNumber = Number(arr[arr.length - 1]) + 1;
        arr[arr.length - 1] = lastNumber.toString();
        let finish = arr.join("-");
        copiedText1.value = finish;
        tableData.value[i].boxOrWorkerNumber = copiedText1.value;
      }
    }
  }
};
const endDrag = (endIndex: number) => {
  if (isDragging.value) {
    startRowIndex.value = null;
    isDragging.value = false;
    copiedText.value = "";
  }
  if (isDragging1.value) {
    startRowIndex1.value = null;
    isDragging1.value = false;
    copiedText1.value = "";
    copiedTextOrigin.value = "";
  }
};
onMounted(async () => {
  await axios
    .get("/api/getByOperatorId", {
      params: {
        username: username.value,
        operatorId: 1048,
      },
    })
    .then((response: { data: any }) => {
      tableData.value = response.data.body.data.map((item: any) => {
        const date = new Date(item.productionTime.replace("T", " "));
        item.productionTime = formatter(date);
        return item;
      });
    });
});
const formatter = (date: Date) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const addRow = (rowData: Form, index: number) => {
  // 创建一个新的对象，复制 rowData 的所有字段
  let newRow = { ...rowData };
  // 清空新行的表号
  newRow.tableNumber = "";
  newRow.id = null;
  // 将新行添加到表格数据中
  tableData.value.push(newRow);
  nextTick(() => {
    // 将光标设置到新行的表号输入框中
    if (tableNumberInput.value !== null) {
      tableNumberInput.value.focus();
    }
  });
};
</script>
