<script lang="ts" setup>
import type { QuestionApi } from '#/api/biz/question';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createQuestion,
  getQuestion,
  updateQuestion,
} from '#/api/biz/question';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<QuestionApi.Question>();

const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['题目'])
    : $t('ui.actionTitle.create', ['题目']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  fullscreen: true,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    // 提交表单
    const formValues = (await formApi.getValues()) as QuestionApi.Question & {
      judgeCaseList?: Array<{ input: string; output: string }>;
      memoryLimit?: number;
      stackLimit?: number;
      timeLimit?: number;
    };

    // 组合判题配置
    const judgeConfig = {
      memoryLimit: formValues.memoryLimit,
      stackLimit: formValues.stackLimit,
      timeLimit: formValues.timeLimit,
    };

    // 处理判题用例
    const judgeCase = formValues.judgeCaseList || [];

    // 移除临时字段并添加判题配置和用例
    const { memoryLimit, stackLimit, timeLimit, judgeCaseList, ...data } =
      formValues;
    const submitData = {
      ...data,
      judgeConfig: JSON.stringify(judgeConfig),
      judgeCase: JSON.stringify(judgeCase),
    };

    try {
      await (formData.value?.id
        ? updateQuestion(submitData)
        : createQuestion(submitData));
      // 关闭并提示
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }

    // 加载数据
    let data = modalApi.getData<QuestionApi.Question>();
    if (!data) {
      return;
    }

    // 为新建题目设置默认判题用例
    if (!data.id) {
      (data as any).judgeCaseList = [{ input: '', output: '' }];
    }
    if (data.id) {
      modalApi.lock();
      try {
        data = await getQuestion(data.id);
        // 处理标签数据
        if (data.tags) {
          data.tagIds = data.tags.map((tag) => tag.id);
        }
        // 处理判题配置数据
        if (data.judgeConfig) {
          try {
            const judgeConfig = JSON.parse(data.judgeConfig);
            (data as any).memoryLimit = judgeConfig.memoryLimit;
            (data as any).stackLimit = judgeConfig.stackLimit;
            (data as any).timeLimit = judgeConfig.timeLimit;
          } catch (error) {
            console.error('解析判题配置失败:', error);
          }
        }
        // 处理判题用例数据
        if (data.judgeCase) {
          try {
            const judgeCaseList = JSON.parse(data.judgeCase);
            (data as any).judgeCaseList = Array.isArray(judgeCaseList)
              ? judgeCaseList
              : [];
          } catch (error) {
            console.error('解析判题用例失败:', error);
            (data as any).judgeCaseList = [];
          }
        } else {
          // 如果没有判题用例，提供默认值
          (data as any).judgeCaseList = [{ input: '', output: '' }];
        }
      } finally {
        modalApi.unlock();
      }
    }
    // 设置到 values
    formData.value = data;
    await formApi.setValues(formData.value);
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
