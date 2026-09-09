import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomButton } from './CustomButton';
import { SpecBadge } from '../wireframe/SpecBadge';
import { MOCK_ACTIVITIES } from '../../data/mockData';
import { ActivityId } from '../../types';
import { 
  Building2, 
  Briefcase, 
  Layers, 
  Users, 
  CheckSquare, 
  HelpCircle, 
  MessageSquare,
  Sparkles,
  X
} from 'lucide-react';

export const ProgressiveProfileModal: React.FC = () => {
  const { 
    currentUser, 
    progressiveProfileOpen, 
    closeProgressiveProfile,
    handleSkipProgressiveProfile,
    handleCompleteProgressiveProfile,
    showSpecAnnotations
  } = useApp();

  const [jobTitle, setJobTitle] = useState(currentUser?.jobTitle || '');
  const [companyName, setCompanyName] = useState(currentUser?.companyName || '');
  const [industry, setIndustry] = useState(currentUser?.industry || '');
  const [companySize, setCompanySize] = useState(currentUser?.companySize || '');
  const [interestedActivities, setInterestedActivities] = useState<ActivityId[]>(
    currentUser?.interestedActivities || ['ceo-summit', 'ceo-forum']
  );
  const [leadSource, setLeadSource] = useState(currentUser?.leadSource || '');
  const [businessPainPoints, setBusinessPainPoints] = useState(currentUser?.businessPainPoints || '');
  const [questionForMentor, setQuestionForMentor] = useState(currentUser?.questionForMentor || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!progressiveProfileOpen) return null;

  const toggleActivity = (id: ActivityId) => {
    setInterestedActivities(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [key: string]: string } = {};
    if (!jobTitle.trim()) errs.jobTitle = 'Vui lòng nhập chức danh điều hành';
    if (!companyName.trim()) errs.companyName = 'Vui lòng nhập tên doanh nghiệp / tổ chức';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      handleCompleteProgressiveProfile({
        jobTitle,
        companyName,
        industry,
        companySize,
        interestedActivities,
        leadSource,
        businessPainPoints,
        questionForMentor
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn font-sans">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-xl w-full overflow-hidden my-8 transform transition-all">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-start justify-between bg-neutral-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#eb1000]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#eb1000]">
                Tiếp tục thao tác
              </span>
            </div>
            <h3 className="text-xl font-black text-black mt-1">
              Hoàn thiện hồ sơ để tiếp tục
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Bổ sung thông tin doanh nghiệp để Ban thư ký hỗ trợ kết nối đúng lãnh đạo cùng ngành
            </p>
          </div>
          <button
            onClick={handleSkipProgressiveProfile}
            className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
            title="Đóng để sau"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showSpecAnnotations && (
          <div className="px-6 py-2 bg-amber-50 border-b border-amber-100 text-[11px] font-mono text-amber-800 flex items-center justify-between">
            <SpecBadge label="04-progressive-profile: Popup hoàn thiện hồ sơ" type="prd" />
            <span>Nút "Để sau" không chặn luồng</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleComplete} className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Row 1: Chức danh & Doanh nghiệp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                Chức danh điều hành <span className="text-[#eb1000]">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="VD: Chủ tịch HĐQT, Tổng Giám đốc..."
                className={`w-full px-3.5 py-2.5 text-xs bg-neutral-50 border rounded-lg focus:bg-white focus:outline-none focus:border-[#eb1000] ${
                  errors.jobTitle ? 'border-red-500 bg-red-50/30' : 'border-neutral-200'
                }`}
              />
              {errors.jobTitle && <p className="text-[10px] text-red-600 mt-1">{errors.jobTitle}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                Doanh nghiệp / Tổ chức <span className="text-[#eb1000]">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="VD: Tập đoàn Công nghệ VinaTech..."
                className={`w-full px-3.5 py-2.5 text-xs bg-neutral-50 border rounded-lg focus:bg-white focus:outline-none focus:border-[#eb1000] ${
                  errors.companyName ? 'border-red-500 bg-red-50/30' : 'border-neutral-200'
                }`}
              />
              {errors.companyName && <p className="text-[10px] text-red-600 mt-1">{errors.companyName}</p>}
            </div>
          </div>

          {/* Row 2: Lĩnh vực & Quy mô (Free Text) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-neutral-400" />
                Lĩnh vực hoạt động chính
              </label>
              <input
                type="text"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                placeholder="VD: Sản xuất công nghiệp, CNTT, Bán lẻ..."
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#eb1000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-neutral-400" />
                Quy mô doanh nghiệp (Free text)
              </label>
              <input
                type="text"
                value={companySize}
                onChange={e => setCompanySize(e.target.value)}
                placeholder="VD: 150 nhân sự, Doanh thu ~120 tỷ/năm"
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#eb1000]"
              />
            </div>
          </div>

          {/* Row 3: Hoạt động quan tâm (multi-select) */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-neutral-400" />
              Hoạt động VCF quan tâm (Chọn nhiều)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOCK_ACTIVITIES.map(act => {
                const checked = interestedActivities.includes(act.id);
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => toggleActivity(act.id)}
                    className={`text-left p-2 rounded-lg border text-[11px] font-medium transition-all ${
                      checked 
                        ? 'border-[#eb1000] bg-red-50/50 text-black font-semibold' 
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <span className="line-clamp-1">{act.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Nguồn biết đến */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
              Nguồn biết đến VCF (Tùy chọn)
            </label>
            <input
              type="text"
              value={leadSource}
              onChange={e => setLeadSource(e.target.value)}
              placeholder="VD: Được giới thiệu bởi Hội viên, Báo chí, Sự kiện..."
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#eb1000]"
            />
          </div>

          {/* Row 5: Mô tả vấn đề & Câu hỏi mentor */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
              Thách thức / Vấn đề quản trị quan tâm nhất
            </label>
            <textarea
              rows={2}
              value={businessPainPoints}
              onChange={e => setBusinessPainPoints(e.target.value)}
              placeholder="VD: Tái cấu trúc vốn, quản trị chất lượng, tự động hóa chuỗi cung ứng..."
              className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#eb1000]"
            />
          </div>

          {/* Action Buttons: Hoàn tất vs Để sau */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSkipProgressiveProfile}
              className="px-5 py-2.5 text-xs font-bold text-neutral-600 hover:text-black rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              Để sau (Tiếp tục ngay)
            </button>
            <CustomButton
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : 'Hoàn tất & Tiếp tục →'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};
