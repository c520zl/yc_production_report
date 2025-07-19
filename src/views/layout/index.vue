<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="layout-aside">
      <div class="logo">产能报表管理系统</div>
      <el-menu
        :default-openeds="['1']"
        class="layout-menu"
        background-color="#0f172a"
        text-color="#fff"
        active-text-color="#1890ff"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>数据面板</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>报表管理</span>
          </template>
          <el-menu-item index="/reports/production">产能报表</el-menu-item>
          <el-menu-item index="/reports/defect">不良率分析</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/system/settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航 -->
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon @click="toggleSidebar"><menu /></el-icon>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32">{{ userInfo?.username?.substring(0, 2) }}</el-avatar>
              <span class="username">{{ userInfo?.username }}</span>
              <el-icon class="arrow-down"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 页面内容 -->
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { DataBoard } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore();
const userInfo = ref(userStore.userInfo);
const isSidebarCollapse = ref(false);

// 切换侧边栏展开/收起
const toggleSidebar = () => {
  isSidebarCollapse.value = !isSidebarCollapse.value;
};

// 处理用户操作命令
const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout();
    router.push('/login');
    ElMessage.success('退出登录成功');
  } else if (command === 'profile') {
    router.push('/profile');
  }
};

// 移除onMounted中的登录状态检查
// onMounted(() => {
//   nextTick(() => {
//     // 检查登录状态
//     if (!userStore.isLogin) {
//       router.push('/login');
//     }
//   });
// });
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.layout-aside {
  background-color: #0f172a;
  color: #fff;
  overflow: hidden;
}

.logo {
  text-align: center;
  line-height: 60px;
  font-size: 18px;
  font-weight: bold;
  background-color: #1e293b;
  color: #1890ff;
}

.layout-menu {
  border-right: none;
  height: calc(100vh - 60px);
}

.layout-header {
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left .el-icon {
  font-size: 20px;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 10px;
}

.arrow-down {
  font-size: 16px;
}

.layout-main {
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
}
</style>