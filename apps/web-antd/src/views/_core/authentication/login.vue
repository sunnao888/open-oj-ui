<script lang="ts" setup>
import type {VbenFormSchema} from '@vben/common-ui';
import {AuthenticationLogin, Verification, z} from '@vben/common-ui';

import {checkCaptcha, getCaptcha, socialAuthRedirect,} from '#/api/core/auth';

import {computed, ref} from 'vue';
import {useRoute} from 'vue-router';
import {isCaptchaEnable} from '@vben/hooks';
import {$t} from '@vben/locales';
import {useAuthStore} from '#/store';

defineOptions({name: 'Login'});

const {query} = useRoute();
const authStore = useAuthStore();
const captchaEnable = isCaptchaEnable();

const loginRef = ref();
const verifyRef = ref();

const captchaType = 'blockPuzzle'; // 验证码类型：'blockPuzzle' | 'clickWord'

/** 处理登录 */
async function handleLogin(values: any) {
  // 如果开启验证码，则先验证验证码
  if (captchaEnable) {
    verifyRef.value.show();
    return;
  }
  // 无验证码，直接登录
  await authStore.authLogin('username', values);
}

/** 验证码通过，执行登录 */
async function handleVerifySuccess({captchaVerification}: any) {
  try {
    await authStore.authLogin('username', {
      ...(await loginRef.value.getFormApi().getValues()),
      captchaVerification,
    });
  } catch (error) {
    console.error('Error in handleLogin:', error);
  }
}

/** 处理第三方登录 */
const redirect = query?.redirect;

async function handleThirdLogin(type: number) {
  if (type <= 0) {
    return;
  }
  try {
    // 计算 redirectUri
    // tricky: type、redirect 需要先 encode 一次，否则钉钉回调会丢失。配合 social-login.vue#getUrlValue() 使用
    const redirectUri = `${
        location.origin
    }/auth/social-login?${encodeURIComponent(
        `type=${type}&redirect=${redirect || '/'}`,
    )}`;

    // 进行跳转
    window.location.href = await socialAuthRedirect(type, redirectUri);
  } catch (error) {
    console.error('第三方登录处理失败:', error);
  }
}

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z
          .string()
          .min(1, {message: $t('authentication.usernameTip')})
          .default(import.meta.env.VITE_APP_DEFAULT_USERNAME),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.passwordTip'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z
          .string()
          .min(1, {message: $t('authentication.passwordTip')})
          .default(import.meta.env.VITE_APP_DEFAULT_PASSWORD),
    },
  ];
});
</script>

<template>
  <div>
    <AuthenticationLogin
        ref="loginRef"
        :form-schema="formSchema"
        :loading="authStore.loginLoading"
        @submit="handleLogin"
        @third-login="handleThirdLogin"
    />
    <Verification
        v-if="captchaEnable"
        ref="verifyRef"
        :captcha-type="captchaType"
        :check-captcha-api="checkCaptcha"
        :get-captcha-api="getCaptcha"
        :img-size="{ width: '400px', height: '200px' }"
        mode="pop"
        @on-success="handleVerifySuccess"
    />
  </div>
</template>
