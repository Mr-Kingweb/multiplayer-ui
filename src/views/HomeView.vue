<!-- 文件名：@/components/Login.vue -->
<template>
  <div class="login10">
    <div class="login10-bg"></div>
    <div class="login10-container">
      <div class="login10-container-head">Login</div>
      <div class="login10-container-wrap">
        <el-icon class="icon">
          <User />
        </el-icon>
        <input v-model="form.username" type="text" name="username" placeholder="账号信息">
      </div>
      <div class="login10-container-wrap">
        <el-icon class="icon">
          <Lock />
        </el-icon>
        <input v-model="form.password" type="password" name="password" placeholder="密码信息">
      </div>

      <input class="login10-container-action btn" type="button" value="登录" @click="login">

      <!-- <div class="login10-container-or">OR</div>

      <div class="login10-container-signup">
        <span>还没有账户 ? <a href="#">注册</a></span>
      </div> -->
    </div>
    <div class="watermark">@宁波时代仪表</div>
  </div>
</template>

<script lang='ts'>
import { reactive } from 'vue'
import { ElNotification } from 'element-plus'
import axios from 'axios'
import router from '../router/index'
import {
  User, Lock
}
  from '@element-plus/icons-vue'
export default {
  name: '',
  setup() {

    const form = reactive({
      username: '',
      password: ''
    })
    function login() {
      axios.get('/api/login', {
        params: {
          username: form.username,
          password: form.password,
        },
      })
        .then((response: { data: any; }) => {
          console.log(response);

          console.log(response.data.code);

          // 处理后端返回的账号验证结果
          if (response.data.code === 200) {
            ElNotification({
              title: 'Success',
              message: '登录成功',
              type: 'success',
            })
            // 将用户名存储到sessionStorage中
            window.sessionStorage.setItem(form.username, form.username);
            // 跳转到首页页面
            router.push({ 
              path: '/about',
              query: { key: form.username }, // 向路由添加参数值
            });
          }
          else if (response.data.code === 404) {
            ElNotification({
              title: 'Warning',
              message: '账号密码错误',
              type: 'warning',
            })
          }
        })
        .catch((error: any) => {
          // 处理请求错误
          ElNotification({
            title: 'Error',
            message: '请求资源错误',
            type: 'error',
          })
        });
    }
    return {
      form, login
    }
  },
  components: {
    User, Lock
  }
};
</script>

<style lang='less' scoped>
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

.btn {
  border: none;
  outline: none;
  width: 100%;
  height: 50px;
  font-size: 16px;
  border-radius: 40px;

}

.login10 {
  overflow: hidden;
  height: 100vh;
  position: relative;
  font-family: sans-serif;

  &-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(-45deg, rgb(160, 192, 219), rgba(39, 60, 117, 1.0));
    background-size: cover;
    z-index: -100;
  }

  &-container {
    background: rgba(255, 255, 255, .6);
    margin: 120px auto 0;
    width: 400px;
    border-radius: 16px;
    padding: 40px;
    display: flex;
    align-items: center;
    flex-direction: column;

    border-top: 2px solid rgba(255, 255, 255, .3);
    border-left: 2px solid rgba(255, 255, 255, .3);
    box-shadow: 2px 2px 10px rgba(0, 0, 0, .2);

    &-head {
      font-size: 30px;
      margin: 40px 0;
    }

    &-wrap {
      width: 100%;
      height: 50px;
      background: rgba(245, 246, 250, 1.0);
      border-radius: 40px;
      margin-bottom: 25px;
      display: grid;
      grid-template-columns: 15% 86%;

      .icon {
        font-size: 20px;
        /* 设置图标的大小 */
        margin-top: 14px;
        margin-left: 22px;
        /* 图标和输入框之间的间距 */
      }

      input {
        outline: none;
        border: none;
        background: none;
        font-size: 16px;

        &::placeholder {
          font-size: 16px;
        }
      }

      i {
        line-height: 40px;
        text-align: center;
      }
    }

    &-access {
      margin-bottom: 20px;
      width: 100%;
      padding: 0 .4rem;
      display: flex;
      justify-content: flex-end;

      span {
        margin-left: 8px;
      }
    }

    &-action {
      margin-bottom: 0px;
    }

    &-or {
      margin-bottom: 20px;
      display: flex;
      width: 100%;

      &:before,
      &:after {
        content: '';
        border-bottom: 1px solid black;
        flex: 1 1;
        margin: auto;
      }
    }

    &-signup {
      margin: 20px 0;
    }
  }
}
</style>
