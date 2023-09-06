<template>
  <el-drawer
    v-model="drawer"
    direction="ttb"
    :before-close="handleClose1"
    size="550"
    :with-header="false"
  >
    <div class="drawer-content">
      <h3>操作说明：</h3>
      <ul class="custom-list">
        <li>
          每个人根据自己的账号工号进行登录，分为管理员和用户两种角色，不同角色功能不一样，管理员有导出总数据以及检索数据条件的功能权限
        </li>
        <li>
          每个人在自己界面只能看到自己的装箱记录，切勿登录其他人账号进行操作，后台有检测记录
        </li>
        <li>
          未确保数据不被误删，页面没有添加支持多项装箱记录删除的功能，并且单项删除也要进行确认操作
        </li>
        <li>
          界面左侧可根据屏幕大小进行伸缩条件，后面卡槽为后续补用功能留空间
        </li>
      </ul>

      <hr />

      <h3>EXCEL数据复制功能：</h3>
      <ul class="custom-list">
        <li>
          页面支持 EXCEL
          数据复制到页面的功能；数据需包括六列数据（订单单号，客户号，品名，数量，规格，备注），在每行数据的首个列进行粘贴复制。如果数据为空，忽略。
        </li>
        <li>不需要一直操作的列数据会进行输入框的隐藏，以提高性能。</li>
        <li>
          在编辑装箱内容时，按住鼠标左键往下拉表号输入框，复制该表号输入框的值到鼠标光标停止的表号输入框中，所有行信息也会一律复制下来。扫码枪默认执行回车操作，因此按回车也可复制该行信息，表号内容会被清零，其余内容不变。
        </li>
        <li>当需要对表内容进行修改时，点击表号内容即可进行修改。</li>
        <li>
          在编辑箱号/工号操作时，鼠标点击需要执行+1操作的输入框，按一下键盘的“↓”下键，鼠标移动到对应数量的表号/工号输入框即可进行+1操作。这两个操作也可以反向执行。
        </li>
        <li>在装箱完毕确认无误后，点击保存即可，显示保存成功，则装箱成功。</li>
      </ul>
    </div>
  </el-drawer>

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
        <el-button style="margin-right: 30px" @click="drawer = true"
          ><span style="font-size: 20px">说明文档</span></el-button
        >
        <!-- Logout button -->
        <el-button
          @click="exportExcel"
          style="margin-right: 20px"
          v-show="username === '何绍钦'"
          round
        >
          <el-icon>
            <Upload />
          </el-icon>
          数据导出
        </el-button>
        <el-button @click="logout" link
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
            <el-radio-button :label="false">
              <el-icon>
                <DArrowRight />
              </el-icon>
            </el-radio-button>
            <el-radio-button :label="true">
              <el-icon>
                <DArrowLeft />
              </el-icon>
            </el-radio-button>
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
                  >扫码装箱
                </el-menu-item>
                <el-menu-item index="1-2" @click="selectedItem = 'checkRecord'"
                  >装箱单号
                </el-menu-item>
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
                >添加装箱
              </el-button>
            </div>

            <el-table
              :data="packData"
              style="width: 100%; height: calc(100vh - 210px)"
              :fit="true"
              :stripe="true"
            >
              <!--数据筛选 条件在表格里实现；实现数据操作（删除，编辑 ，保存数据）  -->

              <el-table-column
                sortable
                fixed
                type="index"
                label="序号"
                width="100"
              ></el-table-column>
              <el-table-column
                sortable
                prop="deviceCount"
                key="deviceCount"
                label="设备数量"
              >
              </el-table-column>
              <el-table-column
                sortable
                prop="operatorId"
                key="operatorId"
                label="操作人员"
              >
              </el-table-column>
              <el-table-column
                sortable
                fixed="right"
                prop="packingTime"
                label="生产时间"
                key="packingTime"
              ></el-table-column>
              <el-table-column #default="scope" fixed="right" label="操作">
                <!-- 编辑 -->
                <el-button
                  type="primary"
                  style="margin-right: 8px"
                  :icon="Edit"
                  @click="open1(scope.$index)"
                  circle
                  row-key="id"
                  :max-height="calcTableHeight"
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
            <!-- 扫码装箱的内容 -->
          </div>

          <div v-if="selectedItem === 'checkRecord'">
            <div style="display: flex; align-items: center">
              <el-button size="large" @click="backPack" plain>返回</el-button>
              <el-button
                type="primary"
                size="large"
                @click="saveOrderInfo"
                plain
                >保存
              </el-button>
              <el-input
                @input="handleInput($event)"
                v-model="newData1[0].orderNumber"
                style="margin-left: 20px"
                placeholder="请输入订单单号"
              ></el-input>
              <el-input
                v-model="newData1[0].customerNumber"
                style="margin-left: 20px"
                placeholder="请输入客户号"
              ></el-input>
              <el-input
                v-model="newData1[0].brand"
                style="margin-left: 20px"
                placeholder="请输入品名"
              ></el-input>
              <el-input
                v-model="newData1[0].quantity"
                style="margin-left: 20px"
                placeholder="请输入数量"
              ></el-input>
              <el-input
                v-model="newData1[0].specification"
                style="margin-left: 20px"
                placeholder="请输入规格"
              ></el-input>
              <el-input
                v-model="newData1[0].remark"
                style="margin-left: 20px; margin-right: 20px"
                placeholder="请输入备注"
              ></el-input>
              <el-button
                type="danger"
                :icon="Delete"
                @click="delete1111"
                plain
              />
            </div>
            <el-table
              :data="newData"
              style="width: 100%; height: calc(100vh - 210px)"
              :fit="true"
              :stripe="true"
              v-loading="loading"
              :element-loading-svg="svg"
              class="custom-loading-svg"
              element-loading-svg-view-box="-10, -10, 50, 50"
              row-key="productionTime"
              :max-height="calcTableHeight"
            >
              <!--数据筛选 条件在表格里实现；实现数据操作（删除，编辑 ，保存数据）  -->

              <el-table-column
                v-if="false"
                sortable
                prop="productionTime"
                key="productionTime"
                label="生产时间"
                show-overflow-tooltip="true"
              >
              </el-table-column>

              <el-table-column sortable prop="tableNumber" label="表号">
                <template #default="scope">
                  <div @click="startEditing(scope.$index)">
                    <span v-if="!scope.row.isEditing1">
                      {{ scope.row.tableNumber }}
                    </span>
                    <el-input
                      v-else
                      v-model="scope.row.tableNumber"
                      placeholder="请输入表号"
                      ref="tableNumberInput"
                      @keyup.enter="addRow(scope.row)"
                      @blur="endEditing(scope.$index)"
                    ></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column type="index" label="序号" width="100">
              </el-table-column>
              <el-table-column
                sortable
                prop="boxOrWorkerNumber"
                label="箱号/工号"
              >
                <template #default="scope">
                  <!-- <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="`${countL}`"
                    placement="right"
                  > -->
                  <el-input
                    v-model="scope.row.boxOrWorkerNumber"
                    placeholder="输入箱号/工号"
                    ref="boxOrWorkerInput"
                    @mousedown.left="startDragLeft(scope)"
                    @keyup.down="startDragMiddle(scope)"
                    @mousemove="handleDrag(scope)"
                    @mouseup="endDrag(scope.$index)"
                  ></el-input>
                  <!-- </el-tooltip> -->
                </template>
              </el-table-column>
              <el-table-column
                v-if="isDelete"
                #default="scope"
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
import { RecycleScroller } from "vue-virtual-scroller";
import router from "../router/index";
import { ElNotification, ElMessageBox } from "element-plus";
import { useRoute } from "vue-router";
import moment from "moment";
import { onMounted } from "vue";
import { useMemo } from "vue-composition-api";
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
import { ElMessage } from "element-plus";
import axios from "axios";
const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;
const username = ref(""); // Replace with the actual usernamet
const packIndex = ref(); // 当前pack 序列号
const selectedItem = ref("scanBox"); // Replace with the actual username
const route = useRoute();
const tableData = ref<Form[]>([]);
const newData = ref<Form[]>([]);
const newData1 = ref<Form2[]>([]);
const tableNumberInput = ref<HTMLInputElement | null>(null);
const packData = ref<PackForm[]>([]);
const isDelete = ref(false);
const boxOrWorkerInput = ref<HTMLInputElement | null>(null);
const startRowIndex = ref<number | null>(null);
const isDragging = ref(false);
const copiedText = ref(""); // 用于存储复制的文本
const loading = ref(false);
const startRowIndex1 = ref<number | null>(null);
const isDragging1 = ref(false);
const copiedText1 = ref(""); // 用于存储复制的文本
const copiedTextOrigin = ref(""); // 用于存储复制的文本
const countL = ref<number | null>(null);
const middle = ref(0);

const isEditing = ref(false);
const activeColumn = ref("");
const drawer = ref(false);

username.value = route.query.key ? route.query.key.toString() : "";

interface PackForm {
  id?: number;
  deviceCount: number;
  operatorId: string;
  packingTime: Date;
}

interface Form {
  orderNumber?: string;
  customerNumber?: string;
  brand?: string;
  quantity?: number | null;
  specification?: string;
  remark?: string;
  tableNumber?: string;
  boxOrWorkerNumber?: string;
  id?: null | number;
  operatorId?: null | number;
  productionTime?: Date; // 添加 productionTime 属性的类型定义
  isEditing1?: boolean;
}
interface Form2 {
  orderNumber?: string;
  customerNumber?: string;
  brand?: string;
  quantity?: number | null;
  specification?: string;
  remark?: string;
}
const delete1111 = () => {
  isDelete.value = !isDelete.value;
};
const backPack = () => {
  newData1.value = [];
  newData.value = [];
  tableData.value = [];
  selectedItem.value = "scanBox";
};
const saveOrderInfo = async () => {
  tableData.value = [];
  const middle = newData1.value[0];
  for (let i = 1; i < newData.value.length; i++) {
    newData1.value[i] = middle;
  }
  for (let i = 0; i < newData.value.length; i++) {
    // todo 使用对象扩展运算符将newData1.value和newData.value的属性拼接到一个新的对象中
    const mergedObject = { ...newData1.value[i], ...newData.value[i] };
    // 将拼接后的对象添加到tableData.value中
    tableData.value.push(mergedObject);
  }
  const url = "/api/update";
  const data = {
    operatorId: packIndex.value,
    orderInfo: tableData.value,
  };
  // tableData.value
  await axios
    .post(url, data)
    .then((response: { data: any }) => {
      if (response.data.code === 200) {
        ElNotification({
          title: "Success",
          message: "保存成功",
          type: "success",
          duration: 1000,
        });
        selectedItem.value = "scanBox";
        getPackingInfo();
        newData1.value = [];
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
    .catch((error: any) => {});
};
const deleteRow = (index: number) => {
  // 若 该条数据尚未保存 则删除显示即可
  if (newData.value[index].id == null) {
    newData.value.splice(index, 1);
  } else {
    axios
      .get("/api/delete", {
        params: {
          username: username.value,
          id: newData.value[index].id,
        },
      })
      .then((response: { data: any }) => {
        if (response.data.code === 200) {
          ElNotification({
            title: "Success",
            message: "删除成功",
            type: "success",
            duration: 500,
          });
          newData.value.splice(index, 1);
          getPackingInfo();
        } else {
          ElNotification({
            title: "Error",
            message: "删除失败",
            type: "error",
            duration: 500,
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
          duration: 500,
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
        duration: 500,
      });
    });
};
const logout = async () => {
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
    duration: 500,
  });
};
const isCollapse = ref(false);
const handleOpen = (key: string, keyPath: string[]) => {};
const handleClose = (key: string, keyPath: string[]) => {};
const greeting = computed(() => {
  const hour = new Date().getHours();
  return hour < 12 ? "上午好，" : "下午好，";
});
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
      getPackingInfo();
    })
    .catch((error: any) => {
      console.log("jokerVue", error);
    });
};
// 编辑
const open1 = async (index: number) => {
  loading.value = true;
  newData.value = [];
  tableData.value = [];
  newData1.value[0] = {
    orderNumber: "",
    customerNumber: "",
    brand: "",
    quantity: null,
    specification: "",
    remark: "",
  };
  // packData.value[index].id
  // getByOperatorId
  packIndex.value = packData.value[index].id;
  if (packData.value[index].deviceCount === 0) {
    let newRow1: Form = {
      tableNumber: ".",
      boxOrWorkerNumber: "",
      isEditing1: true,
    };
    // 清空新行的表号
    newRow1.id = null;
    newRow1.operatorId = packData.value[index].id;
    newRow1.productionTime = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    // 将新行添加到表格数据中
    newData.value.push(newRow1);
    loading.value = false;
    selectedItem.value = "checkRecord";
    isEditing.value = true;
  } else {
    isEditing.value = false;
    await axios
      .get("/api/getByOperatorId", {
        params: {
          username: username.value,
          operatorId: packData.value[index].id,
        },
      })
      .then((response: { data: any }) => {
        console.log("response.data.body.data", response.data.body.data);
        tableData.value = response.data.body.data.map((item: any) => {
          const date = new Date(item.productionTime.replace("T", " "));
          item.productionTime = formatter(date);
          return item;
        });
        newData.value = tableData.value.map((item) => {
          return {
            id: item.id,
            boxOrWorkerNumber: item.boxOrWorkerNumber,
            operatorId: item.operatorId,
            productionTime: item.productionTime,
            tableNumber: item.tableNumber,
          };
        });
        newData1.value[0].orderNumber = tableData.value[0].orderNumber;
        newData1.value[0].customerNumber = tableData.value[0].customerNumber;
        newData1.value[0].brand = tableData.value[0].brand;
        newData1.value[0].quantity = tableData.value[0].quantity;
        newData1.value[0].specification = tableData.value[0].specification;
        newData1.value[0].remark = tableData.value[0].remark;
        selectedItem.value = "checkRecord";
        loading.value = false;
      })
      .catch((error: any) => {
        loading.value = false;
      });
  }
};

const startDragLeft = (scope: any) => {
  startRowIndex.value = scope.$index;
  isDragging.value = true;
  copiedText.value = scope.row.boxOrWorkerNumber;
  const count = newData.value.reduce((init, item) => {
    if (item.boxOrWorkerNumber === copiedText.value) return init + 1;
    return init;
  }, 0);
  ElNotification({
    title: "箱号数量",
    message: `${count}`,
    duration: 500,
    position: "bottom-left",
  });
};
const startDragMiddle = (scope: any) => {
  startRowIndex1.value = scope.$index;
  isDragging1.value = true;
  copiedTextOrigin.value = scope.row.boxOrWorkerNumber;
};

const handleDrag = (scope: any) => {
  middle.value = scope.$index;
  countL.value = newData.value.reduce((init, item) => {
    if (
      item.boxOrWorkerNumber === newData.value[middle.value].boxOrWorkerNumber
    ) {
      return init + 1;
    }
    return init;
  }, 0);
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
        newData.value[i].boxOrWorkerNumber = copiedText.value;
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
        newData.value[i].boxOrWorkerNumber = copiedText1.value;
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
const calcTableHeight = () => {
  // 根据页面高度和其他元素高度来计算表格的最大高度
  return window.innerHeight - 110;
};

const handleInput = (newValue: any) => {
  if (newValue.includes("	")) {
    const data = newValue.split("	");
    newData1.value[0].orderNumber = data[0];
    newData1.value[0].customerNumber = data[1];
    newData1.value[0].brand = data[2];
    newData1.value[0].quantity = data[3];
    newData1.value[0].specification = data[4];
    newData1.value[0].remark = data[5];
  }
};
const addRow = (rowData: Form) => {
  // 使用 useMemo 缓存表格数据
  // 创建一个新的对象，复制 rowData 的所有字段
  let newRow = { ...rowData };
  newRow.tableNumber = "";
  newRow.id = null;
  newRow.productionTime = moment().format("YYYY-MM-DD HH:mm:ss.SSS");

  // 将新行添加到表格数据中
  newData.value.push(newRow);
  nextTick(() => {
    // 将光标设置到新行的表号输入框中
    if (tableNumberInput.value !== null) {
      tableNumberInput.value.focus();
    }
  });
};
const startEditing = (row: any) => {
  // 开始编辑，设置标志位

  newData.value[row].isEditing1 = true;
};
const endEditing = (row: any) => {
  // 结束编辑，清除标志位

  newData.value[row].isEditing1 = false;
};
const handleClose1 = (done: () => void) => {
  done();
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
.el-table__body-wrapper {
  /* 调整滚动速度，你可以根据需要调整这个值 */
  scroll-behavior: smooth !important;
  scroll-snap-type: y mandatory !important;
  /* 控制滚动速度 */
  scroll-snap-points-y: repeat(100px) !important; /* 增加这个值以减慢滚动速度 */
  /* 控制滚动速度 */
  overscroll-behavior-y: contain !important;
}
.example-showcase .el-loading-mask {
  z-index: 9;
}
.drawer-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
