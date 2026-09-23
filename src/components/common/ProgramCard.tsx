import React from 'react';
import { TrainingProgram } from '../../types';
import { WireframeImage } from '../wireframe/WireframeImage';
import { Calendar, Clock, ExternalLink } from 'lucide-react';

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
    <div className="vcf-card flex flex-col justify-between group overflow-hidden">
      <div>
        <div className="overflow-hidden">
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
              className="rounded-none border-0 group-hover:scale-[1.02] transition-transform duration-300"
            />
          </a>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs gap-2">
            <span className="bg-red-50 border border-red-200 text-brand-primary px-3 py-1 font-semibold rounded-full whitespace-nowrap shrink-0">
              {program.code}
            </span>
            <span className="text-ink-secondary font-medium truncate text-right">{program.format}</span>
          </div>

          <h3 className="text-xl font-semibold text-ink leading-tight group-hover:text-brand-primary transition-colors">
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

          <div className="text-sm text-ink-secondary bg-parchment p-3.5 sm:p-4 rounded-md font-normal">
            <span className="font-semibold text-ink">Đối tượng: </span>
            {program.targetAudience}
          </div>

          <p className="text-sm text-ink-secondary line-clamp-2 leading-relaxed">
            {program.shortDesc}
          </p>

          <div className="space-y-2 text-xs sm:text-sm text-ink-secondary pt-1 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-primary shrink-0" />
              <span className="text-neutral-700">{program.nextCohort}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-primary shrink-0" />
              <span className="font-semibold text-ink">Thời lượng: {program.duration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 pt-0 flex flex-col gap-2">
        <a
          id={`program-btn-${program.id}`}
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full min-h-11 inline-flex items-center justify-center rounded-full font-medium px-5 py-2.5 text-sm gap-1.5 bg-brand-primary text-white hover:bg-brand-primary-hover active:scale-95 transition-all duration-150 select-none whitespace-nowrap cursor-pointer group/btn focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info"
          title={`Mở trang chi tiết & đăng ký tư vấn (${externalUrl}) trong tab mới`}
        >
          <span>Xem chi tiết & Đăng ký tư vấn</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-90 group-hover/btn:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};
