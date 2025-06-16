import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace QuestionApi {
  /** 标签信息 */
  export interface Tag {
    id: number;
    name: string;
    createTime: number;
    updateTime: number;
    creator: string;
    updater: string;
    deleted: boolean;
  }

  /** 题目信息 */
  export interface Question {
    id?: number; // 主键
    title?: string; // 标题
    content?: string; // 内容
    answer?: string; // 答案
    judgeCase: string; // 判题用例(json数组)
    judgeConfig: string; // 判题配置(json对象)
    tagIds?: number[]; // 标签ID列表
    tags?: Tag[]; // 标签列表
    createTime?: number; // 创建时间
    submitNum?: number; // 提交数
    acceptNum?: number; // 通过数
    thumbNum?: number; // 点赞数
    favourNum?: number; // 收藏数
    difficulty?: string; // 难度
  }
}

/** 查询题目分页 */
export function getQuestionPage(params: PageParam) {
  return requestClient.get<PageResult<QuestionApi.Question>>(
    '/biz/question/page',
    { params },
  );
}

/** 查询题目详情 */
export function getQuestion(id: number) {
  return requestClient.get<QuestionApi.Question>(`/biz/question/get?id=${id}`);
}

/** 新增题目 */
export function createQuestion(data: QuestionApi.Question) {
  return requestClient.post('/biz/question/create', data);
}

/** 修改题目 */
export function updateQuestion(data: QuestionApi.Question) {
  return requestClient.put('/biz/question/update', data);
}

/** 删除题目 */
export function deleteQuestion(id: number) {
  return requestClient.delete(`/biz/question/delete?id=${id}`);
}

/** 批量删除题目 */
export function deleteQuestionListByIds(ids: number[]) {
  return requestClient.delete(`/biz/question/delete-list?ids=${ids.join(',')}`);
}

/** 导出题目 */
export function exportQuestion(params: any) {
  return requestClient.download('/biz/question/export-excel', params);
}
