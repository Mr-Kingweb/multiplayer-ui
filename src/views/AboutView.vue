<template>
  <el-container class="container-full-height">
    <el-header
      style="
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      <!-- 左侧，下午好和用户名 -->
      <div style="margin-left: 20px; display: flex; align-items: center">
        <span style="font-size: 20px">{{ greeting }}</span>
        <span style="font-size: 24px; color: #a67f5a">{{ username }}</span>
      </div>

      <!-- 右侧，退出登录和设置图标 -->
      <div style="margin-right: 20px; display: flex; align-items: center">
        <!-- Logout button -->
        <el-button @click="exportExcel" style="margin-right: 20px" round>
          <el-icon><Upload /></el-icon>
          数据导出</el-button
        >
        <el-button @click="logout" type="text"
          ><span style="font-size: 20px">退出登录</span></el-button
        >
        <!-- Settings icon -->
      </div>
    </el-header>
    <el-divider />
    <el-container>
      <el-aside>
        <div style="display: flex; flex-direction: column">
          <el-radio-group
            v-model="isCollapse"
            style="margin-left: 20px; margin-bottom: 20px"
          >
            <el-radio-button :label="false"
              ><el-icon> <DArrowRight /> </el-icon
            ></el-radio-button>
            <el-radio-button :label="true"
              ><el-icon> <DArrowLeft /> </el-icon
            ></el-radio-button>
          </el-radio-group>
          <el-menu
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <location />
                </el-icon>
                <span>功能板块</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" @click="selectedItem = 'scanBox'"
                  >扫码装箱</el-menu-item
                >
                <el-menu-item index="1-2" @click="selectedItem = 'checkRecord'"
                  >装箱单号</el-menu-item
                >
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </div>
      </el-aside>

      <el-container
        :style="{
          'margin-left': isCollapse ? '-200px' : '-100px',
          'margin-top': '-30px',
        }"
      >
        <el-main>
          <div v-if="selectedItem === 'scanBox'">
            <div style="display: flex; align-items: center">
              <el-button type="primary" size="large" @click="insertPack" plain
                >添加装箱</el-button
              >
            </div>

            <!-- 扫码装箱的内容 -->
            <el-table
              :data="packData"
              style="width: 100%; height: calc(100vh - 210px)"
              fit="false"
              stripe="true"
            >
              <!--数据筛选 条件在表格里实现；实现数据操作（删除，编辑 ，保存数据）  -->
              <el-table-column
                show-overflow-tooltip="true"
                sortable
                fixed
                prop="id"
                label="序号"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip="true"
                sortable
                prop="deviceCount"
                label="设备数量"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip="true"
                sortable
                prop="operatorId"
                label="操作人员"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip="true"
                sortable
                fixed="right"
                prop="packingTime"
                label="生产时间"
              ></el-table-column>
              <el-table-column
                #default="scope"
                fixed="right"
                prop=""
                label="操作"
              >
                <!-- 编辑 -->
                <el-button
                  type="primary"
                  style="margin-right: 8px"
                  :icon="Edit"
                  @click="open1(scope.$index)"
                  circle
                />

                <el-popconfirm
                  confirm-button-text="Yes"
                  cancel-button-text="No"
                  :icon="InfoFilled"
                  icon-color="#626AEF"
                  title="确认删除该数据吗?"
                  @confirm="deleteRow2(scope.$index)"
                  @cancel="cancelEvent"
                >
                  <template #reference>
                    <el-button type="danger" :icon="Delete" circle />
                  </template>
                </el-popconfirm>
              </el-table-column>
            </el-table>
          </div>

          <div v-if="selectedItem === 'checkRecord'">
            <div style="display: flex; align-items: center">
              <el-button size="large" @click="backPack" plain>返回</el-button>
              <el-button
                type="primary"
                size="large"
                @click="saveOrderInfo"
                plain
                >保存</el-button
              >
            </div>
            <!-- 检测记录的内容 -->
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
                prop="customerNumber"
                label="客户号"
                width="100px"
              >
                <template #default="scope">
                  <el-input
                    v-model="scope.row.customerNumber"
                    placeholder="客户号"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip="true"
                prop="brand"
                label="品名"
                width="250px"
                ><template #default="scope">
                  <el-input
                    v-model="scope.row.brand"
                    placeholder="请输入品名"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip="true"
                sortable
                prop="quantity"
                label="数量"
                width="88px"
                ><template #default="scope">
                  <el-input
                    v-model="scope.row.quantity"
                    placeholder="请输入数量"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip="true"
                sortable
                prop="tableNumber"
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
              <el-table-column
                show-overflow-tooltip="true"
                sortable
                prop="boxOrWorkerNumber"
                label="箱号/工号"
                width="220px"
                ><template #default="scope">
                  <el-input
                    v-model="scope.row.boxOrWorkerNumber"
                    placeholder="请输入箱号/工号"
                    ref="boxOrWorkerInput"
                    @mousedown.left="startDragLeft(scope)"
                    @keyup.down="startDragMiddle(scope)"
                    @mousemove="handleDrag(scope)"
                    @mouseup="endDrag(scope.$index)"
                  ></el-input> </template
              ></el-table-column>
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
                prop="remark"
                label="备注"
                width="120px"
                ><template #default="scope">
                  <el-input
                    v-model="scope.row.remark"
                    placeholder="备注"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip="true"
                prop="specification"
                label="规格"
                width="280px"
                ><template #default="scope">
                  <el-input
                    v-model="scope.row.specification"
                    placeholder="请输入规格"
                  ></el-input> </template
              ></el-table-column>

              <el-table-column
                #default="scope"
                fixed="right"
                prop="operatorId"
                label="操作"
                width="60px"
              >
                <el-popconfirm
                  confirm-button-text="Yes"
                  cancel-button-text="No"
                  :icon="InfoFilled"
                  icon-color="#626AEF"
                  title="确认删除该数据吗?"
                  @confirm="deleteRow(scope.$index)"
                  @cancel="cancelEvent"
                >
                  <template #reference>
                    <el-button type="danger" :icon="Delete" circle />
                  </template>
                </el-popconfirm>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
        <el-footer>
          <div class="watermark">©宁波时代仪表</div>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, Ref, nextTick } from "vue";
import router from "../router/index";
import { ElNotification, ElMessageBox } from "element-plus";
import { useRoute } from "vue-router";
import moment from "moment";
import { onMounted } from "vue";
import { Edit, Delete } from "@element-plus/icons-vue";
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
import { ElMessage } from 'element-plus'
import axios from "axios";
const username = ref(""); // Replace with the actual usernamet
const packIndex = ref(); // 当前pack 序列号
const selectedItem = ref("scanBox"); // Replace with the actual username
const route = useRoute();
const Median: Ref<number> = ref(0); // 提供初始值为 0
const tableData = ref<Form[]>([]);
const tableNumberInput = ref<HTMLInputElement | null>(null);
const packData = ref<PackForm[]>([]);

const boxOrWorkerInput = ref<HTMLInputElement | null>(null);
const startRowIndex = ref<number | null>(null);
const isDragging = ref(false);
const copiedText = ref(""); // 用于存储复制的文本

const startRowIndex1 = ref<number | null>(null);
const isDragging1 = ref(false);
const copiedText1 = ref(""); // 用于存储复制的文本
const copiedTextOrigin = ref(""); // 用于存储复制的文本

username.value = route.query.key ? route.query.key.toString() : "";
interface PackForm {
  id?: number;
  deviceCount: number;
  operatorId: string;
  packingTime: Date;
}
interface Form {
  orderNumber: string;
  customerNumber: string;
  brand: string;
  quantity: number | null;
  specification: string;
  remark: string;
  tableNumber: string;
  boxOrWorkerNumber: string;
  id?: null | number;
  operatorId?: null | number;
  productionTime?: Date; // 添加 productionTime 属性的类型定义
}
const formBp: Form = {
  orderNumber: "",
  customerNumber: "",
  brand: "",
  quantity: 0,
  specification: "",
  remark: "",
  tableNumber: "",
  boxOrWorkerNumber: "",
};
const form: Form = reactive({
  orderNumber: "",
  customerNumber: "",
  brand: "",
  quantity: 0,
  specification: "",
  remark: "",
  tableNumber: "",
  boxOrWorkerNumber: "",
  productionTime: new Date(),
});

const backPack = () => {
  tableData.value = [];
  selectedItem.value = "scanBox";
};
const saveOrderInfo = async () => {
  console.log("tableData.value", tableData.value);

  const url = "/api/update";
  const data = {
    operatorId: packIndex.value,
    orderInfo: tableData.value,
  };
  // tableData.value
  await axios
    .post(url, data)
    .then((response: { data: any }) => {
      console.log("data", response);
      if (response.data.code === 200) {
        ElNotification({
          title: "Success",
          message: "保存成功",
          type: "success",
        });
        selectedItem.value = "scanBox";
        getPackingInfo();
      }
    })
    .catch((error: any) => {
      ElNotification({
        title: "Error",
        message: error,
        type: "error",
      });
    });
};
const onSubmit = async () => {
  form.productionTime = new Date();
  const url = "/api/insertData";
  const data = {
    orderInfo: form,
    username: username.value,
  };
  await axios
    .post(url, data)
    .then((response: { data: any }) => {
      if (response.data.code === 200)
        ElNotification({
          title: "Success",
          message: "创建成功",
          type: "success",
        });
      else
        ElNotification({
          title: "Error",
          message: "创建失败",
          type: "error",
        });
    })
    .catch((error: any) => {
      ElNotification({
        title: "Error",
        message: error,
        type: "error",
      });
    });
};
const cacelSubmit = () => {
  selectedItem.value = "checkRecord";
};
const cancelEvent = () => {};
// Function to handle logout
onMounted(async () => {
  getPackingInfo();
});
const getPackingInfo = async () => {
  await axios
    .get("/api/pack/getPackingInfo", {
      params: {
        username: username.value,
      },
    })
    .then((response: { data: any }) => {
      console.log("response.data", response.data);
      packData.value = response.data.map((item: any) => {
        const date = new Date(item.packingTime.replace("T", " "));
        item.packingTime = formatter(date);
        return item;
      });
      // 处理后端返回的数据...
    })
    .catch((error: any) => {
      console.error("POST请求失败", error);
      // 处理请求失败的情况...
    });
};

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
const exportExcel = () => {
  // 替换为你的后端接口URL
  const url = "/api/exportExcel";

  // 替换为你的username数据
  const usernameData = {
    username: username.value, // 这里是你要传递的username数据
  };

  axios
    .post(url, usernameData, {
      responseType: "blob", // 表示服务器响应的数据类型是一个二进制文件
    })
    .then((response: { data: Blob; headers: { [x: string]: any } }) => {
      // 创建一个 blob 对象 URL，然后通过 link 下载
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/vnd.ms-excel" })
      );
      const link = document.createElement("a");
      link.href = url;
      const contentDisposition = response.headers["content-disposition"];
      console.log("contentDisposition", contentDisposition);
      let fileName = "数据";
      if (contentDisposition) {
        fileName = window.decodeURIComponent(contentDisposition.split("=")[1]);
        if (!fileName.endsWith(".xlsx")) {
          fileName += ".xlsx";
        }
      }
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((error: any) => {
      console.log("error", error);
    });
};
const deleteRow = (index: number) => {
  // 若 该条数据尚未保存 则删除显示即可
  if (tableData.value[index].id == null) {
    tableData.value.splice(index, 1);
  } else {
    axios
      .get("/api/delete", {
        params: {
          username: username.value,
          id: tableData.value[index].id,
        },
      })
      .then((response: { data: any }) => {
        if (response.data.code === 200) {
          ElNotification({
            title: "Success",
            message: "删除成功",
            type: "success",
          });
          tableData.value.splice(index, 1);
          getPackingInfo();
        } else {
          ElNotification({
            title: "Error",
            message: "删除失败",
            type: "error",
          });
        }
      })
      .catch((error: any) => {
        ElNotification({
          title: "Warning",
          message: error,
          type: "warning",
        });
      });
  }
};
const deleteRow2 = async (index: number) => {
  axios
    .get("/api/pack/deletePack", {
      params: {
        username: username.value,
        id: packData.value[index].id,
      },
    })
    .then((response: { data: any }) => {
      if (response.data.code === 200) {
        ElNotification({
          title: "Success",
          message: "删除成功",
          type: "success",
        });
        packData.value.splice(index, 1);
        getPackingInfo();
      } else {
        ElNotification({
          title: "Error",
          message: "删除失败",
          type: "error",
        });
      }
    })
    .catch((error: any) => {
      ElNotification({
        title: "Warning",
        message: error,
        type: "warning",
      });
    });
};
const logout = async () => {
  // Your logout logic here
  console.log("log.this.$route.query", route);
  const param = route.query.key;
  if (typeof param === "string") window.sessionStorage.removeItem(param);
  // 跳转到首页页面
  router.push({
    path: "/",
  });
  ElNotification({
    title: "Success",
    message: "注销成功",
    type: "success",
  });
};
const isCollapse = ref(false);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const greeting = computed(() => {
  const hour = new Date().getHours();
  return hour < 12 ? "上午好，" : "下午好，";
});
const openSettings = () => {
  // Your settings icon click logic here
  console.log("Settings icon clicked");
};
const insertPack = async () => {
  const data: PackForm = {
    deviceCount: 0,
    operatorId: username.value, // 将username参数传递给后端
    packingTime: new Date(),
    // 其他需要传递的数据...
  };
  await axios
    .post("/api/pack/insertData", data)
    .then((response: { data: any }) => {
      console.log("response", response);
      getPackingInfo();
      // tableData.value = response.data.body.data.map((item: any) => {
      //   const date = new Date(item.productionTime.replace("T", " "));
      //   item.productionTime = formatter(date);
      //   return item;
      // });
      // 处理后端返回的数据...
    })
    .catch((error: any) => {
      console.error("POST请求失败", error);
      // 处理请求失败的情况...
    });
  // packData.value.push({
  //   id: 6,
  //   deviceCount: 5,
  //   operatorId: "joker",
  //   packingTime: new Date(),
  // });
};
// 编辑
const open1 = async (index: number) => {
  packIndex.value = packData.value[index].id;
  // packData.value[index].id
  // getByOperatorId
  if (packData.value[index].deviceCount === 0) {
    let newRow: Form = formBp;
    // 清空新行的表号
    newRow.id = null;
    newRow.operatorId = packData.value[index].id;
    newRow.productionTime = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    // 将新行添加到表格数据中
    tableData.value.push(newRow);
    selectedItem.value = "checkRecord";
  } else {
    await axios
      .get("/api/getByOperatorId", {
        params: {
          username: username.value,
          operatorId: packData.value[index].id,
        },
      })
      .then((response: { data: any }) => {
        tableData.value = response.data.body.data.map((item: any) => {
          const date = new Date(item.productionTime.replace("T", " "));
          item.productionTime = formatter(date);
          return item;
        });
        selectedItem.value = "checkRecord";
        console.log("tableData.value", tableData.value);
        // 处理后端返回的数据...
      })
      .catch((error: any) => {
        console.error("POST请求失败", error);
        // 处理请求失败的情况...
      });
  }
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
const startDragLeft = (scope: any) => {
  startRowIndex.value = scope.$index;
  isDragging.value = true;
  copiedText.value = scope.row.boxOrWorkerNumber;
  const count = tableData.value.reduce((init, item) => {
    if (item.boxOrWorkerNumber === copiedText.value) return init + 1;
    return init;
  }, 0);
  ElNotification({
    title: '箱号数量',
    message: `${count}`,
    duration: 2000,
    position: 'bottom-left',
  })
};

const startDragMiddle = (scope: any) => {
  startRowIndex1.value = scope.$index;
  isDragging1.value = true;
  copiedTextOrigin.value = scope.row.boxOrWorkerNumber;
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
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  border-right: 1px solid #ccc; /* 添加右侧的分割线 */
  height: 100%; /* 调整分割线的高度 */
}
.container-full-height {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.watermark {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.5;
  color: #000;
  font-size: 20px;
  z-index: 9999;
}
.el-table__body-wrapper::-webkit-scrollbar {
  width: 20px;
}
</style>
