<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { QuestionApi } from '#/api/biz/question';

import { Page, useVbenModal } from '@vben/common-ui';
import { message,Tabs } from 'ant-design-vue';
import Form from './modules/form.vue';


import { ref, computed } from 'vue';
import { $t } from '#/locales';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getQuestionPage, deleteQuestion, deleteQuestionListByIds, exportQuestion } from '#/api/biz/question';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { useGridColumns, useGridFormSchema } from './data';


const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true
});


/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 创建题目 */
function handleCreate() {
  formModalApi.setData({}).open();
}

/** 编辑题目 */
function handleEdit(row: QuestionApi.Question) {
  formModalApi.setData(row).open();
}


/** 删除题目 */
async function handleDelete(row: QuestionApi.Question) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    key: 'action_key_msg'
  });
  try {
    await deleteQuestion(row.id as number);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.id]),
      key: 'action_key_msg',
    });
    onRefresh();
  } finally {
    hideLoading();
  }
}

/** 批量删除题目 */
async function handleDeleteBatch() {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting'),
    key: 'action_key_msg'
  });
  try {
    await deleteQuestionListByIds(deleteIds.value);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess'),
      key: 'action_key_msg',
    });
    onRefresh();
  } finally {
    hideLoading();
  }
}

const deleteIds = ref<number[]>([]) // 待删除题目 ID
function setDeleteIds({
  records
}: {
  records: QuestionApi.Question[];
}) {
  deleteIds.value = records.map((item) => item.id).filter((id): id is number => id !== undefined);
}

/** 导出表格 */
async function handleExport() {
  const data = await exportQuestion(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '题目.xls', source: data });
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema()
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    pagerConfig: {
      enabled: true,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getQuestionPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: { code: 'query' },
      search: true,
    }
  } as VxeTableGridOptions<QuestionApi.Question>,
  gridEvents:{
      checkboxAll: setDeleteIds,
      checkboxChange: setDeleteIds
  }
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />

    <Grid table-title="题目列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['题目']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['biz:question:create'],
              onClick: handleCreate,
            },
            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              auth: ['biz:question:export'],
              onClick: handleExport,
            },
            {
              label: $t('ui.actionTitle.deleteBatch'),
              type: 'primary',
              danger: true,
              icon: ACTION_ICON.DELETE,
              disabled: isEmpty(deleteIds),
              auth: ['biz:question:delete'],
              onClick: handleDeleteBatch,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['biz:question:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['biz:question:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.id]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>

  </Page>
</template>