<script lang="ts" setup>
import type { QuestionApi } from '#/api/biz/question';
import type { TagApi } from '#/api/biz/tag';

import { onMounted, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';

import {
  Button,
  Card,
  Empty,
  Input,
  Pagination,
  Select,
  Space,
  Tag,
} from 'ant-design-vue';

import { getQuestionPage } from '#/api/biz/question';
import { getTagListAll } from '#/api/biz/tag';
import { getDictLabel, getDictOptions } from '#/utils';

// 创建所需的图标
const SearchIcon = createIconifyIcon('lucide:search');
const FilterIcon = createIconifyIcon('lucide:filter');
const ZapIcon = createIconifyIcon('lucide:zap');

// 响应式数据
const loading = ref(false);
const searchKeyword = ref('');
const selectedDifficulty = ref<string | undefined>(undefined);
const selectedTag = ref<string | undefined>(undefined);
const currentPage = ref(1);
const pageSize = ref(12);
const problems = ref<QuestionApi.Question[]>([]);
const total = ref(0);

// 难度选项 - 使用字典
const difficultyOptions = getDictOptions('question_difficulty').map((item) => ({
  label: item.label,
  value: item.value as number | string,
}));

// 标签选项
const tagOptions = ref<{ label: string; value: string }[]>([]);

// 获取题目列表
const fetchProblems = async () => {
  loading.value = true;
  try {
    const params = {
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      title: searchKeyword.value || undefined,
      difficulty: selectedDifficulty.value,
      tags: selectedTag.value ? [selectedTag.value] : undefined,
    };
    const res = await getQuestionPage(params);
    problems.value = res.list;
    total.value = res.total;
  } catch (error) {
    console.error('获取题目列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 获取难度文本
const getDifficultyText = (difficulty: string) => {
  return getDictLabel('question_difficulty', difficulty) || difficulty;
};

// 获取难度对应的样式
const getDifficultyClass = (difficulty: string) => {
  const options = getDictOptions('question_difficulty');
  const dictItem = options.find((o) => o.value == difficulty);
  switch (dictItem?.colorType) {
    case 'error': {
      return 'text-red-600 dark:text-red-400';
    }
    case 'success': {
      return 'text-green-600 dark:text-green-400';
    }
    case 'warning': {
      return 'text-orange-600 dark:text-orange-400';
    }
    default: {
      return 'text-gray-500 dark:text-gray-400';
    }
  }
};

// 重置筛选
const resetFilters = () => {
  searchKeyword.value = '';
  selectedDifficulty.value = undefined;
  selectedTag.value = undefined;
  currentPage.value = 1;
  fetchProblems();
};

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// 页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchProblems();
};

// 跳转到题目详情
const goToProblem = (problem: QuestionApi.Question) => {
  // 这里可以实现路由跳转
  // router.push(`/problemset/${problem.id}`);
  console.info('跳转到题目:', problem.title);
};

// 监听筛选条件变化
watch([searchKeyword, selectedDifficulty, selectedTag], () => {
  currentPage.value = 1;
  fetchProblems();
});

// 获取所有标签
const fetchTags = async () => {
  try {
    const res = await getTagListAll();
    tagOptions.value =
      res.map((tag: TagApi.Tag) => ({
        label: tag.name || '',
        value: tag.name || '',
      })) || [];
  } catch (error) {
    console.error('获取标签列表失败:', error);
  }
};

// 组件挂载
onMounted(() => {
  fetchProblems();
  fetchTags();
});
</script>

<template>
  <Page auto-content-height>
    <!-- 页面头部 -->
    <div class="mb-6">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            题库
          </h1>
          <p class="mt-1 text-gray-600 dark:text-gray-400">
            精选算法题目，提升编程能力
          </p>
        </div>

        <!-- 统计信息 -->
        <div class="flex gap-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">
              {{ total }}
            </div>
            <div class="text-sm text-gray-500">总题目</div>
          </div>
        </div>
      </div>

      <!-- 搜索和筛选区域 -->
      <Card class="shadow-sm">
        <div class="flex flex-wrap items-center gap-4">
          <div class="min-w-60 flex-1">
            <Input
              v-model:value="searchKeyword"
              placeholder="搜索题目名称或题号..."
              size="large"
              allow-clear
            >
              <template #prefix>
                <SearchIcon class="text-gray-400" />
              </template>
            </Input>
          </div>

          <Select
            v-model:value="selectedDifficulty"
            placeholder="难度"
            size="large"
            style="width: 120px"
            allow-clear
            :options="difficultyOptions"
          />

          <Select
            v-model:value="selectedTag"
            placeholder="标签"
            size="large"
            style="width: 150px"
            allow-clear
            show-search
            :options="tagOptions"
          />

          <Button @click="resetFilters" size="large">
            <template #icon>
              <FilterIcon />
            </template>
            重置
          </Button>
        </div>
      </Card>
    </div>

    <!-- 题目列表 -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <div class="mb-4">
          <ZapIcon class="animate-pulse text-4xl text-blue-500" />
        </div>
        <div class="text-gray-500">加载中...</div>
      </div>
    </div>

    <div v-else-if="problems.length === 0" class="py-12">
      <Empty
        description="没有找到匹配的题目"
        :image="Empty.PRESENTED_IMAGE_SIMPLE"
      >
        <Button type="primary" @click="resetFilters">重置筛选条件</Button>
      </Empty>
    </div>

    <div v-else>
      <Card class="shadow-sm">
        <div class="space-y-1">
          <div
            v-for="problem in problems"
            :key="problem.id"
            class="problem-item cursor-pointer rounded-lg border border-transparent p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
            @click="goToProblem(problem)"
          >
            <div class="flex items-center justify-between">
              <!-- 左侧：题目信息 -->
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-4">
                  <!-- 题号 -->
                  <div class="w-8 flex-shrink-0 text-center">
                    <span class="font-mono text-sm text-gray-500">
                      {{ problem.id }}
                    </span>
                  </div>

                  <!-- 题目标题和标签 -->
                  <div class="min-w-0 flex-1">
                    <h3
                      class="truncate text-base font-medium text-gray-900 dark:text-gray-100"
                    >
                      {{ problem.title }}
                    </h3>
                    <!-- 标签 -->
                    <div class="mt-1.5 flex items-center gap-2">
                      <Space wrap>
                        <Tag
                          v-for="tag in problem.tags?.slice(0, 4)"
                          :key="tag.id"
                          :bordered="false"
                          class="bg-blue-100 text-xs text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                          size="small"
                        >
                          {{ tag.name }}
                        </Tag>
                        <Tag
                          v-if="problem.tags && problem.tags.length > 4"
                          color="default"
                          size="small"
                        >
                          +{{ problem.tags.length - 4 }}
                        </Tag>
                      </Space>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 右侧：统计信息和难度 -->
              <div class="ml-6 flex flex-shrink-0 items-center gap-x-8">
                <!-- 难度 -->
                <div
                  :class="getDifficultyClass(problem.difficulty || '')"
                  class="w-12 text-center text-sm font-medium"
                >
                  {{ getDifficultyText(problem.difficulty || '') }}
                </div>

                <!-- 通过率 -->
                <div class="w-20 text-center">
                  <div class="font-medium text-gray-900 dark:text-gray-100">
                    {{
                      problem.acceptNum && problem.submitNum
                        ? (
                            (problem.acceptNum / problem.submitNum) *
                            100
                          ).toFixed(1)
                        : '0.0'
                    }}%
                  </div>
                  <div class="text-xs text-gray-500">通过率</div>
                </div>

                <!-- 通过/提交 -->
                <div class="w-24 text-center">
                  <div class="font-medium text-gray-900 dark:text-gray-100">
                    {{ formatNumber(problem.acceptNum || 0) }} /
                    {{ formatNumber(problem.submitNum || 0) }}
                  </div>
                  <div class="text-xs text-gray-500">通过/提交</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- 分页 -->
      <div class="mt-6 flex justify-center">
        <Pagination
          v-model:current="currentPage"
          :page-size="pageSize"
          :show-quick-jumper="true"
          :show-size-changer="false"
          :show-total="
            (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          "
          :total="total"
          @change="handlePageChange"
        />
      </div>
    </div>
  </Page>
</template>

<style scoped>
.problem-item:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
  transform: translateY(-1px);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
