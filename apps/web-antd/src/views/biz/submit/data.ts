import type {VbenFormSchema} from '#/adapter/form';
import type {VxeTableGridOptions} from '#/adapter/vxe-table';
import type {QuestionSubmitApi} from '#/api/biz/submit';
import {DICT_TYPE, getDictOptions, getRangePickerDefaultProps,} from '#/utils';

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
      fieldName: 'questionId',
      label: '题目id',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入题目id',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'language',
      label: '编程语言',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入编程语言',
      },
    },
    {
      fieldName: 'status',
      label: '判题状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.BIZ_JUDGE_STATUS, 'number'),
        placeholder: '请选择判题状态',
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<QuestionSubmitApi.QuestionSubmit>['columns'] {
  return [
  { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '编号',
      minWidth: 120,
    },
    {
      field: 'questionId',
      title: '题目id',
      minWidth: 120,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    {
      field: 'language',
      title: '编程语言',
      minWidth: 120,
    },
    {
      field: 'code',
      title: '用户代码',
      minWidth: 120,
    },
    {
      field: 'judgeInfo',
      title: '判题信息',
      minWidth: 120,
    },
    {
      field: 'status',
      title: '判题状态',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.BIZ_JUDGE_STATUS },
      },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

