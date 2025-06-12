import type {VbenFormSchema} from '#/adapter/form';
import type {VxeTableGridOptions} from '#/adapter/vxe-table';
import type {TagApi} from '#/api/biz/tag';

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
      fieldName: 'name',
      label: '标签名',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入标签名',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '标签名',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入标签名',
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<TagApi.Tag>['columns'] {
  return [
  { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '编号',
      minWidth: 120,
    },
    {
      field: 'name',
      title: '标签名',
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