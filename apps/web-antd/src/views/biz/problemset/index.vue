<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';

import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Tag,
} from 'ant-design-vue';

// 创建所需的图标
const SearchIcon = createIconifyIcon('lucide:search');
const FilterIcon = createIconifyIcon('lucide:filter');
const ZapIcon = createIconifyIcon('lucide:zap');

// 题目接口类型定义
interface ProblemItem {
  id: number;
  title: string;
  titleSlug: string;
  difficulty: 'Easy' | 'Hard' | 'Medium';
  tags: string[];
  acceptanceRate: number;
  acceptedCount: number;
  submissionCount: number;
  isPaidOnly: boolean;
  status?: 'Accepted' | 'Attempted' | null;
  description?: string;
}

// 响应式数据
const loading = ref(false);
const searchKeyword = ref('');
const selectedDifficulty = ref<string | undefined>(undefined);
const selectedTag = ref<string | undefined>(undefined);
const currentPage = ref(1);
const pageSize = ref(12);

// 模拟题目数据
const mockProblems = ref<ProblemItem[]>([
  {
    id: 1,
    title: '两数之和',
    titleSlug: 'two-sum',
    difficulty: 'Easy',
    tags: ['数组', '哈希表'],
    acceptanceRate: 52.3,
    acceptedCount: 3_210_000,
    submissionCount: 6_140_000,
    isPaidOnly: false,
    status: 'Accepted',
    description:
      '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回它们的数组下标。',
  },
  {
    id: 2,
    title: '整数反转',
    titleSlug: 'reverse-integer',
    difficulty: 'Medium',
    tags: ['数学'],
    acceptanceRate: 26.1,
    acceptedCount: 1_840_000,
    submissionCount: 7_050_000,
    isPaidOnly: false,
    status: 'Attempted',
    description:
      '给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。',
  },
  {
    id: 3,
    title: '回文数',
    titleSlug: 'palindrome-number',
    difficulty: 'Easy',
    tags: ['数学'],
    acceptanceRate: 53.7,
    acceptedCount: 2_450_000,
    submissionCount: 4_560_000,
    isPaidOnly: false,
    status: null,
    description:
      '给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。',
  },
  {
    id: 4,
    title: '正则表达式匹配',
    titleSlug: 'regular-expression-matching',
    difficulty: 'Hard',
    tags: ['字符串', '动态规划', '回溯'],
    acceptanceRate: 27.9,
    acceptedCount: 680_000,
    submissionCount: 2_440_000,
    isPaidOnly: false,
    status: null,
    description:
      '给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 "." 和 "*" 的正则表达式匹配。',
  },
  {
    id: 5,
    title: '盛最多水的容器',
    titleSlug: 'container-with-most-water',
    difficulty: 'Medium',
    tags: ['贪心', '数组', '双指针'],
    acceptanceRate: 60.2,
    acceptedCount: 1_560_000,
    submissionCount: 2_590_000,
    isPaidOnly: false,
    status: 'Accepted',
    description:
      '给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i])。',
  },
  {
    id: 6,
    title: '三数之和',
    titleSlug: 'three-sum',
    difficulty: 'Medium',
    tags: ['数组', '双指针', '排序'],
    acceptanceRate: 34.7,
    acceptedCount: 1_280_000,
    submissionCount: 3_690_000,
    isPaidOnly: false,
    status: null,
    description: '给你一个整数数组 nums ，判断是否存在三元组使得它们的和为 0。',
  },
  {
    id: 7,
    title: '电话号码的字母组合',
    titleSlug: 'letter-combinations-of-a-phone-number',
    difficulty: 'Medium',
    tags: ['哈希表', '字符串', '回溯'],
    acceptanceRate: 57,
    acceptedCount: 980_000,
    submissionCount: 1_720_000,
    isPaidOnly: false,
    status: 'Attempted',
    description:
      '给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。',
  },
  {
    id: 8,
    title: '四数之和',
    titleSlug: 'four-sum',
    difficulty: 'Medium',
    tags: ['数组', '双指针', '排序'],
    acceptanceRate: 37.2,
    acceptedCount: 540_000,
    submissionCount: 1_450_000,
    isPaidOnly: false,
    status: null,
    description: '给你一个由 n 个整数组成的数组 nums ，和一个目标值 target 。',
  },
  {
    id: 9,
    title: '删除链表的倒数第 N 个结点',
    titleSlug: 'remove-nth-node-from-end-of-list',
    difficulty: 'Medium',
    tags: ['链表', '双指针'],
    acceptanceRate: 43.2,
    acceptedCount: 1_120_000,
    submissionCount: 2_590_000,
    isPaidOnly: false,
    status: 'Accepted',
    description:
      '给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。',
  },
  {
    id: 10,
    title: '有效的括号',
    titleSlug: 'valid-parentheses',
    difficulty: 'Easy',
    tags: ['栈', '字符串'],
    acceptanceRate: 44,
    acceptedCount: 1_680_000,
    submissionCount: 3_820_000,
    isPaidOnly: false,
    status: null,
    description:
      '给定一个只包括 "("，")"，"{"，"}"，"["，"]" 的字符串 s ，判断字符串是否有效。',
  },
  {
    id: 11,
    title: '合并两个有序链表',
    titleSlug: 'merge-two-sorted-lists',
    difficulty: 'Easy',
    tags: ['递归', '链表'],
    acceptanceRate: 66.2,
    acceptedCount: 1_950_000,
    submissionCount: 2_940_000,
    isPaidOnly: false,
    status: 'Accepted',
    description: '将两个升序链表合并为一个新的升序链表并返回。',
  },
  {
    id: 12,
    title: '括号生成',
    titleSlug: 'generate-parentheses',
    difficulty: 'Medium',
    tags: ['字符串', '动态规划', '回溯'],
    acceptanceRate: 77.4,
    acceptedCount: 980_000,
    submissionCount: 1_270_000,
    isPaidOnly: false,
    status: null,
    description:
      '数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且有效的括号组合。',
  },
]);

// 难度选项
const difficultyOptions = [
  { label: '简单', value: 'Easy' },
  { label: '中等', value: 'Medium' },
  { label: '困难', value: 'Hard' },
];

// 标签选项
const tagOptions = [
  { label: '数组', value: '数组' },
  { label: '哈希表', value: '哈希表' },
  { label: '字符串', value: '字符串' },
  { label: '数学', value: '数学' },
  { label: '动态规划', value: '动态规划' },
  { label: '回溯', value: '回溯' },
  { label: '双指针', value: '双指针' },
  { label: '链表', value: '链表' },
  { label: '栈', value: '栈' },
  { label: '贪心', value: '贪心' },
  { label: '排序', value: '排序' },
  { label: '递归', value: '递归' },
];

// 筛选后的题目列表
const filteredProblems = computed(() => {
  let filtered = mockProblems.value;

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter(
      (problem) =>
        problem.title.toLowerCase().includes(keyword) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(keyword)) ||
        problem.id.toString().includes(keyword),
    );
  }

  // 按难度筛选
  if (selectedDifficulty.value) {
    filtered = filtered.filter(
      (problem) => problem.difficulty === selectedDifficulty.value,
    );
  }

  // 按标签筛选
  if (selectedTag.value) {
    filtered = filtered.filter((problem) =>
      problem.tags.includes(selectedTag.value!),
    );
  }

  // 分页
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filtered.slice(start, end);
});

// 计算总数
const totalProblems = computed(() => {
  let filtered = mockProblems.value;

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter(
      (problem) =>
        problem.title.toLowerCase().includes(keyword) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(keyword)) ||
        problem.id.toString().includes(keyword),
    );
  }

  if (selectedDifficulty.value) {
    filtered = filtered.filter(
      (problem) => problem.difficulty === selectedDifficulty.value,
    );
  }

  if (selectedTag.value) {
    filtered = filtered.filter((problem) =>
      problem.tags.includes(selectedTag.value!),
    );
  }

  return filtered.length;
});

// 获取难度颜色
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': {
      return 'success';
    }
    case 'Hard': {
      return 'error';
    }
    case 'Medium': {
      return 'warning';
    }
    default: {
      return 'default';
    }
  }
};

// 获取难度文本
const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': {
      return '简单';
    }
    case 'Hard': {
      return '困难';
    }
    case 'Medium': {
      return '中等';
    }
    default: {
      return difficulty;
    }
  }
};

// 获取状态颜色
const getStatusColor = (status: null | string | undefined) => {
  switch (status) {
    case 'Accepted': {
      return '#52c41a';
    }
    case 'Attempted': {
      return '#faad14';
    }
    default: {
      return '#d9d9d9';
    }
  }
};

// 重置筛选
const resetFilters = () => {
  searchKeyword.value = '';
  selectedDifficulty.value = undefined;
  selectedTag.value = undefined;
  currentPage.value = 1;
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
};

// 跳转到题目详情（模拟）
const goToProblem = (_problem: ProblemItem) => {
  // 这里可以实现路由跳转
  // router.push(`/problemset/${problem.titleSlug}`);
  // console.info('跳转到题目:', problem.title);
};

// 统计信息
const stats = computed(() => {
  const total = mockProblems.value.length;
  const solved = mockProblems.value.filter(
    (p) => p.status === 'Accepted',
  ).length;
  const attempted = mockProblems.value.filter(
    (p) => p.status === 'Attempted',
  ).length;

  return {
    total,
    solved,
    attempted,
    remaining: total - solved - attempted,
  };
});

// 组件挂载
onMounted(() => {
  loading.value = true;
  // 模拟加载数据
  setTimeout(() => {
    loading.value = false;
  }, 500);
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
              {{ stats.total }}
            </div>
            <div class="text-sm text-gray-500">总题目</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ stats.solved }}
            </div>
            <div class="text-sm text-gray-500">已解决</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">
              {{ stats.attempted }}
            </div>
            <div class="text-sm text-gray-500">尝试过</div>
          </div>
        </div>
      </div>

      <!-- 搜索和筛选区域 -->
      <Card class="shadow-sm">
        <div class="flex flex-wrap items-center gap-4">
          <div class="min-w-60 flex-1">
            <Input
              v-model:value="searchKeyword"
              placeholder="搜索题目名称、标签或题号..."
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

    <div v-else-if="filteredProblems.length === 0" class="py-12">
      <Empty
        description="没有找到匹配的题目"
        :image="Empty.PRESENTED_IMAGE_SIMPLE"
      >
        <Button type="primary" @click="resetFilters">重置筛选条件</Button>
      </Empty>
    </div>

    <div v-else>
      <Row :gutter="[16, 16]">
        <Col
          v-for="problem in filteredProblems"
          :key="problem.id"
          :xs="24"
          :sm="12"
          :lg="8"
          :xl="6"
        >
          <Card
            hoverable
            class="problem-card h-full cursor-pointer transition-all duration-200 hover:shadow-lg"
            @click="goToProblem(problem)"
          >
            <!-- 卡片头部 -->
            <div class="mb-3 flex items-start justify-between">
              <div class="flex items-center gap-2">
                <Avatar
                  :style="{ backgroundColor: getStatusColor(problem.status) }"
                  size="small"
                >
                  <span class="text-xs font-bold text-white">
                    {{ problem.id }}
                  </span>
                </Avatar>
                <Badge
                  :color="getDifficultyColor(problem.difficulty)"
                  :text="getDifficultyText(problem.difficulty)"
                />
              </div>
              <div v-if="problem.isPaidOnly" class="text-orange-500">
                <ZapIcon title="会员题目" />
              </div>
            </div>

            <!-- 题目标题 -->
            <h3 class="mb-2 line-clamp-2 min-h-14 text-lg font-semibold">
              {{ problem.title }}
            </h3>

            <!-- 题目描述 -->
            <p
              class="mb-3 line-clamp-2 min-h-10 text-sm text-gray-600 dark:text-gray-400"
            >
              {{ problem.description }}
            </p>

            <!-- 标签 -->
            <div class="mb-4 min-h-8">
              <Space wrap>
                <Tag
                  v-for="tag in problem.tags.slice(0, 3)"
                  :key="tag"
                  color="blue"
                  class="rounded-full"
                >
                  {{ tag }}
                </Tag>
                <Tag v-if="problem.tags.length > 3" color="default">
                  +{{ problem.tags.length - 3 }}
                </Tag>
              </Space>
            </div>

            <!-- 统计信息 -->
            <div
              class="flex items-center justify-between border-t border-gray-100 pt-3 text-sm text-gray-500 dark:border-gray-700"
            >
              <div class="flex items-center gap-4">
                <span>通过 {{ formatNumber(problem.acceptedCount) }}</span>
                <span>提交 {{ formatNumber(problem.submissionCount) }}</span>
              </div>
              <div class="font-medium text-green-600">
                {{ problem.acceptanceRate.toFixed(1) }}%
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <!-- 分页 -->
      <div class="mt-8 flex justify-center">
        <Pagination
          v-model:current="currentPage"
          :total="totalProblems"
          :page-size="pageSize"
          :show-size-changer="false"
          :show-quick-jumper="true"
          :show-total="
            (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          "
          @change="handlePageChange"
        />
      </div>
    </div>
  </Page>
</template>

<style scoped>
.problem-card {
  transition: all 0.3s ease;
}

.problem-card:hover {
  transform: translateY(-2px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.min-h-14 {
  min-height: 3.5rem;
}

.min-h-10 {
  min-height: 2.5rem;
}

.min-h-8 {
  min-height: 2rem;
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
