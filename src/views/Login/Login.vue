<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autocomplete="on" :model="loginForm" ref="loginForm" label-position="left">
        <div style="text-align: center">
          <img src="@/assets/icons/project_logo.png" />
        </div>
        <h2 class="login-title color-main">{{ $t('login.btn') }}</h2>
        <LangSelect />
        <el-form-item>
          <el-input
            name="userId"
            type="text"
            v-model="loginForm.userId"
            autocomplete="on"
            :placeholder= "$t('login.useridinput')"
            clearable
          >
            <span slot="prefix">
              <i class="el-icon-user-solid"></i>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            name="password"
            :type="pwdType"
            @keyup.enter.native="handleLogin"
            v-model="loginForm.password"
            autocomplete="off"
            :placeholder="$t('login.userpasswordinput')"
            clearable
          >
            <span slot="prefix">
              <i class="el-icon-key"></i>
            </span>
            <span slot="suffix" @click="showPwd">
              <i class="el-icon-view"></i>
            </span>
          </el-input>
        </el-form-item>
        <p class="alertInfo">{{ alertInfo }}</p>
        <el-form-item style="margin-bottom: 60px">
          <el-button style="width: 100%" type="primary" :loading="loading" @click.native.prevent="handleLogin">{{
            $t('login.btn')
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout" />
  </div>
</template>

<script>
import login_center_bg from '@/assets/images/login_center_bg.png';
import { getQueryString } from '@/utils/url';
import LangSelect from '@/components/LangSelect';
export default {
  name: 'login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('??????????????????3???'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        userId: '',
        passWord: '123456',
      },
      loading: false,
      pwdType: 'password',
      alertInfo: '',
      login_center_bg,
    };
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = '';
      } else {
        this.pwdType = 'password';
      }
    },
    handleLogin() {
      this.loading = true;
      this.$store
        .dispatch('user/Login', this.loginForm)
        .finally(() => {
          this.loading = false;
        })
        .then(
          (result) => {
            if (result === 'success') {
              // ??????????????????redirect????????????
              var redirectUrl = getQueryString(window.location.href, 'redirect');
              if (redirectUrl !== '') {
                redirectUrl = redirectUrl.replace(/%2F/g, '/');
                console.log(redirectUrl.substr(1));
                this.$router.push({ path: redirectUrl.substr(1) });
              } else {
                this.$router.push({ path: 'home/main' });
              }
            } else {
              //tell the user that user id or password is not correct
              this.alertInfo = '??????ID?????????????????????????????????';
            }
          },
          (result) => {
            alert(result);
          }
        );
    },
  },
  components: {
    LangSelect,
  },
};
</script>

<style scoped>
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 140px auto;
  border-top: 10px solid #1890ff;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #1890ff;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
</style>
