import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { QuestionApi } from '#/api/biz/question';
import { getTagListAll } from '#/api/biz/tag';


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
      fieldName: 'judgeCase',
      label: '判题用例',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入判题用例(json数组)',
      },
    },
    {
      fieldName: 'judgeConfig',
      label: '判题配置',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入判题配置(json对象)',
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
          return tags.map(tag => ({
            label: tag.name || '',
            value: tag.id,
          }));
        },
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
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<QuestionApi.Question>['columns'] {
  return [
  { type: 'checkbox', width: 40 },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    {
      field: 'title',
      title: '标题',
      minWidth: 120,
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
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}