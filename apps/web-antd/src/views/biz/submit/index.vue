<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { QuestionSubmitApi } from '#/api/biz/submit';

import { Page } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { ref } from 'vue';
import { $t } from '#/locales';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getQuestionSubmitPage, deleteQuestionSubmit, deleteQuestionSubmitListByIds, exportQuestionSubmit } from '#/api/biz/submit';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { useGridColumns, useGridFormSchema } from './data';

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 删除题目提交记录 */
async function handleDelete(row: QuestionSubmitApi.QuestionSubmit) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    key: 'action_key_msg'
  });
  try {
    await deleteQuestionSubmit(row.id as number);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.id]),
      key: 'action_key_msg',
    });
    onRefresh();
  } finally {
    hideLoading();
  }
}

/** 批量删除题目提交记录 */
async function handleDeleteBatch() {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting'),
    key: 'action_key_msg'
  });
  try {
    await deleteQuestionSubmitListByIds(deleteIds.value);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess'),
      key: 'action_key_msg',
    });
    onRefresh();
  } finally {
    hideLoading();
  }
}

const deleteIds = ref<number[]>([]) // 待删除题目提交记录 ID
function setDeleteIds({
  records
}: {
  records: QuestionSubmitApi.QuestionSubmit[];
}) {
  deleteIds.value = records.map((item) => item.id);
}

/** 导出表格 */
async function handleExport() {
  const data = await exportQuestionSubmit(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '题目提交记录.xls', source: data });
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
          return await getQuestionSubmitPage({
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
  } as VxeTableGridOptions<QuestionSubmitApi.QuestionSubmit>,
  gridEvents:{
      checkboxAll: setDeleteIds,
      checkboxChange: setDeleteIds
  }
});
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="判题记录列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              auth: ['biz:submit:export'],
              onClick: handleExport,
            },
            {
              label: $t('ui.actionTitle.deleteBatch'),
              type: 'primary',
              danger: true,
              icon: ACTION_ICON.DELETE,
              disabled: isEmpty(deleteIds),
              auth: ['biz:submit:delete'],
              onClick: handleDeleteBatch,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['biz:submit:delete'],
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