import React from 'react';
import { UserProfile } from '../../types';
import {
  MobileEventRegistrationModal,
  MobileEventRegistrationModalProps
} from './MobileEventRegistrationModal';

export const JOB_TITLE_OPTIONS = [
  'Tổng Giám Đốc (CEO)',
  'Chủ tịch HĐQT / Hội đồng thành viên',
  'Phó Tổng Giám Đốc (Deputy CEO / Phó Chủ tịch)',
  'Giám đốc Điều hành (COO)',
  'Giám đốc Tài chính (CFO)',
  'Giám đốc Công nghệ / Chuyển đổi số (CTO / CDO)',
  'Giám đốc Marketing / Kinh doanh (CMO / CCO)',
  'Thành viên HĐQT / Ban Cố vấn chiến lược',
  'Chủ doanh nghiệp / Sáng lập viên (Founder / Co-founder)',
  'Giám đốc Khối / Giám đốc chi nhánh',
  'Khác (Lãnh đạo cấp cao)'
];

export interface StepByStepMemberModalProps extends MobileEventRegistrationModalProps {}

/**
 * Unified StepByStepMemberModal for Event Registration:
 * Unifies the style and UX across both Desktop and Mobile, utilizing
 * the modern clean design system, circular stepper, Fast Track for members,
 * empty password fields with show/hide toggles, and unified responsive dialog.
 */
export const StepByStepMemberModal: React.FC<StepByStepMemberModalProps> = (props) => {
  return <MobileEventRegistrationModal {...props} />;
};

export default StepByStepMemberModal;
