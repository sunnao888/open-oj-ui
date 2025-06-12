import type {PageParam, PageResult} from '@vben/request';

import {requestClient} from '#/api/request';

export namespace QuestionSubmitApi {
  /** 题目提交记录信息 */
  export interface QuestionSubmit {
    id: number; // 编号
    questionId?: number; // 题目id
  }
}

/** 查询题目提交记录分页 */
export function getQuestionSubmitPage(params: PageParam) {
  return requestClient.get<PageResult<QuestionSubmitApi.QuestionSubmit>>('/biz/submit/page', { params });
}

/** 查询题目提交记录详情 */
export function getQuestionSubmit(id: number) {
  return requestClient.get<QuestionSubmitApi.QuestionSubmit>(`/biz/submit/get?id=${id}`);
}

/** 新增题目提交记录 */
export function createQuestionSubmit(data: QuestionSubmitApi.QuestionSubmit) {
  return requestClient.post('/biz/submit/create', data);
}

/** 修改题目提交记录 */
export function updateQuestionSubmit(data: QuestionSubmitApi.QuestionSubmit) {
  return requestClient.put('/biz/submit/update', data);
}

/** 删除题目提交记录 */
export function deleteQuestionSubmit(id: number) {
  return requestClient.delete(`/biz/submit/delete?id=${id}`);
}

/** 批量删除题目提交记录 */
export function deleteQuestionSubmitListByIds(ids: number[]) {
  return requestClient.delete(`/biz/submit/delete-list?ids=${ids.join(',')}`)
}

/** 导出题目提交记录 */
export function exportQuestionSubmit(params: any) {
  return requestClient.download('/biz/submit/export-excel', params);
}