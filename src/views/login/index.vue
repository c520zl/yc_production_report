<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-title">生产报表管理系统</div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            @click="handleLogin"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const loginFormRef = ref(null);
const loading = ref(false);

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
});

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
};

// 处理登录
const handleLogin = async () => {
  try {
    // 表单验证
    await loginFormRef.value.validate();
    loading.value = true;

    // 调用登录接口
    await userStore.login(loginForm);
    ElMessage.success('登录成功');
    // 简化路由跳转逻辑，只保留一次跳转并添加详细错误处理
    router.push('/dashboard').then(() => {
      console.log('路由跳转成功');
    }).catch(err => {
      console.error('路由跳转失败原因:', err);
      ElMessage.error('页面跳转失败: ' + (err.message || '未知错误'));
    });
  } catch (error) {
    console.error('登录失败:', error);
    ElMessage.error(error.message || '登录失败，请重试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #1890ff;
}

.login-form {
  margin-top: 20px;
}

.login-btn {
  width: 100%;
}
</style>