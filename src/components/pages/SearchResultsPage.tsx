import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { ArticleCard } from '../common/ArticleCard';
import { ActivityCard } from '../common/ActivityCard';
import { EventCard } from '../common/EventCard';
import { ProgramCard } from '../common/ProgramCard';
import { CustomButton } from '../common/CustomButton';
import { SpecBadge } from '../wireframe/SpecBadge';
import { 
  MOCK_ACTIVITIES, 
  MOCK_ARTICLES, 
  MOCK_EVENTS, 
  MOCK_PROGRAMS 
} from '../../data/mockData';
import { Search } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const { searchQuery, showSpecAnnotations } = useApp();

  const [inputQuery, setInputQuery] = useState(searchQuery || '');
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'articles' | 'activities' | 'events' | 'programs'>('all');

  const query = inputQuery.toLowerCase().trim();

  // Perform search across all entities
  const matchingActivities = MOCK_ACTIVITIES.filter(a => 
    !query || a.title.toLowerCase().includes(query) || a.shortDesc.toLowerCase().includes(query)
  );

  const matchingArticles = MOCK_ARTICLES.filter(a => 
    !query || a.title.toLowerCase().includes(query) || a.sapo.toLowerCase().includes(query) || a.author.name.toLowerCase().includes(query) || a.tags.some(t => t.toLowerCase().includes(query))
  );

  const matchingEvents = MOCK_EVENTS.filter(e => 
    !query || e.title.toLowerCase().includes(query) || e.activityName.toLowerCase().includes(query) || e.location.toLowerCase().includes(query)
  );

  const matchingPrograms = MOCK_PROGRAMS.filter(p => 
    !query || p.title.toLowerCase().includes(query) || p.shortDesc.toLowerCase().includes(query)
  );

  const totalResults = matchingActivities.length + matchingArticles.length + matchingEvents.length + matchingPrograms.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8 font-sans">
      <Breadcrumb items={[{ label: 'Kết quả tìm kiếm' }]} />

      {showSpecAnnotations && (
        <div className="bg-neutral-100 border border-neutral-200 p-2.5 rounded-lg text-xs font-mono flex items-center justify-between">
          <SpecBadge label="C13: Kết quả tìm kiếm toàn văn [Trang phụ]" type="page" />
          <span className="text-neutral-500">PRD 5.3 Full-Text Engine Prototype</span>
        </div>
      )}

      {/* Search Header Form */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-3xl font-black text-black tracking-tight">
          Tìm Kiếm Toàn Văn Hệ Thống VCF
        </h1>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Nhập từ khóa tìm kiếm (VD: Hội nghị, Chuyển đổi số, Kế nghiệp, BT Nguyễn Mạnh Hùng...)"
              className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-neutral-300 rounded-full focus:outline-none focus:border-[#eb1000] font-sans shadow-xs transition-all duration-150"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          </div>
          <CustomButton type="submit" variant="primary" size="md" className="shadow-xs">
            Tìm kiếm
          </CustomButton>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex border border-neutral-200 p-1 bg-neutral-100 rounded-full gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTypeFilter('all')}
          className={`px-5 py-2 font-bold rounded-full whitespace-nowrap transition-all duration-150 ${
            activeTypeFilter === 'all' ? 'bg-[#eb1000] text-white shadow-xs' : 'text-neutral-600 hover:text-black'
          }`}
        >
          Tất cả ({totalResults})
        </button>
        <button
          onClick={() => setActiveTypeFilter('articles')}
          className={`px-5 py-2 font-bold rounded-full whitespace-nowrap transition-all duration-150 ${
            activeTypeFilter === 'articles' ? 'bg-[#eb1000] text-white shadow-xs' : 'text-neutral-600 hover:text-black'
          }`}
        >
          Hệ tri thức LGM ({matchingArticles.length})
        </button>
        <button
          onClick={() => setActiveTypeFilter('activities')}
          className={`px-5 py-2 font-bold rounded-full whitespace-nowrap transition-all duration-150 ${
            activeTypeFilter === 'activities' ? 'bg-[#eb1000] text-white shadow-xs' : 'text-neutral-600 hover:text-black'
          }`}
        >
          9 Hoạt động VCF ({matchingActivities.length})
        </button>
        <button
          onClick={() => setActiveTypeFilter('events')}
          className={`px-5 py-2 font-bold rounded-full whitespace-nowrap transition-all duration-150 ${
            activeTypeFilter === 'events' ? 'bg-[#eb1000] text-white shadow-xs' : 'text-neutral-600 hover:text-black'
          }`}
        >
          Sự kiện ({matchingEvents.length})
        </button>
        <button
          onClick={() => setActiveTypeFilter('programs')}
          className={`px-5 py-2 font-bold rounded-full whitespace-nowrap transition-all duration-150 ${
            activeTypeFilter === 'programs' ? 'bg-[#eb1000] text-white shadow-xs' : 'text-neutral-600 hover:text-black'
          }`}
        >
          Đào tạo CEO ({matchingPrograms.length})
        </button>
      </div>

      {/* Results or Empty State */}
      {totalResults === 0 ? (
        <div className="border border-neutral-200 bg-white rounded-lg p-12 text-center space-y-4 max-w-2xl mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-neutral-100 text-neutral-500 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-base text-black">
              Không tìm thấy kết quả phù hợp cho "{inputQuery}"
            </h3>
            <p className="text-xs text-neutral-500 font-sans">
              Vui lòng kiểm tra lại chính tả hoặc thử các từ khóa phổ biến dưới đây:
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {['Lãnh đạo', 'Chuyển đổi số', 'CEO Summit', 'Quản trị', 'Mentor', 'Nguyễn Mạnh Hùng'].map((kw) => (
              <button
                key={kw}
                onClick={() => setInputQuery(kw)}
                className="px-3.5 py-1 bg-neutral-50 border border-neutral-200 rounded-full text-xs text-neutral-700 hover:bg-[#eb1000] hover:text-white hover:border-[#eb1000] transition-all duration-150 font-medium"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Articles Group */}
          {(activeTypeFilter === 'all' || activeTypeFilter === 'articles') && matchingArticles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <h3 className="font-black text-lg text-black uppercase">
                  Bài Viết Tri Thức LGM ({matchingArticles.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingArticles.map(art => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>
            </div>
          )}

          {/* Activities Group */}
          {(activeTypeFilter === 'all' || activeTypeFilter === 'activities') && matchingActivities.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <h3 className="font-black text-lg text-black uppercase">
                  9 Hoạt Động VCF ({matchingActivities.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingActivities.map(act => (
                  <ActivityCard key={act.id} activity={act} />
                ))}
              </div>
            </div>
          )}

          {/* Events Group */}
          {(activeTypeFilter === 'all' || activeTypeFilter === 'events') && matchingEvents.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <h3 className="font-black text-lg text-black uppercase">
                  Sự Kiện & Lịch Trình ({matchingEvents.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchingEvents.map(evt => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            </div>
          )}

          {/* Programs Group */}
          {(activeTypeFilter === 'all' || activeTypeFilter === 'programs') && matchingPrograms.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <h3 className="font-black text-lg text-black uppercase">
                  Chương Trình Đào Tạo CEO ({matchingPrograms.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchingPrograms.map(prog => (
                  <ProgramCard key={prog.id} program={prog} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
