import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { QuestionApi } from '#/api/biz/question';

import { getTagListAll } from '#/api/biz/tag';
import { getDictOptions } from '#/utils';

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'title',
      label: '标题',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入标题',
      },
    },
    {
      fieldName: 'difficulty',
      label: '难度',
      rules: 'required',
      component: 'Select',
      componentProps: {
        placeholder: '请选择难度',
        options: getDictOptions('question_difficulty'),
      },
    },
    {
      fieldName: 'tagIds',
      label: '标签',
      component: 'ApiSelect',
      componentProps: {
        mode: 'multiple',
        allowClear: true,
        placeholder: '请选择标签',
        api: async () => {
          const tags = await getTagListAll();
          return tags.map((tag) => ({
            label: tag.name || '',
            value: tag.id,
          }));
        },
      },
    },
    {
      fieldName: 'content',
      label: '内容',
      rules: 'required',
      component: 'RichTextarea',
    },
    {
      fieldName: 'answer',
      label: '答案',
      rules: 'required',
      component: 'RichTextarea',
    },
    {
      fieldName: 'judgeConfigTitle',
      component: 'Divider',
      componentProps: {
        orientation: 'center',
        orientationMargin: 0,
      },
      label: '判题配置',
      dependencies: {
        triggerFields: [''],
        show: () => true,
      },
    },
    {
      fieldName: 'timeLimit',
      label: '时间限制',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入时间限制',
        min: 1,
        max: 30_000, // 30秒
      },
    },
    {
      fieldName: 'memoryLimit',
      label: '内存限制',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入内存限制',
        min: 1,
        max: 1024 * 1024, // 1GB
      },
    },
    {
      fieldName: 'stackLimit',
      label: '堆栈限制',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入堆栈限制',
        min: 1,
        max: 1024 * 1024, // 1GB
      },
    },
    {
      fieldName: 'judgeCaseList',
      label: '',
      component: 'JudgeCaseList',
      componentProps: {
        placeholder: '请配置判题测试用例',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'title',
      label: '标题',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入标题',
      },
    },
    {
      fieldName: 'difficulty',
      label: '难度',
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择难度',
        options: getDictOptions('question_difficulty'),
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<QuestionApi.Question>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'title',
      title: '标题',
      minWidth: 120,
    },
    {
      field: 'difficulty',
      title: '难度',
      minWidth: 100,
      cellRender: { name: 'CellDict', props: { type: 'question_difficulty' } },
    },
    {
      field: 'tags',
      title: '标签',
      minWidth: 120,
      formatter: ({ cellValue }) => {
        if (!cellValue || !Array.isArray(cellValue)) {
          return '';
        }
        return cellValue.map((tag) => tag.name).join(', ');
      },
    },
    {
      field: 'submitNum',
      title: '题目提交数',
      minWidth: 120,
    },
    {
      field: 'acceptNum',
      title: '题目通过数',
      minWidth: 120,
    },
    {
      field: 'thumbNum',
      title: '点赞数',
      minWidth: 120,
    },
    {
      field: 'favourNum',
      title: '收藏数',
      minWidth: 120,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
