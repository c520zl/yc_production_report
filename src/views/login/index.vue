<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-title">软包产能报表管理系统</div>
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
        <el-form-item prop="captcha">
          <div class="captcha-group">
            <el-input
              v-model="loginForm.captcha"
              placeholder="请输入验证码"
              :prefix-icon="Check"
              class="captcha-input"
            ></el-input>
            <div class="captcha-img-container">
              <img :src="captchaUrl" @click="refreshCaptcha" class="captcha-img" alt="验证码" />
            </div>
          </div>
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { Check } from '@element-plus/icons-vue';
import { getCaptchaUrl } from '@/api/captcha';

const router = useRouter();
const userStore = useUserStore();
const loginFormRef = ref(null);
const loading = ref(false);

const captchaUrl = ref('');

const refreshCaptcha = async () => {
  try {
    captchaUrl.value = await getCaptchaUrl();
  } catch (error) {
    ElMessage.error('获取验证码失败，请重试');
    console.error('验证码获取失败:', error);
  }
};

onMounted(() => {
  refreshCaptcha();
});

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  captcha: ''
});

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
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
    refreshCaptcha();
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
  background: linear-gradient(135deg, #f5f7fa 0%, #eef2f7 100%);
  background-image: radial-gradient(circle at 10% 20%, rgba(22, 160, 133, 0.03) 0%, transparent 20%);
}

.login-card {
  width: 420px;
  padding: 40px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(222, 226, 230, 0.5);
}

.login-title {
  text-align: center;
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #2c3e50;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.login-form {
  margin-top: 20px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border: none;
  transition: all 0.3s ease;
}
.login-btn:hover {
  background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.captcha-group {
  display: flex;
  gap: 10px;
}

.captcha-input {
  flex: 1;
}

.captcha-img-container {
  width: 130px;
  height: 44px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.captcha-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* 自定义输入框样式 */
.el-input {
  --el-input-bg-color: #f9fafb;
  --el-input-border-color: #e2e8f0;
  --el-input-focus-border-color: #3498db;
}
.el-input__inner {
  border-radius: 6px;
  height: 44px;
  font-size: 14px;
  border-width: 1px;
  transition: all 0.3s ease;
}
.el-input__inner:focus {
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}
</style>