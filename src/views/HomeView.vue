<template>
  <div class="login-container">
    <div class="login-container-bg"></div>
    <div class="login-container-content">
      <div class="login-container-content-header">登录</div>
      <div class="login-container-content-input">
        <el-icon class="icon">
          <User />
        </el-icon>
        <input
          v-model="form.username"
          type="text"
          name="username"
          placeholder="请输入账号"
        />
      </div>
      <div class="login-container-content-input">
        <el-icon class="icon">
          <Lock />
        </el-icon>
        <input
          v-model="form.password"
          type="password"
          name="password"
          placeholder="请输入密码"
        />
      </div>
      <button class="login-container-content-button" @click="login">
        登录
      </button>
    </div>
    <div class="watermark">©宁波时代仪表</div>
  </div>
</template>
<script lang="ts">
import { reactive } from "vue";
import { ElNotification } from "element-plus";
import axios from "axios";
import router from "../router/index";
import { User, Lock } from "@element-plus/icons-vue";

export default {
  name: "",
  setup() {
    const form = reactive({
      username: "",
      password: "",
    });

    function login() {
      axios
        .get("/api/login", {
          params: {
            username: form.username,
            password: form.password,
          },
        })
        .then((response: { data: any }) => {
          console.log(response);
          console.log(response.data.code);

          if (response.data.code === 200) {
            ElNotification({
              title: "成功",
              message: "登录成功",
              type: "success",
              duration:600
            });
            window.sessionStorage.setItem(form.username, form.username);
            router.push({
              path: "/about",
              // path: "/joker",
              query: { key: form.username },
            });
          } else if (response.data.code === 404) {
            ElNotification({
              title: "警告",
              message: "账号密码错误",
              type: "warning",
            });
          }
        })
        .catch((error: any) => {
          ElNotification({
            title: "错误",
            message: "请求资源错误",
            type: "error",
          });
        });
    }

    return {
      form,
      login,
    };
  },
  components: {
    User,
    Lock,
  },
};
</script>
<style lang="css" scoped>
.login-container {
  overflow: hidden;
  height: 100vh;
  position: relative;
  font-family: sans-serif;
}

.login-container-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, #f5f5f5, #ebebeb);
  background-size: cover;
  z-index: -100;
}

.login-container-content {
  background: rgba(255, 255, 255, 0.8);
  margin: 120px auto 0;
  width: 500px;
  border-radius: 20px;
  padding: 40px;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
  border-left: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}

.login-container-content-header {
  font-size: 30px;
  margin: 40px 0;
}

.login-container-content-input {
  width: 100%;
  height: 60px;
  background: #f5f5f5;
  border-radius: 50px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.login-container-content-input .icon {
  font-size: 24px;
  margin-right: 10px;
}

.login-container-content-input input {
  flex: 1;
  outline: none;
  border: none;
  background: none;
  font-size: 18px;
}

.login-container-content-input input::placeholder {
  font-size: 18px;
}

.login-container-content-button {
  border: none;
  outline: none;
  width: 100%;
  height: 50px;
  font-size: 18px;
  border-radius: 50px;
  background: #007bff;
  color: #fff;
  cursor: pointer;
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
</style>
