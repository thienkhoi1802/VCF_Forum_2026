import React from 'react';
import { TrainingProgram } from '../../types';
import { WireframeImage } from '../wireframe/WireframeImage';
import { GraduationCap, Calendar, ExternalLink } from 'lucide-react';

interface ProgramCardProps {
  program: TrainingProgram;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  // Demo external URLs for each program (bắt new tab ra ngoài)
  const externalUrl = program.externalUrl || (
    program.id === 'program-ceo-lgm-mastery'
      ? 'https://daotao.ptit.edu.vn/khoa-hoc/ceo-lgm-mastery-demo'
      : 'https://daotao.ptit.edu.vn/khoa-hoc/strategic-cfo-demo'
  );

  return (
    <div className="border border-neutral-200 bg-white flex flex-col justify-between hover:border-[#eb1000] hover:shadow-xs transition-all duration-150 rounded-lg group overflow-hidden">
      <div>
        <div className="p-3 pb-0">
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-pointer"
            title={`Xem chi tiết khóa ${program.title} (Mở tab mới)`}
          >
            <WireframeImage
              label={program.imagePlaceholder}
              imageUrl={program.imageUrl}
              alt={program.title}
              aspectRatio="16:9"
              className="rounded-md border border-neutral-200 group-hover:opacity-95 transition-opacity"
            />
          </a>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="bg-red-50 border border-red-200 text-[#eb1000] px-3 py-1 font-bold rounded-full">
              {program.code}
            </span>
            <span className="text-neutral-500 font-semibold">{program.duration}</span>
          </div>

          <h3 className="text-base font-black text-black leading-snug group-hover:text-[#eb1000] transition-colors">
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline block"
              title={`Xem chi tiết khóa ${program.title} (Mở tab mới)`}
            >
              {program.title}
            </a>
          </h3>

          <div className="text-xs text-neutral-700 bg-neutral-50 p-3 rounded-md border border-neutral-100 font-medium">
            <span className="font-bold text-black">Đối tượng: </span>
            {program.targetAudience}
          </div>

          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {program.shortDesc}
          </p>

          <div className="space-y-1.5 text-xs text-neutral-600 pt-1 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#eb1000] shrink-0" />
              <span>{program.nextCohort}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-[#eb1000] shrink-0" />
              <span className="font-bold text-black">{program.tuitionFee}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 flex flex-col gap-2">
        <a
          id={`program-btn-${program.id}`}
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center rounded-full font-semibold px-4 py-2.5 text-xs gap-1.5 bg-[#eb1000] text-white hover:bg-[#c90d00] active:bg-[#a80b00] transition-all duration-150 select-none focus:outline-none whitespace-nowrap cursor-pointer shadow-xs group/btn"
          title={`Mở trang chi tiết & đăng ký tư vấn (${externalUrl}) trong tab mới`}
        >
          <span>Xem chi tiết & Đăng ký tư vấn</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-90 group-hover/btn:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};
