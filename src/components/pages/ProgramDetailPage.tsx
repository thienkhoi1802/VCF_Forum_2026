import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { CustomButton } from '../common/CustomButton';
import { WireframeImage } from '../wireframe/WireframeImage';
import { SpecBadge } from '../wireframe/SpecBadge';
import { MOCK_PROGRAMS } from '../../data/mockData';
import { 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export const ProgramDetailPage: React.FC = () => {
  const { selectedProgramId, showSpecAnnotations, isLoggedIn, currentUser, showNotification } = useApp();

  const program = MOCK_PROGRAMS.find(p => p.id === selectedProgramId) || MOCK_PROGRAMS[0];

  // Consultation Lead Form State (PRD VI Lead Form)
  const [leadForm, setLeadForm] = useState({
    fullName: isLoggedIn && currentUser ? currentUser.fullName : '',
    phone: isLoggedIn && currentUser ? currentUser.phone : '',
    email: isLoggedIn && currentUser ? currentUser.email : '',
    company: isLoggedIn && currentUser ? currentUser.companyName : '',
    interestedCohort: program.upcomingSchedules[0]?.cohort || '',
    note: ''
  });

  const [leadStatus, setLeadStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [key: string]: string } = {};
    if (!leadForm.fullName.trim()) errs.fullName = 'Vui lòng nhập Họ tên';
    if (!leadForm.phone.trim()) errs.phone = 'Vui lòng nhập Số điện thoại';
    if (!leadForm.email.trim()) errs.email = 'Vui lòng nhập Email';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setLeadStatus('submitting');
    setTimeout(() => {
      setLeadStatus('success');
      showNotification('Đăng ký tư vấn chương trình thành công!');
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8 font-sans">
      <Breadcrumb
        items={[
          { label: 'Đào tạo CEO', route: 'programs' },
          { label: program.title }
        ]}
      />

      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-neutral-200 p-2.5 rounded-lg text-xs font-mono flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <SpecBadge label="C9.1: Chi tiết chương trình đào tạo [Trang phụ]" type="page" />
            <SpecBadge label="PRD VI / Form Lead Tư Vấn Đào Tạo (Hệ CRM nội bộ)" type="source" />
          </div>
          <span className="text-neutral-500">
            States: [S-DEFAULT], [S-SUBMITTING], [S-SUCCESS]
          </span>
        </div>
      )}

      {/* Program Hero Header */}
      <div className="space-y-4 pb-6 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <span className="bg-[#eb1000] text-white font-mono text-xs px-2.5 py-0.5 font-bold rounded-full">
            MÃ: {program.code}
          </span>
          <span className="text-xs text-neutral-500 font-medium">
            Thời lượng: {program.duration} • Hình thức: {program.format}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight leading-snug">
          {program.title}
        </h1>

        <p className="text-base text-neutral-600 leading-relaxed font-sans max-w-3xl">
          {program.shortDesc}
        </p>
      </div>

      {/* Main 2-column Layout: Content Left (8 cols) + Sticky Lead Form Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Modules, Objectives, Faculty, Schedule */}
        <div className="lg:col-span-8 space-y-10">
          {/* Visual Cover */}
          <WireframeImage
            label={program.imagePlaceholder}
            aspectRatio="16:9"
            className="w-full border border-neutral-200 rounded-lg overflow-hidden shadow-xs"
          />

          {/* Block 1: Target Audience & Objectives */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-black uppercase tracking-wide">
              1. Đối Tượng & Mục Tiêu Đào Tạo
            </h3>

            <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs">
              <strong className="text-black block mb-1.5 uppercase font-bold">Đối tượng tuyển sinh:</strong>
              <p className="text-neutral-600 leading-relaxed font-sans text-xs">{program.targetAudience}</p>
            </div>

            <div className="space-y-2 pt-2">
              <strong className="text-xs uppercase text-black block font-bold">Sau khóa học, học viên sẽ làm chủ:</strong>
              <ul className="space-y-2.5 text-xs text-neutral-700">
                {program.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#eb1000] shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Block 2: Modules Structure */}
          <div className="border-t border-neutral-200 pt-8 space-y-4">
            <h3 className="text-xl font-black text-black uppercase tracking-wide">
              2. Cấu Trúc Khung Chương Trình Đào Tạo
            </h3>

            <div className="space-y-4">
              {program.modules.map((mod, idx) => (
                <div key={idx} className="border border-neutral-200 p-5 bg-white rounded-lg shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-black">{mod.title}</h4>
                    <span className="text-[11px] font-bold text-[#eb1000] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                      {mod.duration}
                    </span>
                  </div>
                  <ul className="pl-4 list-disc text-xs text-neutral-600 space-y-1">
                    {mod.topics.map((top, tIdx) => (
                      <li key={tIdx}>{top}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Block 3: Faculty */}
          <div className="border-t border-neutral-200 pt-8 space-y-4">
            <h3 className="text-xl font-black text-black uppercase tracking-wide">
              3. Đội Ngũ Giảng Viên & Chuyên Gia Cố Vấn
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {program.faculty.map((fac, idx) => (
                <div key={idx} className="border border-neutral-200 p-4 bg-white rounded-lg shadow-xs flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center font-bold text-xs text-[#eb1000] shrink-0">
                    GV
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-black">{fac.name}</div>
                    <div className="text-xs text-neutral-500 font-medium">{fac.role}</div>
                    <div className="text-[11px] text-neutral-400 line-clamp-1">{fac.bio}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Block 4: Tuition & Scholarship */}
          <div className="border-t border-neutral-200 pt-8 space-y-4">
            <h3 className="text-xl font-black text-black uppercase tracking-wide">
              4. Học Phí & Chính Sách Học Bổng
            </h3>

            <div className="p-5 border border-neutral-200 bg-neutral-50 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-700 text-sm">Học phí niêm yết:</span>
                <span className="font-black text-base text-[#eb1000]">{program.tuitionFee}</span>
              </div>
              {program.scholarshipInfo && (
                <div className="pt-2 border-t border-neutral-200 text-neutral-600">
                  <strong className="text-black">Ưu đãi: </strong> {program.scholarshipInfo}
                </div>
              )}
            </div>
          </div>

          {/* Block 5: Upcoming Cohorts Schedule */}
          <div className="border-t border-neutral-200 pt-8 space-y-4">
            <h3 className="text-xl font-black text-black uppercase tracking-wide">
              5. Lịch Khai Giảng Các Khóa Sắp Tới
            </h3>

            <div className="space-y-3">
              {program.upcomingSchedules.map((sch, idx) => (
                <div key={idx} className="border border-neutral-200 p-4 bg-white rounded-lg shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-sm text-black block">{sch.cohort}</strong>
                    <div className="text-neutral-500">Khai giảng: {sch.startDate} • {sch.location}</div>
                  </div>
                  <span className="bg-red-50 text-[#eb1000] border border-red-200 px-3 py-1 font-bold rounded-full">
                    {sch.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Lead Registration Form */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          {/* Tuition Fee & Scholarship Box (CMS Toggle simulation) */}
          <div className="border border-neutral-200 bg-white p-5 rounded-lg space-y-3 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Học phí chương trình:
            </div>
            <div>
              <div className="text-xl font-black text-black">
                {program.tuitionFee || 'Liên hệ để nhận báo giá'}
              </div>
              {program.scholarshipInfo && (
                <div className="mt-2 text-xs bg-red-50 border border-red-200 text-[#eb1000] p-2.5 rounded-md font-medium">
                  {program.scholarshipInfo}
                </div>
              )}
            </div>
          </div>

          <div className="border border-neutral-200 bg-white p-6 md:p-7 rounded-lg space-y-5 shadow-sm">
            <div className="pb-3 border-b border-neutral-100">
              <span className="text-[10px] font-bold uppercase bg-red-50 text-[#eb1000] border border-red-200 px-2.5 py-0.5 rounded-full">
                FORM LEAD TƯ VẤN
              </span>
              <h3 className="text-lg font-black text-black mt-2">
                Đăng Ký Nhận Tư Vấn & Giữ Chỗ
              </h3>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                Điền thông tin để Hội đồng Tuyển sinh VLGM & PTIT liên hệ gửi tài liệu chi tiết và lịch phỏng vấn.
              </p>
            </div>

            {leadStatus === 'success' ? (
              <div className="p-6 bg-red-50/30 border border-red-200 rounded-lg text-center space-y-3">
                <div className="w-10 h-10 bg-[#eb1000] text-white rounded-full mx-auto flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="font-bold text-sm text-black">
                  Đăng Ký Tư Vấn Thành Công!
                </div>
                <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                  Đội ngũ tuyển sinh Học viện PTIT & VLGM sẽ liên hệ với Ông/Bà <strong>{leadForm.fullName}</strong> trong vòng 3 - 5 ngày làm việc.
                </p>
                <CustomButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setLeadStatus('idle')}
                >
                  Gửi yêu cầu khác
                </CustomButton>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Họ và tên học viên *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn An"
                    value={leadForm.fullName}
                    onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#eb1000] font-sans"
                  />
                  {formErrors.fullName && <span className="text-[11px] text-[#eb1000]">{formErrors.fullName}</span>}
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="09xx xxx xxx"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#eb1000] font-sans"
                  />
                  {formErrors.phone && <span className="text-[11px] text-[#eb1000]">{formErrors.phone}</span>}
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Email nhận brochure *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@company.vn"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#eb1000] font-sans"
                  />
                  {formErrors.email && <span className="text-[11px] text-[#eb1000]">{formErrors.email}</span>}
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Tên Doanh nghiệp & Chức danh</label>
                  <input
                    type="text"
                    placeholder="VD: CEO - Tập đoàn X"
                    value={leadForm.company}
                    onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#eb1000] font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Khóa dự kiến tham gia</label>
                  <select
                    value={leadForm.interestedCohort}
                    onChange={(e) => setLeadForm({ ...leadForm, interestedCohort: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg bg-white font-sans focus:outline-none focus:border-[#eb1000]"
                  >
                    {program.upcomingSchedules.map((sch, i) => (
                      <option key={i} value={sch.cohort}>{sch.cohort} ({sch.startDate})</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <CustomButton
                    type="submit"
                    variant="primary"
                    size="md"
                    fullWidth
                    disabled={leadStatus === 'submitting'}
                    className="shadow-xs"
                  >
                    {leadStatus === 'submitting' ? 'Đang gửi thông tin...' : 'GỬI ĐĂNG KÝ TƯ VẤN & GIỮ CHỖ'}
                  </CustomButton>
                </div>

                <div className="text-[11px] text-neutral-400 font-medium text-center">
                  * Dữ liệu đồng bộ về Hệ CRM liên hệ chung với Form Thành viên.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
