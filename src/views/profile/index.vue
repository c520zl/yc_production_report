<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <div class="profile-header">
        <div class="avatar-container">
          <el-avatar :size="80" class="avatar">
            <img src="@/assets/avatar-default.svg" alt="用户头像">
          </el-avatar>
          <div class="avatar-actions">
            <el-button size="small" type="primary" @click="uploadAvatar">更换头像</el-button>
          </div>
        </div>
        <div class="user-info">
          <h2 class="username">{{ userInfo.fullName || '管理员' }}</h2>
          <p class="user-role">{{ userInfo.role || '系统管理员' }}</p>
          <p class="user-joined">创建时间: {{ formatDate(userInfo.createTime) || '未知' }}</p>
        </div>
      </div>
    </el-card>

    <el-tabs v-model="activeTab" class="profile-tabs">
      <el-tab-pane label="个人信息" name="info">
        <el-card class="info-card">
          <el-form ref="infoForm" :model="userInfo" label-width="120px" class="info-form">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userInfo.username" disabled placeholder="请输入用户名"></el-input>
            </el-form-item>
              <el-form-item label="电话" prop="phone">
              <el-input v-model="userInfo.phone" placeholder="请输入电话"></el-input>
            </el-form-item>
            <el-form-item class="form-actions">
              <el-button type="primary" @click="saveUserInfo">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="修改密码" name="password">
        <el-card class="password-card">
          <el-form :model="passwordForm" :rules="passwordRules" label-width="180px" class="password-form" ref="passwordFormRef">

<el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请确认新密码"></el-input>
            </el-form-item>
            <el-form-item class="form-actions">
              <el-button type="primary" @click="handleChangePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, watch } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { updateAdminPassword } from '@/api/admin';
import { updateUserInfo } from '@/api/admin';
import { ElMessage, ElMessageBox } from 'element-plus';
import { decrypt } from '@/utils/crypto';
import { formatDate } from '@/utils/date';


const userStore = useUserStore();
const { proxy } = getCurrentInstance();

// 状态管理
const activeTab = ref('info');
const userInfo = ref({});
const passwordFormRef = ref(null);
const currentPassword = ref('');
const passwordStrength = ref('');

const passwordForm = reactive({
  newPassword: '',
  confirmPassword: ''
});

// 表单验证规则
const passwordRules = ref({
 

  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, message: '密码必须包含大小写字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      }, trigger: 'blur' }
  ]
});

// 生命周期钩子
onMounted(() => {
  try {
    // 从本地存储获取用户信息
    // 从localStorage直接获取用户信息确保加密密码字段存在
    let storedUserInfo, authInfo, credentialsInfo;
      try {
        storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        authInfo = JSON.parse(localStorage.getItem('auth') || '{}');
        credentialsInfo = JSON.parse(localStorage.getItem('credentials') || '{}');
      } catch (e) {
        console.error('解析本地存储用户信息失败:', e);
        storedUserInfo = userStore.userInfo || {};
        authInfo = {};
        credentialsInfo = {};
      }
    console.log('从本地存储获取用户信息:', storedUserInfo);
    console.log('加密密码字段值:', storedUserInfo.encryptedPassword || storedUserInfo.encrypted_password);
    // 映射本地存储字段到前端模型
    userInfo.value = {
      id: storedUserInfo.id,
      username: storedUserInfo.username,
      fullName: storedUserInfo.fullName || storedUserInfo.full_name,
      phone: storedUserInfo.phone,
      role: storedUserInfo.role || '系统管理员',
      createTime: storedUserInfo.create_time || storedUserInfo.createTime
    };
    console.log('映射后的用户信息:', userInfo.value);
    // 解密并显示当前密码
    const passwordHash = storedUserInfo.password || userStore.userInfo.password;
    console.log('所有可能的密码哈希来源:', {storedUserInfo, userStore: userStore.userInfo});
        console.log('尝试获取的密码哈希值:', {passwordHash: storedUserInfo.password || userStore.userInfo.password});
    if (passwordHash) {
        try {
          // 安全设计：密码采用加盐哈希存储，无法显示明文\n          currentPassword.value = '密码采用安全哈希存储，无法显示明文';
          console.log('显示密码哈希值:', currentPassword.value);
        } catch (e) {
          console.error('密码解密失败:', e);
          currentPassword.value = '******'; // 默认显示
        }
      } else {
        console.warn('未找到密码哈希值');
        currentPassword.value = '******'; // 默认显示
      }
  } catch (e) {
    console.error('获取用户信息失败:', e);
    currentPassword.value = '加载失败';
  }
  // 从本地存储获取加密密码并解密
  
});

// 方法


const saveUserInfo = async () => {
  try {
    await updateUserInfo(userInfo.value);
    ElMessage.success('用户信息更新成功');
    userStore.setUserInfo(userInfo.value);
  } catch (error) {
    ElMessage.error('更新用户信息失败: ' + (error.message || '未知错误'));
  }
};

const handleChangePassword = async () => {
  try {
    await passwordFormRef.value.validate();
    const response = await updateAdminPassword({
      newPassword: passwordForm.newPassword
    });
    // 检查后端返回的状态码和消息
    if (response && response.code === 200) {
      ElMessage.success('密码修改成功，请重新登录');
      userStore.logout();
      proxy.$router.push('/login');
    } else {
      ElMessage.error('修改密码失败: ' + (response?.message || '服务器返回异常'));
    }
  } catch (error) {
    if (error.name !== 'ValidationError') {
      // 处理特定错误类型
      if (error.response && error.response.status === 400) {
        ElMessage.error('当前密码不正确，请重新输入');
      } else {
        ElMessage.error('修改密码失败: ' + (error.message || '未知错误'));
      }
    }
  }
};

// 添加密码强度检测辅助函数
const checkPasswordStrength = (password) => {
  if (password.length < 6) return 'weak';
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'medium';
  if (password.length >= 10 && /[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'strong';
  return 'medium';
};

// 添加实时密码强度检测
watch(
  () => passwordForm.newPassword,
  (newVal) => {
    if (!newVal) return;
    const strength = checkPasswordStrength(newVal);
    passwordStrength.value = strength;
  }
);

const uploadAvatar = () => {
  ElMessage.info('头像上传功能待实现');
};
</script>

<style scoped lang="scss">
.profile-container {
  padding: 20px;
}

.profile-card {
  margin-bottom: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-container {
  margin-right: 30px;
  text-align: center;
}

.avatar {
  margin-bottom: 10px;
}

.user-info {
  flex: 1;
}

.username {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 500;
}

.user-role,
.user-joined {
  color: #606266;
  margin: 5px 0;
}

.profile-tabs {
  margin-top: 20px;
}

.info-card,
.password-card {
  margin-top: 10px;
}

.info-form,
.password-form {
  padding: 20px 0 0 20px;
}

.form-actions {
  margin-top: 20px;
  text-align: center;
}
</style>