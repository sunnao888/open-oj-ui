/**
 * 针对 https://github.com/xaboy/form-create-designer 封装的工具类
 */
// TODO @芋艿：后续这些 form-create 的优化；另外需要使用 form-create-helper 会好点
import { isRef } from 'vue';

// 编码表单 Conf
export const encodeConf = (designerRef: object) => {
  // @ts-ignore designerRef.value is dynamically added by form-create-designer
  return JSON.stringify(designerRef.value.getOption());
};

// 编码表单 Fields
export const encodeFields = (designerRef: object) => {
  // @ts-ignore designerRef.value is dynamically added by form-create-designer
  const rule = JSON.parse(designerRef.value.getJson());
  const fields: string[] = [];
  rule.forEach((item: unknown) => {
    fields.push(JSON.stringify(item));
  });
  return fields;
};

// 解码表单 Fields
export const decodeFields = (fields: string[]) => {
  const rule: object[] = [];
  fields.forEach((item) => {
    rule.push(JSON.parse(item));
  });
  return rule;
};

// 设置表单的 Conf 和 Fields，适用 FcDesigner 场景
export const setConfAndFields = (
  designerRef: object,
  conf: string,
  fields: string,
) => {
  // @ts-ignore designerRef.value is dynamically added by form-create-designer
  designerRef.value.setOption(JSON.parse(conf));
  // @ts-ignore designerRef.value is dynamically added by form-create-designer
  designerRef.value.setRule(decodeFields(fields));
};

// 设置表单的 Conf 和 Fields，适用 form-create 场景
export const setConfAndFields2 = (
  detailPreview: object,
  conf: string,
  fields: string[],
  value?: object,
) => {
  if (isRef(detailPreview)) {
    // @ts-ignore detailPreview.value is dynamically added by form-create-designer
    detailPreview = detailPreview.value;
  }
  // @ts-ignore detailPreview properties are dynamically added by form-create-designer
  detailPreview.option = JSON.parse(conf);
  // @ts-ignore detailPreview properties are dynamically added by form-create-designer
  detailPreview.rule = decodeFields(fields);
  if (value) {
    // @ts-ignore detailPreview properties are dynamically added by form-create-designer
    detailPreview.value = value;
  }
};
