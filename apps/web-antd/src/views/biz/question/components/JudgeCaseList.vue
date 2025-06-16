<script lang="ts" setup>
import { ref, watch } from 'vue';

import { Button, Textarea } from 'ant-design-vue';

interface JudgeCase {
  input: string;
  output: string;
}

interface Props {
  modelValue?: JudgeCase[];
}

interface Emits {
  (e: 'update:modelValue', value: JudgeCase[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
});

const emit = defineEmits<Emits>();

const cases = ref<JudgeCase[]>([]);

// 初始化数据
cases.value =
  props.modelValue && props.modelValue.length > 0
    ? [...props.modelValue]
    : [{ input: '', output: '' }];

// 添加用例
function addCase() {
  cases.value.push({ input: '', output: '' });
  emitChange();
}

// 删除用例
function removeCase(index: number) {
  if (cases.value.length > 1) {
    cases.value.splice(index, 1);
    emitChange();
  }
}

// 发送变化事件
function emitChange() {
  emit('update:modelValue', cases.value);
}

// 监听外部变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && Array.isArray(newValue)) {
      cases.value = [...newValue];
    }
  },
  { deep: true },
);
</script>

<template>
  <div class="judge-case-list">
    <div class="mb-6">
      <div class="mb-4 text-center">
        <span
          class="border-b-2 border-gray-300 px-4 pb-2 text-base font-medium text-gray-800"
          >判题用例</span
        >
      </div>
      <div class="text-center">
        <Button type="primary" size="small" @click="addCase">
          + 添加用例
        </Button>
      </div>
    </div>

    <div
      v-for="(caseItem, index) in cases"
      :key="index"
      class="mb-4 rounded-lg border border-gray-200 p-4"
    >
      <div class="mb-2 flex items-center justify-between">
        <span class="text-sm font-medium text-gray-600"
          >测试用例 {{ index + 1 }}</span
        >
        <Button
          v-if="cases.length > 1"
          type="text"
          danger
          size="small"
          @click="removeCase(index)"
        >
          删除
        </Button>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >输入</label
          >
          <Textarea
            v-model:value="caseItem.input"
            placeholder="请输入测试用例的输入数据"
            :rows="3"
            @change="emitChange"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >输出</label
          >
          <Textarea
            v-model:value="caseItem.output"
            placeholder="请输入测试用例的预期输出"
            :rows="3"
            @change="emitChange"
          />
        </div>
      </div>
    </div>

    <div v-if="cases.length === 0" class="py-8 text-center text-gray-500">
      暂无测试用例，请点击上方按钮添加
    </div>
  </div>
</template>

<style scoped>
.judge-case-list {
  width: 100%;
}
</style>
