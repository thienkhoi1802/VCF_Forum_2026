import { Activity, ArticleItem, EventItem, Mentor, TrainingProgram, UserProfile, RegistrationHistoryItem } from '../types';

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'ceo-summit',
    title: 'CEO Summit',
    shortDesc: 'Đại hội thường niên quy tụ hơn 1.000 lãnh đạo doanh nghiệp hàng đầu thảo luận chiến lược vĩ mô.',
    fullDesc: 'Hội nghị Thượng đỉnh Lãnh đạo Doanh nghiệp Việt Nam thường niên, thảo luận các vấn đề chiến lược quốc gia, xu hướng công nghệ, chuyển đổi số và phát triển bền vững.',
    objectives: [
      'Định hình tầm nhìn chiến lược doanh nghiệp Việt trong bối cảnh kinh tế toàn cầu',
      'Đối thoại chính sách cấp cao giữa lãnh đạo Chính phủ, chuyên gia và giới CEO',
      'Tạo lập mạng lưới kết nối hợp tác kinh doanh quy mô toàn quốc'
    ],
    frequency: 'Thường niên (1 lần/năm vào Quý IV)',
    hasEvents: true,
    coverImagePlaceholder: '[Ảnh: Toàn cảnh Đại hội CEO Summit thường niên tại Trung tâm Hội nghị Quốc gia]',
    type: 'event-based'
  },
  {
    id: 'ceo-forum',
    title: 'CEO Forum',
    shortDesc: 'Diễn đàn chuyên đề định kỳ theo ngành, tháo gỡ các bài toán quản trị thực tiễn.',
    fullDesc: 'Các buổi diễn đàn bàn tròn chuyên sâu theo từng ngành nghề kinh tế trọng điểm (Fintech, Sản xuất, Bán lẻ, Logistics) nhằm chia sẻ giải pháp thực chiến.',
    objectives: [
      'Giải quyết các bài toán quản trị đặc thù theo từng lĩnh vực chuyên ngành',
      'Cập nhật case study chuyển đổi số và tối ưu chi phí vận hành',
      'Thúc đẩy liên minh hợp tác chuỗi cung ứng giữa các doanh nghiệp thành viên'
    ],
    frequency: 'Hàng quý (4 kỳ/năm)',
    hasEvents: true,
    coverImagePlaceholder: '[Ảnh: Tọa đàm bàn tròn CEO Forum chuyên đề Quản trị Chuỗi cung ứng]',
    type: 'event-based'
  },
  {
    id: 'ceo-mentoring',
    title: 'CEO Mentoring',
    shortDesc: 'Chương trình cố vấn 1:1 và nhóm nhỏ giữa các chuyên gia kỳ cựu và thế hệ lãnh đạo kế cận.',
    fullDesc: 'Kết nối các chuyên gia, cựu lãnh đạo tập đoàn lớn với các CEO trẻ và doanh nghiệp đang trong giai đoạn chuyển giao hoặc bứt phá tăng trưởng.',
    objectives: [
      'Đồng hành tư vấn 1-1 gỡ rối các khúc mắc chiến lược và khủng hoảng nội bộ',
      'Chuyển giao tri thức quản trị thực chiến qua nhiều thế hệ lãnh đạo',
      'Phát triển năng lực lãnh đạo cá nhân và tư duy điều hành tầm nhìn xa'
    ],
    frequency: 'Chương trình 6 tháng / mùa cố vấn',
    hasEvents: true,
    coverImagePlaceholder: '[Ảnh: Phiên cố vấn 1-1 giữa Mentor cao cấp và Mentee]',
    type: 'mentoring'
  },
  {
    id: 'ceo-peer-group',
    title: 'CEO Peer Group',
    shortDesc: 'Mô hình nhóm đồng cấp kín (8-12 CEO) sinh hoạt định kỳ theo nguyên tắc bảo mật tuyệt đối.',
    fullDesc: 'Không gian an toàn để các CEO cùng quy mô doanh nghiệp chia sẻ những trăn trở, áp lực vị trí lãnh đạo mà không thể thảo luận trong nội bộ công ty.',
    objectives: [
      'Không gian chia sẻ trung thực, bảo mật tuyệt đối giữa các đồng cấp',
      'Phản biện chéo các quyết định đầu tư và chiến lược then chốt',
      'Cân bằng áp lực tinh thần và nâng cao bản lĩnh người đứng đầu'
    ],
    frequency: 'Sinh hoạt hàng tháng (1 buổi/tháng)',
    hasEvents: true,
    coverImagePlaceholder: '[Ảnh: Buổi sinh hoạt kín bàn tròn CEO Peer Group]',
    type: 'peer-group'
  },
  {
    id: 'lgm-school',
    title: 'Trường phái LGM',
    shortDesc: 'Hệ thống triết lý và phương pháp luận Lãnh đạo & Quản trị Tinh hoa Việt Nam.',
    fullDesc: 'Nghiên cứu, hệ thống hóa và phát triển trường phái Lãnh đạo & Quản trị LGM (Leadership & Governance Mastery) thích ứng với văn hóa và bối cảnh doanh nghiệp Việt.',
    objectives: [
      'Xây dựng chuẩn mực lý luận quản trị mang bản sắc và trí tuệ Việt Nam',
      'Đúc kết kinh nghiệm từ các thế hệ doanh nhân tiền bối thành học thuyết ứng dụng',
      'Chuyển giao phương pháp luận LGM vào hoạt động đào tạo và tư vấn'
    ],
    frequency: 'Nghiên cứu liên tục & Xuất bản chuyên đề',
    hasEvents: false,
    coverImagePlaceholder: '[Ảnh: Hội đồng Nghiên cứu Trường phái LGM thảo luận chuyên đề]',
    type: 'academic'
  },
  {
    id: 'knowledge-publication',
    title: 'Xây dựng hệ tri thức & Xuất bản',
    shortDesc: 'Biên soạn, xuất bản ấn phẩm, báo cáo phân tích và cẩm nang quản trị thực tiễn.',
    fullDesc: 'Cơ quan biên soạn và phát hành các sách chuyên khảo, báo cáo nghiên cứu thường niên, case study và tài liệu hướng dẫn quản trị dành riêng cho ban điều hành.',
    objectives: [
      'Xuất bản cẩm nang và sách chuyên khảo quản trị hàng năm',
      'Công bố báo cáo nghiên cứu định kỳ về năng lực lãnh đạo doanh nghiệp Việt',
      'Số hóa toàn bộ kho tri thức phục vụ tra cứu của hội viên'
    ],
    frequency: 'Phát hành định kỳ Quý / Năm',
    hasEvents: false,
    coverImagePlaceholder: '[Ảnh: Bộ sách và ấn phẩm chuyên khảo Quản trị LGM]',
    type: 'publication'
  },
  {
    id: 'website-app',
    title: 'Website & Ứng dụng VCF',
    shortDesc: 'Nền tảng số hóa kết nối mạng lưới hội viên, kho tài nguyên tri thức và sự kiện.',
    fullDesc: 'Hệ sinh thái công nghệ thông tin phục vụ tương tác hội viên, đăng ký sự kiện, tra cứu tài liệu học thuật và quản lý hồ sơ năng lực lãnh đạo.',
    objectives: [
      'Cung cấp trải nghiệm số tiện ích cho hội viên trên mọi thiết bị',
      'Quản lý dữ liệu hội viên và lịch sử tương tác an toàn, bảo mật',
      'Tối ưu hóa quy trình đăng ký sự kiện và tiếp cận tri thức'
    ],
    frequency: 'Vận hành 24/7',
    hasEvents: false,
    coverImagePlaceholder: '[Ảnh: Giao diện nền tảng số hóa Diễn đàn CEO Việt Nam]',
    type: 'platform'
  },
  {
    id: 'ceo-talk',
    title: 'CEO Talk',
    shortDesc: 'Chuỗi đối thoại chuyên sâu truyền hình & podcast cùng các nhà lãnh đạo xuất sắc.',
    fullDesc: 'Chương trình đàm thoại đa phương tiện phân tích những quyết định bước ngoặt, bài học xương máu và triết lý sống của các thuyền trưởng doanh nghiệp tiêu biểu.',
    objectives: [
      'Ghi lại và truyền cảm hứng từ những câu chuyện thương trường người thật - việc thật',
      'Phân tích sâu các tình huống quyết định mang tính sống còn của doanh nghiệp',
      'Lan tỏa thông điệp văn hóa kinh doanh nhân văn và phụng sự'
    ],
    frequency: 'Phát sóng 2 số / tháng (Video & Podcast)',
    hasEvents: true,
    coverImagePlaceholder: '[Ảnh: Không gian ghi hình trường quay CEO Talk chuyên sâu]',
    type: 'media'
  },
  {
    id: 'ceo-club',
    title: 'CEO Club',
    shortDesc: 'Mạng lưới câu lạc bộ hội viên gắn kết qua các hoạt động thể thao, văn hóa và kết nối.',
    fullDesc: 'Không gian giao lưu thân mật ngoài công việc (Golf, Chạy bộ, Thưởng trà, Tham quan mô hình doanh nghiệp) giúp thắt chặt tình thân ái giữa các thành viên.',
    objectives: [
      'Gắn kết cộng đồng lãnh đạo thông qua lối sống lành mạnh và sở thích chung',
      'Tham quan thực địa mô hình nhà máy, văn phòng của các hội viên tiêu biểu',
      'Tạo môi trường trao đổi cởi mở, chân thành ngoài không gian phòng họp'
    ],
    frequency: 'Sinh hoạt định kỳ 2 tuần/lần',
    hasEvents: true,
    coverImagePlaceholder: '[Ảnh: Hoạt động giao lưu thực địa của Hội viên CEO Club]',
    type: 'club'
  }
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'event-summit-2026',
    title: 'CEO Summit 2026: Định hình Vị thế Doanh nghiệp Việt trong Kỷ nguyên AI & Chuyển đổi Xanh',
    activityId: 'ceo-summit',
    activityName: 'CEO Summit',
    datetime: '08:00 - 17:30, Thứ Năm, 15/10/2026',
    dateStr: '2026-10-15',
    timeStr: '08:00 - 17:30',
    location: 'Trung tâm Hội nghị Quốc gia, Đại lộ Thăng Long, Hà Nội',
    type: 'Hybrid',
    availableSeats: 42,
    totalSeats: 500,
    isFull: false,
    status: 'upcoming',
    speakers: [
      {
        name: 'Nguyễn Mạnh Hùng',
        role: 'Bộ trưởng Bộ TT&TT, Chủ tịch Danh dự Hội đồng Cố vấn VLGM',
        avatarPlaceholder: '[Ảnh chân dung: Diễn giả Nguyễn Mạnh Hùng]'
      },
      {
        name: 'PGS. TS. Vũ Văn San',
        role: 'Giám đốc Học viện Công nghệ Bưu chính Viễn thông (PTIT)',
        avatarPlaceholder: '[Ảnh chân dung: PGS. TS. Vũ Văn San]'
      },
      {
        name: 'Trần Đình Long',
        role: 'Chủ tịch HĐQT Tập đoàn Hòa Phát',
        avatarPlaceholder: '[Ảnh chân dung: Khách mời Trần Đình Long]'
      }
    ],
    description: 'Hội nghị Thượng đỉnh thường niên quy tụ 500+ CEO tập đoàn hàng đầu Việt Nam và các chuyên gia quốc tế để bàn về chiến lược thích ứng với làn sóng trí tuệ nhân tạo và tiêu chuẩn ESG toàn cầu.',
    subtitle: 'Diễn đàn thượng đỉnh thường niên quy mô lớn nhất năm của Diễn đàn CEO Việt Nam (VCF) với sự tham gia của 500+ Lãnh đạo cấp cao',
    highlights: [
      'Báo cáo chiến lược quốc gia: Định hướng thể chế và cơ hội bứt phá cho doanh nghiệp Việt Nam giai đoạn 2026-2030.',
      'Ứng dụng AI thực chiến: Các tình huống triển khai GenAI và Tự động hóa quy trình tại các tập đoàn quy mô lớn.',
      'Tọa đàm bàn tròn bàn về chuyển đổi năng lượng xanh, tiếp cận nguồn vốn xanh quốc tế và thực thi ESG.',
      'Không gian kết nối đại biểu cấp cao (C-Level Networking Lounge) và tiệc tối vinh danh Lãnh đạo Đổi mới sáng tạo.'
    ],
    targetAudience: [
      'Chủ tịch HĐQT, Thành viên HĐQT các tập đoàn kinh tế và doanh nghiệp tư nhân lớn.',
      'Tổng Giám đốc (CEO), Phó Tổng Giám đốc điều hành các doanh nghiệp hàng đầu.',
      'Giám đốc Công nghệ (CTO), Giám đốc Chuyển đổi số (CDO) và Lãnh đạo Khối Chiến lược.',
      'Hội viên chính thức và Hội viên sáng lập Diễn đàn CEO Việt Nam.'
    ],
    venueDetails: {
      hall: 'Hội trường Grand Ballroom, Tầng 1, Tòa nhà Trung tâm Hội nghị Quốc gia',
      address: 'Đại lộ Thăng Long, Mễ Trì, Nam Từ Liêm, Hà Nội',
      notes: 'Bãi đỗ xe ô tô miễn phí tại Cổng 1 (Đại lộ Thăng Long). Trang phục: Business Formal / Vest lịch sự.'
    },
    ticketPricing: {
      memberPrice: 'Miễn phí (Đã bao gồm trong quyền lợi Thẻ Hội viên VCF)',
      standardPrice: '12.500.000 VNĐ / Đại biểu (Bao gồm tiệc trưa VIP & Tài liệu hội nghị)',
      notes: 'Hội viên VCF được ưu tiên giữ chỗ tại Hàng ghế danh dự và quyền truy cập VIP Networking Lounge.'
    },
    agenda: [
      { time: '08:00 - 08:30', topic: 'Đón tiếp đại biểu & Check-in qua mã QR định danh' },
      { time: '08:30 - 09:15', topic: 'Phát biểu khai mạc & Báo cáo Tổng quan Kinh tế Lãnh đạo 2026-2030' },
      { time: '09:15 - 10:30', topic: 'Phiên 1: Tái cấu trúc tổ chức bằng Trí tuệ Nhân tạo thực chiến', presenter: 'Hội đồng Khoa học PTIT & Chuyên gia AI' },
      { time: '10:45 - 12:00', topic: 'Tọa đàm bàn tròn: Vốn, Năng lượng sạch và Chuỗi cung ứng mới' },
      { time: '13:30 - 15:30', topic: 'Phiên chuyên đề phân nhánh: Sản xuất thông minh & Bán lẻ đa kênh' },
      { time: '15:45 - 17:00', topic: 'Đối thoại mở: Thách thức thế hệ kế nghiệp doanh nghiệp tư nhân' },
      { time: '17:00 - 17:30', topic: 'Tổng kết & Công bố Thông điệp Lãnh đạo VCF 2026' }
    ],
    imagePlaceholder: '[Ảnh sự kiện: Toàn cảnh khán phòng CEO Summit 2026]'
  },
  {
    id: 'event-forum-fintech',
    title: 'CEO Forum Quý III: Tái cấu trúc Dòng tiền & Quản trị Rủi ro Tín dụng 2026',
    activityId: 'ceo-forum',
    activityName: 'CEO Forum',
    datetime: '13:30 - 17:00, Thứ Sáu, 18/09/2026',
    dateStr: '2026-09-18',
    timeStr: '13:30 - 17:00',
    location: 'Khách sạn Melia Hanoi, 44 Lý Thường Kiệt, Hà Nội',
    type: 'Trực tiếp',
    availableSeats: 0,
    totalSeats: 80,
    isFull: true,
    status: 'upcoming',
    speakers: [
      {
        name: 'TS. Lê Xuân Nghĩa',
        role: 'Thành viên Hội đồng Tư vấn Chính sách Tài chính Tiền tệ Quốc gia',
        avatarPlaceholder: '[Ảnh chân dung: TS. Lê Xuân Nghĩa]'
      },
      {
        name: 'Nguyễn Thị Phương Thảo',
        role: 'Phó Chủ tịch HĐQT HDBank',
        avatarPlaceholder: '[Ảnh chân dung: Bà Nguyễn Thị Phương Thảo]'
      }
    ],
    description: 'Phiên diễn đàn bàn tròn chuyên sâu 80 CEO về phương pháp bảo toàn biên lợi nhuận, tái cơ cấu nợ và áp dụng công cụ phái sinh tài chính trong bối cảnh lãi suất biến động.',
    agenda: [
      { time: '13:30 - 14:00', topic: 'Đón tiếp và giao lưu đầu giờ' },
      { time: '14:00 - 15:00', topic: 'Phân tích bức tranh kinh tế vĩ mô & Thanh khoản thị trường' },
      { time: '15:15 - 16:45', topic: 'Tọa đàm bàn tròn & Thảo luận trực tiếp các case study doanh nghiệp' },
      { time: '16:45 - 17:00', topic: 'Đúc kết khuyến nghị quản trị dòng tiền ngắn hạn' }
    ],
    imagePlaceholder: '[Ảnh sự kiện: Phòng hội thảo bàn tròn CEO Forum]'
  },
  {
    id: 'event-talk-ep14',
    title: 'CEO Talk #14: Quyết định Khó khăn Nhất — Bài học từ Khủng hoảng Vận hành',
    activityId: 'ceo-talk',
    activityName: 'CEO Talk',
    datetime: '19:30 - 21:00, Thứ Ba, 29/09/2026',
    dateStr: '2026-09-29',
    timeStr: '19:30 - 21:00',
    location: 'Hội trường Studio PTIT, Km10 Đường Nguyễn Trãi, Hà Đông, Hà Nội',
    type: 'Trực tiếp',
    availableSeats: 156,
    totalSeats: 300,
    isFull: false,
    status: 'upcoming',
    speakers: [
      {
        name: 'Trương Gia Bình',
        role: 'Chủ tịch HĐQT Tập đoàn FPT',
        avatarPlaceholder: '[Ảnh chân dung: Ông Trương Gia Bình]'
      }
    ],
    description: 'Chương trình trò chuyện trực tiếp bộc bạch những khoảnh khắc cô đơn trên đỉnh cao quyền lực, cách đối mặt với sự cố công nghệ và duy trì niềm tin đội ngũ khi đối diện bờ vực.',
    agenda: [
      { time: '19:30 - 19:40', topic: 'Giới thiệu khách mời và bối cảnh tình huống' },
      { time: '19:40 - 20:30', topic: 'Phần 1: Những quyết định sinh tử và triết lý lãnh đạo vượt bão' },
      { time: '20:30 - 20:55', topic: 'Phần 2: Q&A trực tiếp cùng 10 câu hỏi chọn lọc từ hội viên' },
      { time: '20:55 - 21:00', topic: 'Lời khuyên gửi gắm tới thế hệ lãnh đạo trẻ' }
    ],
    imagePlaceholder: '[Ảnh sự kiện: Trường quay đối thoại CEO Talk]'
  },
  {
    id: 'event-club-fieldtrip',
    title: 'CEO Club: Tham quan Nhà máy Thông minh & Giao lưu Thể thao Quý IV',
    activityId: 'ceo-club',
    activityName: 'CEO Club',
    datetime: '07:30 - 16:30, Thứ Bảy, 24/10/2026',
    dateStr: '2026-10-24',
    timeStr: '07:30 - 16:30',
    location: 'Tổ hợp Công nghiệp Công nghệ cao, Bắc Ninh & Sân Golf Yên Dũng',
    type: 'Trực tiếp',
    availableSeats: 8,
    totalSeats: 30,
    isFull: false,
    status: 'upcoming',
    speakers: [
      {
        name: 'Ban Chủ nhiệm CEO Club',
        role: 'VLGM & Đại diện Doanh nghiệp Tiếp đón',
        avatarPlaceholder: '[Ảnh chân dung: Ban chủ nhiệm CLB]'
      }
    ],
    description: 'Chuyến tham quan thực địa dây chuyền sản xuất tự động hóa cấp độ 4, học hỏi mô hình 5S & Kaizen thực tế, kết hợp giải giao hữu Golf hữu nghị giữa các thành viên.',
    agenda: [
      { time: '07:30 - 08:30', topic: 'Xe đưa đón xuất phát từ Hà Nội' },
      { time: '08:30 - 11:30', topic: 'Tham quan thực địa nhà máy & Trao đổi mô hình quản trị xưởng' },
      { time: '11:30 - 13:00', topic: 'Tiệc trưa thân mật & Giao lưu kết nối' },
      { time: '13:30 - 16:30', topic: 'Giải giao hữu Golf & Thưởng trà đàm đạo' }
    ],
    imagePlaceholder: '[Ảnh sự kiện: Đoàn CEO Club tham quan thực tế nhà máy]'
  },
  {
    id: 'event-peer-hanoi',
    title: 'CEO Peer Group Hà Nội: Phiên Thảo luận Bàn tròn Tái cấu trúc Vốn & Dòng tiền',
    activityId: 'ceo-peer-group',
    activityName: 'CEO Peer Group',
    datetime: '14:00 - 17:00, Thứ Tư, 07/10/2026',
    dateStr: '2026-10-07',
    timeStr: '14:00 - 17:00',
    location: 'Phòng Hội đồng LGM, Tầng 6 Tòa nhà PTIT, Km10 Đường Nguyễn Trãi, Hà Đông, Hà Nội',
    type: 'Trực tiếp',
    availableSeats: 0,
    totalSeats: 15,
    isFull: true,
    status: 'upcoming',
    speakers: [
      {
        name: 'TS. Nguyễn Trọng Điều',
        role: 'Chủ tịch Hội Doanh nhân Tư nhân Việt Nam, Trọng tài viên VIAC',
        avatarPlaceholder: '[Ảnh chân dung: TS. Nguyễn Trọng Điều]'
      }
    ],
    description: 'Phiên thảo luận bàn tròn bảo mật cấp cao (Chatham House Rule) quy tụ 15 CEO cùng chia sẻ về các tình huống tái cấu trúc nợ, đàm phán dòng vốn và cân đối dòng tiền trong môi trường kinh doanh thách thức.',
    agenda: [
      { time: '14:00 - 14:30', topic: 'Khai mạc phiên & Cam kết bảo mật thông tin nội bộ' },
      { time: '14:30 - 15:45', topic: 'Trình bày và mổ xẻ case study tái cấu trúc vốn thực chiến của hội viên' },
      { time: '16:00 - 17:00', topic: 'Hội ý cố vấn tài chính & Kế hoạch hành động bảo toàn thanh khoản' }
    ],
    imagePlaceholder: '[Ảnh sự kiện: Phiên thảo luận bàn tròn CEO Peer Group Hà Nội]'
  },
  {
    id: 'event-summit-2025',
    title: 'CEO Summit 2025: Nâng cao Năng lực Cạnh tranh Quốc tế',
    activityId: 'ceo-summit',
    activityName: 'CEO Summit',
    datetime: '08:00 - 17:30, Thứ Năm, 16/10/2025',
    dateStr: '2025-10-16',
    timeStr: '08:00 - 17:30',
    location: 'Trung tâm Hội nghị Quốc gia, Đại lộ Thăng Long, Hà Nội',
    type: 'Trực tiếp',
    availableSeats: 0,
    totalSeats: 500,
    isFull: true,
    status: 'past',
    speakers: [
      {
        name: 'Nguyễn Mạnh Hùng',
        role: 'Bộ trưởng Bộ TT&TT, Cố vấn Danh dự VLGM',
        avatarPlaceholder: '[Ảnh chân dung: Bộ trưởng Nguyễn Mạnh Hùng]'
      },
      {
        name: 'TS. Võ Trí Thành',
        role: 'Viện trưởng Viện Nghiên cứu Chiến lược Thương hiệu và Cạnh tranh',
        avatarPlaceholder: '[Ảnh chân dung: TS. Võ Trí Thành]'
      }
    ],
    description: 'Hội nghị thượng đỉnh quy tụ 500+ CEO tập đoàn thảo luận giải pháp bảo toàn thanh khoản, tái cấu trúc nợ và khơi thông nguồn lực đầu tư trong bối cảnh vĩ mô toàn cầu biến dịch.',
    agenda: [
      { time: '08:00 - 09:00', topic: 'Đón tiếp và khai mạc Summit 2025' },
      { time: '09:00 - 11:30', topic: 'Phiên 1: Bức tranh kinh tế vĩ mô và rủi ro dòng vốn' },
      { time: '13:30 - 16:30', topic: 'Phiên 2: Tái cơ cấu mô hình kinh doanh và giải pháp tài chính bền vững' }
    ],
    imagePlaceholder: '[Ảnh sự kiện: CEO Summit 2025 tại Trung tâm Hội nghị Quốc gia]'
  },
  {
    id: 'event-forum-supplychain',
    title: 'CEO Forum Quý II: Tối ưu Hóa Chi phí Logistics & Vận tải Đa phương thức',
    activityId: 'ceo-forum',
    activityName: 'CEO Forum',
    datetime: '13:30 - 17:30, Thứ Sáu, 26/06/2026',
    dateStr: '2026-06-26',
    timeStr: '13:30 - 17:30',
    location: 'Khách sạn InterContinental Hanoi Landmark72, Phạm Hùng, Hà Nội',
    type: 'Trực tiếp',
    availableSeats: 0,
    totalSeats: 100,
    isFull: true,
    status: 'past',
    speakers: [
      {
        name: 'Bà Nguyễn Thị Mai Thanh',
        role: 'Chủ tịch HĐQT Công ty CP Cơ Điện Lạnh (REE)',
        avatarPlaceholder: '[Ảnh chân dung: Bà Mai Thanh]'
      }
    ],
    description: 'Phiên diễn đàn bàn tròn 100 CEO giải quyết bài toán đứt gãy cung ứng, chi phí logistics và cơ hội mở rộng thị phần tại thị trường khu vực Đông Nam Á.',
    agenda: [
      { time: '13:30 - 14:00', topic: 'Đón tiếp đại biểu C-Level' },
      { time: '14:00 - 15:30', topic: 'Báo cáo: Tái định hình Logistics và Nguồn cung Châu Á' },
      { time: '15:45 - 17:30', topic: 'Tọa đàm bàn tròn đa ngành & Đúc kết giải pháp' }
    ],
    imagePlaceholder: '[Ảnh sự kiện: CEO Forum Chuỗi cung ứng tại InterContinental Landmark72]'
  },
  {
    id: 'event-talk-ep13',
    title: 'CEO Talk #13: Văn Hóa Doanh Nghiệp — Cội Nguồn Sức Mạnh Vượt Qua Nghịch Cảnh',
    activityId: 'ceo-talk',
    activityName: 'CEO Talk',
    datetime: '14:00 - 16:30, Thứ Bảy, 16/05/2026',
    dateStr: '2026-05-16',
    timeStr: '14:00 - 16:30',
    location: 'Hội trường Trụ sở Viện LGM & PTIT, Km10 Đường Nguyễn Trãi, Hà Đông, Hà Nội',
    type: 'Trực tiếp',
    availableSeats: 0,
    totalSeats: 250,
    isFull: true,
    status: 'past',
    speakers: [
      {
        name: 'Đoàn Nguyên Đức',
        role: 'Chủ tịch HĐQT Tập đoàn Hoàng Anh Gia Lai',
        avatarPlaceholder: '[Ảnh chân dung: Bầu Đức]'
      }
    ],
    description: 'Chia sẻ chân thành và xúc động về việc xây dựng sự gắn kết tổ chức, gìn giữ niềm tin của cộng sự trong những giai đoạn khó khăn nhất của doanh nghiệp.',
    agenda: [
      { time: '14:00 - 14:15', topic: 'Khai mạc chương trình đối thoại CEO Talk #13' },
      { time: '14:15 - 15:45', topic: 'Đối thoại chuyên sâu: Văn hóa làm nên bản lĩnh doanh nghiệp' },
      { time: '15:45 - 16:30', topic: 'Hỏi đáp trực tiếp cùng các nhà quản trị trẻ' }
    ],
    imagePlaceholder: '[Ảnh sự kiện: Trường quay CEO Talk #13 tại Viện LGM]'
  },
  {
    id: 'event-club-summer2026',
    title: 'CEO Club: Giải Giao Hữu Golf Mùa Hè & Thăm Doanh Nghiệp Nông Nghiệp Công Nghệ Cao',
    activityId: 'ceo-club',
    activityName: 'CEO Club',
    datetime: '07:00 - 17:00, Thứ Bảy, 18/07/2026',
    dateStr: '2026-07-18',
    timeStr: '07:00 - 17:00',
    location: 'Sân Golf Đầm Vạc & Khu nông nghiệp CNC VinEco, Vĩnh Phúc',
    type: 'Trực tiếp',
    availableSeats: 0,
    totalSeats: 36,
    isFull: true,
    status: 'past',
    speakers: [
      {
        name: 'Ban Thư ký CEO Club',
        role: 'Ban Điều hành VCF',
        avatarPlaceholder: '[Ảnh: Ban Thư ký]'
      }
    ],
    description: 'Ngày hội kết nối thể thao ngoài trời kết hợp tham quan học tập mô hình tự động hóa tưới tiêu và quản trị chuỗi cung ứng nông sản xuất khẩu.',
    agenda: [
      { time: '07:00 - 11:30', topic: 'Giải Golf giao hữu CEO Club Cup Mùa Hè' },
      { time: '11:30 - 13:00', topic: 'Tiệc trưa kết nối & Trao giải' },
      { time: '13:30 - 17:00', topic: 'Tham quan thực địa nông trường CNC' }
    ],
    imagePlaceholder: '[Ảnh sự kiện: Thành viên CEO Club tham quan thực tế nông trại]'
  },
  {
    id: 'event-mentoring-kickoff',
    title: 'CEO Mentoring: Phiên Khởi Động & Ghép Cặp Cố Vấn Chiến Lược Mùa Thu 2026',
    activityId: 'ceo-mentoring',
    activityName: 'CEO Mentoring',
    datetime: '08:30 - 12:00, Thứ Bảy, 10/10/2026',
    dateStr: '2026-10-10',
    timeStr: '08:30 - 12:00',
    location: 'Phòng Hội đồng LGM, Tầng 6 Tòa nhà PTIT, Km10 Đường Nguyễn Trãi, Hà Đông, Hà Nội',
    type: 'Trực tiếp',
    availableSeats: 18,
    totalSeats: 30,
    isFull: false,
    status: 'upcoming',
    speakers: [
      {
        name: 'Trương Gia Bình',
        role: 'Chủ tịch HĐQT Tập đoàn FPT, Trưởng ban Cố vấn Chiến lược',
        avatarPlaceholder: '[Ảnh chân dung: Diễn giả Trương Gia Bình]'
      },
      {
        name: 'TS. Nguyễn Mạnh Hùng',
        role: 'Bộ trưởng Bộ TT&TT, Cố vấn Danh dự VLGM',
        avatarPlaceholder: '[Ảnh chân dung: Bộ trưởng Nguyễn Mạnh Hùng]'
      }
    ],
    description: 'Phiên khởi động mùa cố vấn mới, nơi các Mentee (CEO trẻ / Lãnh đạo kế nhiệm) gặp gỡ và ghép cặp trực tiếp cùng các Mentor kỳ cựu theo nguyện vọng và bài toán doanh nghiệp.',
    agenda: [
      { time: '08:30 - 09:00', topic: 'Đón tiếp và kết nối Mentor - Mentee' },
      { time: '09:00 - 10:15', topic: 'Nguyên tắc đồng hành và thiết lập cam kết cố vấn bảo mật' },
      { time: '10:30 - 11:45', topic: 'Phiên ghép cặp 1-on-1 và thống nhất lộ trình 6 tháng' },
      { time: '11:45 - 12:00', topic: 'Lễ ký kết biên bản cố vấn và chụp ảnh lưu niệm' }
    ],
    imagePlaceholder: '[Ảnh sự kiện: Phiên khởi động chương trình CEO Mentoring]'
  }
];

export const MOCK_ARTICLES: ArticleItem[] = [
  {
    id: 'article-hung-bt-01',
    title: 'Triết lý Lãnh đạo Phụng sự và Sứ mệnh Kiến tạo Tương lai Quốc gia của Doanh nhân Việt',
    sapo: 'Lãnh đạo không phải là người đứng trên tất cả để nhận đặc quyền, mà là người cúi xuống để nâng đỡ và gánh vác trách nhiệm lớn hơn chính mình.',
    content: [
      'Một dân tộc muốn hùng cường phải có những doanh nghiệp hùng mạnh. Một doanh nghiệp muốn trường tồn phải có những nhà lãnh đạo biết đặt lợi ích của tổ chức và đất nước lên trên lợi ích vị kỷ.',
      'Triết lý LGM (Leadership & Governance Mastery) mà chúng ta theo đuổi không bắt đầu từ kỹ trị hay công cụ cơ bắp, mà bắt đầu từ Tâm thế người đứng đầu. Khi người thuyền trưởng có tâm thế phụng sự, mọi quyết định dù khó khăn đến đâu cũng sẽ tìm được con đường sáng.',
      'Trong thời đại công nghệ số và trí tuệ nhân tạo phát triển như vũ bão, thứ giữ cho doanh nghiệp không bị lạc lối không phải là thuật toán, mà là Hệ giá trị cốt lõi. Doanh nghiệp Việt Nam phải dám nhận việc lớn, việc khó của quốc gia, lấy thách thức làm lò luyện bản lĩnh.'
    ],
    author: {
      name: 'Nguyễn Mạnh Hùng',
      role: 'Bộ trưởng Bộ Thông tin và Truyền thông',
      bio: 'Chủ tịch Danh dự Hội đồng Cố vấn VLGM, nguyên Chủ tịch Tập đoàn Viễn thông Quân đội (Viettel).',
      avatarPlaceholder: '[Ảnh chân dung: Tác giả Nguyễn Mạnh Hùng]',
      avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    },
    category: 'hung-bt',
    categoryName: 'Bài viết của BT Nguyễn Mạnh Hùng',
    subCategory: 'Triết lý Lãnh đạo',
    publishedDate: '12/08/2026',
    readTime: '8 phút đọc',
    tags: ['Triết lý Lãnh đạo', 'LGM', 'Tầm nhìn Quốc gia', 'Chuyển đổi số'],
    imagePlaceholder: '[Ảnh minh họa bài viết: Lãnh đạo phụng sự và phát triển quốc gia]',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    isSpotlight: true
  },
  {
    id: 'article-hung-bt-02',
    title: 'Văn hóa Doanh nghiệp trong Kỷ nguyên Số: Bản sắc là Cội nguồn Sức mạnh',
    sapo: 'Công nghệ có thể mua được, vốn có thể vay được, quy trình có thể học được. Thứ duy nhất đối thủ không thể sao chép là Bản sắc Văn hóa và Tinh thần kỷ luật của tổ chức.',
    content: [
      'Nhiều người lầm tưởng chuyển đổi số là mua sắm phần mềm hay trang bị máy chủ hiện đại. Nhưng 90% sự thành bại của chuyển đổi số nằm ở sự chuyển dịch văn hóa làm việc và tư duy của con người.',
      'Một tổ chức kỷ luật nhưng thiếu lòng trắc ẩn sẽ trở nên xơ cứng. Một tổ chức nhiều ý tưởng nhưng thiếu tính kỷ luật thực thi sẽ nhanh chóng tan rã. Lãnh đạo là nghệ thuật cân bằng giữa kỷ luật sắt và tình yêu thương vô điều kiện đối với sự phát triển của cộng sự.'
    ],
    author: {
      name: 'Nguyễn Mạnh Hùng',
      role: 'Bộ trưởng Bộ Thông tin và Truyền thông',
      bio: 'Chủ tịch Danh dự Hội đồng Cố vấn VLGM.',
      avatarPlaceholder: '[Ảnh chân dung: Tác giả Nguyễn Mạnh Hùng]',
      avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    },
    category: 'hung-bt',
    categoryName: 'Bài viết của BT Nguyễn Mạnh Hùng',
    subCategory: 'Văn hóa Doanh nghiệp',
    publishedDate: '01/08/2026',
    readTime: '6 phút đọc',
    tags: ['Văn hóa Doanh nghiệp', 'Kỷ luật Thực thi', 'Quản trị Nhân sự'],
    imagePlaceholder: '[Ảnh minh họa: Văn hóa tổ chức và bản sắc lãnh đạo]',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-hung-bt-03',
    title: 'Khát vọng Doanh nghiệp Công nghệ Việt: Dám Ra Biển Lớn và Gánh Vác Việc Khó',
    sapo: 'Không có cách nào luyện nên cơ bắp nếu chỉ tập tạ nhẹ. Doanh nghiệp chỉ có thể lớn lên khi dám nhận những bài toán hóc búa nhất của thị trường quốc tế.',
    content: [
      'Lịch sử kinh tế thế giới chứng minh rằng các quốc gia vươn mình hóa rồng đều dựa trên những tập đoàn công nghệ tiên phong sẵn sàng dấn thân vào thị trường toàn cầu.',
      'Doanh nghiệp công nghệ số Việt Nam mang trong mình gen sáng tạo, bền bỉ và tốc độ thích ứng đáng kinh ngạc. Khi kết hợp cùng tầm nhìn chiến lược dài hạn, chúng ta hoàn toàn có thể tạo nên những sản phẩm Make in Viet Nam được thế giới tôn trọng.'
    ],
    author: {
      name: 'Nguyễn Mạnh Hùng',
      role: 'Bộ trưởng Bộ Thông tin và Truyền thông',
      bio: 'Chủ tịch Danh dự Hội đồng Cố vấn VLGM.',
      avatarPlaceholder: '[Ảnh chân dung: Tác giả Nguyễn Mạnh Hùng]',
      avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    },
    category: 'hung-bt',
    categoryName: 'Bài viết của BT Nguyễn Mạnh Hùng',
    subCategory: 'Khát vọng Việt Nam',
    publishedDate: '25/07/2026',
    readTime: '7 phút đọc',
    tags: ['Khát vọng Việt Nam', 'Công nghệ số', 'Make in Vietnam', 'Toàn cầu hóa'],
    imagePlaceholder: '[Ảnh minh họa: Doanh nghiệp công nghệ ra biển lớn]',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-hung-bt-04',
    title: 'Trí Tuệ Nhân Tạo và Cuộc Cách Mạng Quản Trị: Để Con Người Làm Việc Của Con Người',
    sapo: 'AI không thay thế nhà lãnh đạo, nhưng nhà lãnh đạo biết tận dụng sức mạnh của AI sẽ thay thế những người chần chừ và hoài nghi.',
    content: [
      'Trí tuệ nhân tạo đang giải phóng con người khỏi những công việc lặp lại, những bảng tính nhàm chán. Đây là cơ hội vàng để người lãnh đạo quay trở lại với bản chất cốt lõi: Kết nối cảm xúc, nuôi dưỡng cảm hứng và kiến tạo giá trị nhân văn.',
      'Một tổ chức thông minh là tổ chức biết sử dụng AI để mở rộng năng lực tính toán và thu thập tri thức, nhưng giữ nguyên sự sắc sảo về trực giác và lòng trắc ẩn trong mỗi quyết định liên quan đến số phận con người.'
    ],
    author: {
      name: 'Nguyễn Mạnh Hùng',
      role: 'Bộ trưởng Bộ Thông tin và Truyền thông',
      bio: 'Chủ tịch Danh dự Hội đồng Cố vấn VLGM.',
      avatarPlaceholder: '[Ảnh chân dung: Tác giả Nguyễn Mạnh Hùng]',
      avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    },
    category: 'hung-bt',
    categoryName: 'Bài viết của BT Nguyễn Mạnh Hùng',
    subCategory: 'Chuyển đổi số & AI',
    publishedDate: '18/07/2026',
    readTime: '9 phút đọc',
    tags: ['Trí tuệ Nhân tạo', 'Chuyển đổi số', 'Quản trị Thông minh', 'AI Strategy'],
    imagePlaceholder: '[Ảnh minh họa: Trí tuệ nhân tạo và quản trị tương lai]',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-hung-bt-05',
    title: 'Nghệ Thuật Chọn Tướng và Dụng Nhân: Người Lãnh Đạo Cần Nhìn Ra Điểm Mạnh Độc Nhất',
    sapo: 'Không có ai toàn năng, nhưng ai cũng có một điểm mạnh phi thường. Bí quyết của thuật dùng người là đặt đúng điểm mạnh đó vào vị trí xung kích.',
    content: [
      'Người lãnh đạo giỏi không phải là người thông minh nhất trong phòng, mà là người biết tập hợp những bộ óc xuất chúng và tạo cho họ sân chơi an toàn để thỏa sức sáng tạo.',
      'Sự bao dung của người đứng đầu chính là trần nhà phát triển của cấp dưới. Nếu người lãnh đạo không chấp nhận sai lầm thử nghiệm, tổ chức sẽ chỉ toàn những nhân sự an phận và tầm thường.'
    ],
    author: {
      name: 'Nguyễn Mạnh Hùng',
      role: 'Bộ trưởng Bộ Thông tin và Truyền thông',
      bio: 'Chủ tịch Danh dự Hội đồng Cố vấn VLGM.',
      avatarPlaceholder: '[Ảnh chân dung: Tác giả Nguyễn Mạnh Hùng]',
      avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    },
    category: 'hung-bt',
    categoryName: 'Bài viết của BT Nguyễn Mạnh Hùng',
    subCategory: 'Triết lý Lãnh đạo',
    publishedDate: '09/07/2026',
    readTime: '6 phút đọc',
    tags: ['Dụng nhân', 'Phát triển Lãnh đạo', 'Tâm lý Điều hành'],
    imagePlaceholder: '[Ảnh minh họa: Nghệ thuật chọn tướng và dùng người]',
    imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-hung-bt-06',
    title: 'Phát Triển Bền Vững: Lợi Nhuận Là Điều Kiện Tồn Tại, Sứ Mệnh Mới Là Lý Do Sống',
    sapo: 'Một doanh nghiệp tồn tại được 5 năm cần sản phẩm tốt, 20 năm cần hệ thống tốt, nhưng để tồn tại 100 năm cần một Lý tưởng phụng sự xã hội sâu sắc.',
    content: [
      'Lợi nhuận giống như oxy đối với cơ thể sống: bạn không thể sống thiếu oxy, nhưng không ai sinh ra trên đời chỉ để hít thở oxy. Mục đích cao cả nhất của doanh nghiệp là giải quyết các nỗi đau của con người và đóng góp cho sự thịnh vượng của cộng đồng.',
      'Khi triết lý ESG trở thành máu thịt chứ không phải báo cáo màu mè, doanh nghiệp sẽ tự nhiên xây dựng được sự gắn kết bền vững với khách hàng và niềm tự hào cho đội ngũ cán bộ nhân viên.'
    ],
    author: {
      name: 'Nguyễn Mạnh Hùng',
      role: 'Bộ trưởng Bộ Thông tin và Truyền thông',
      bio: 'Chủ tịch Danh dự Hội đồng Cố vấn VLGM.',
      avatarPlaceholder: '[Ảnh chân dung: Tác giả Nguyễn Mạnh Hùng]',
      avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    },
    category: 'hung-bt',
    categoryName: 'Bài viết của BT Nguyễn Mạnh Hùng',
    subCategory: 'Tầm nhìn Quốc gia',
    publishedDate: '02/07/2026',
    readTime: '8 phút đọc',
    tags: ['Phát triển Bền vững', 'ESG', 'Sứ mệnh Doanh nghiệp', 'Trường tồn'],
    imagePlaceholder: '[Ảnh minh họa: Tầm nhìn phát triển bền vững trường tồn]',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-hung-bt-07',
    title: 'Học Tập Suốt Đời Của Người Đứng Đầu: Khi Lãnh Đạo Ngừng Học, Tổ Chức Bắt Đầu Già Cỗi',
    sapo: 'Khoảng cách giữa người dẫn đầu và kẻ tụt hậu chỉ là một thói quen: Thói quen tự phê bình và mở lòng đón nhận những tri thức mới mẻ mỗi ngày.',
    content: [
      'Kẻ thù nguy hiểm nhất của nhà điều hành không phải là sự thiếu hiểu biết, mà là ảo tưởng rằng mình đã biết hết mọi thứ nhờ những thành công trong quá khứ.',
      'Mỗi CEO cần dành ít nhất 5 giờ mỗi tuần chỉ để đọc, suy ngẫm và đối thoại với những chuyên gia trẻ tuổi. Đó là cách duy nhất để giữ cho trí tuệ luôn sắc bén trước các chuyển dịch công nghệ chớp nhoáng.'
    ],
    author: {
      name: 'Nguyễn Mạnh Hùng',
      role: 'Bộ trưởng Bộ Thông tin và Truyền thông',
      bio: 'Chủ tịch Danh dự Hội đồng Cố vấn VLGM.',
      avatarPlaceholder: '[Ảnh chân dung: Tác giả Nguyễn Mạnh Hùng]',
      avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    },
    category: 'hung-bt',
    categoryName: 'Bài viết của BT Nguyễn Mạnh Hùng',
    subCategory: 'Triết lý Lãnh đạo',
    publishedDate: '24/06/2026',
    readTime: '6 phút đọc',
    tags: ['Học tập Suốt đời', 'Tư duy Đổi mới', 'Phát triển Bản thân'],
    imagePlaceholder: '[Ảnh minh họa: Tinh thần học tập và đổi mới sáng tạo]',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80'
  },

  // THƯ MỤC 2: BÀI VIẾT CỦA CÁC TÁC GIẢ KHÁC (CHUYÊN GIA & HỘI ĐỒNG)
  {
    id: 'article-other-01',
    title: 'Quản trị Hội đồng Quản trị và Ban Điều hành: Ranh giới Phân quyền Hiệu quả',
    sapo: 'Phân tích cơ chế kiểm soát và cân bằng quyền lực giữa Chủ tịch HĐQT và Tổng Giám đốc trong các tập đoàn tư nhân niêm yết.',
    content: [
      'Mâu thuẫn giữa tầm nhìn chiến lược dài hạn của HĐQT và áp lực chỉ số kinh doanh ngắn hạn của Ban Điều hành là bài toán kinh điển của mọi doanh nghiệp đang tăng trưởng nóng.',
      'Để giải quyết vấn đề này, doanh nghiệp cần thiết lập Quy chế Phân quyền (Authority Matrix) minh bạch, dựa trên các ngưỡng giá trị tài chính và mức độ rủi ro chiến lược, thay vì phụ thuộc vào cảm tính cá nhân.'
    ],
    author: {
      name: 'PGS. TS. Trần Đình Thiên',
      role: 'Nguyên Viện trưởng Viện Kinh tế Việt Nam',
      bio: 'Thành viên Tổ Tư vấn Kinh tế của Thủ tướng Chính phủ, Cố vấn Cao cấp VLGM.',
      avatarPlaceholder: '[Ảnh chân dung: PGS. TS. Trần Đình Thiên]',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80'
    },
    category: 'other-authors',
    categoryName: 'Bài viết của các tác giả khác',
    subCategory: 'Quản trị Công ty & HĐQT',
    publishedDate: '28/07/2026',
    readTime: '10 phút đọc',
    tags: ['Quản trị Công ty', 'HĐQT', 'Phân quyền Điều hành', 'Pháp lý Doanh nghiệp'],
    imagePlaceholder: '[Ảnh minh họa: Cơ cấu quản trị và phân quyền HĐQT]',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-other-02',
    title: 'Khung Năng lực Lãnh đạo Thích ứng (Adaptive Leadership) trong Thế giới Biến động',
    sapo: 'Mô hình 5 trụ cột năng lực giúp CEO dẫn dắt tổ chức vượt qua các cú sốc chuỗi cung ứng và biến đổi địa chính trị.',
    content: [
      'Thế giới VUCA đòi hỏi nhà lãnh đạo không chỉ có IQ và EQ cao mà phải có AQ (Chỉ số Vượt nghịch cảnh) và Năng lực ra quyết định trong điều kiện thông tin không hoàn hảo.',
      'Bài viết đúc kết khung 5 năng lực then chốt từ nghiên cứu thực tiễn trên 120 CEO Việt Nam giai đoạn 2023-2026: Tư duy hệ thống, Nhận diện tín hiệu yếu, Giao quyền nhanh, Khả năng hồi phục tâm lý và Quản trị năng lượng cá nhân.'
    ],
    author: {
      name: 'TS. Nguyễn Thanh Tùng',
      role: 'Viện trưởng Viện Quản trị LGM',
      bio: 'Chuyên gia tư vấn tái cấu trúc cho hơn 50 tập đoàn kinh tế tư nhân.',
      avatarPlaceholder: '[Ảnh chân dung: TS. Nguyễn Thanh Tùng]',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'
    },
    category: 'other-authors',
    categoryName: 'Bài viết của các tác giả khác',
    subCategory: 'Lãnh đạo Thích ứng & Khủng hoảng',
    publishedDate: '15/07/2026',
    readTime: '7 phút đọc',
    tags: ['Lãnh đạo Thích ứng', 'Khung Năng lực', 'Quản trị Khủng hoảng'],
    imagePlaceholder: '[Ảnh minh họa: Khung năng lực lãnh đạo thích ứng]',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-other-03',
    title: 'Kinh Tế Vĩ Mô 2026-2027: Lãi Suất Toàn Cầu, Tỷ Giá và Chiến Lược Phòng Thủ Tài Chính',
    sapo: 'Đánh giá các kịch bản chu kỳ kinh tế và giải pháp quản trị dòng tiền tối ưu cho doanh nghiệp có tỷ trọng nợ vay cao.',
    content: [
      'Sự phân hóa chính sách tiền tệ giữa Cục Dự trữ Liên bang Mỹ (Fed) và các ngân hàng trung ương Châu Á đang tạo ra áp lực tỷ giá liên tục lên cán cân thương mại.',
      'Doanh nghiệp cần chuyển từ chiến lược mở rộng sang chiến lược tối ưu bảng cân đối kế toán: Giữ đòn bẩy tài chính dưới mức an toàn 1.2x và chủ động hedging rủi ro tỷ giá cho các hợp đồng nhập khẩu nguyên liệu.'
    ],
    author: {
      name: 'TS. Cấn Văn Lực',
      role: 'Chuyên gia Kinh tế trưởng BIDV & Thành viên Hội đồng Tư vấn CS Tiền tệ',
      bio: 'Chuyên gia phân tích thị trường tài chính và vĩ mô uy tín hàng đầu Việt Nam.',
      avatarPlaceholder: '[Ảnh chân dung: TS. Cấn Văn Lực]',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    },
    category: 'other-authors',
    categoryName: 'Bài viết của các tác giả khác',
    subCategory: 'Kinh tế vĩ mô & Chu kỳ',
    publishedDate: '08/07/2026',
    readTime: '11 phút đọc',
    tags: ['Kinh tế Vĩ mô', 'Lãi suất', 'Tỷ giá', 'Quản trị Dòng tiền'],
    imagePlaceholder: '[Ảnh minh họa: Phân tích kinh tế vĩ mô và chu kỳ tài chính]',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-other-04',
    title: 'Tái Cấu Trúc Vốn và Mua Bán Sáp Nhập (M&A): Bài Học Từ Các Thương Vụ Tỷ Đô',
    sapo: 'Đúc kết 7 sai lầm chí mạng trong khâu định giá, Due Diligence và hòa nhập văn hóa hậu M&A tại thị trường Việt Nam.',
    content: [
      'Hơn 65% các thương vụ M&A không đạt được kỳ vọng giá trị cộng hưởng (Synergy) ban đầu, phần lớn xuất phát từ việc đánh giá thấp xung đột văn hóa doanh nghiệp hậu sáp nhập.',
      'Quy trình M&A thành công đòi hỏi sự phối hợp chặt chẽ giữa đội ngũ chiến lược và nhân sự ngay từ giai đoạn thẩm định, thay vì chỉ phó mặc cho các công ty luật và kiểm toán độc lập.'
    ],
    author: {
      name: 'ThS. Lê Hoài Ân (CFA)',
      role: 'Chuyên gia Tư vấn Tài chính Doanh nghiệp',
      bio: 'Chủ tịch W-Invest, cố vấn M&A cho nhiều tập đoàn sản xuất và bán lẻ.',
      avatarPlaceholder: '[Ảnh chân dung: ThS. Lê Hoài Ân]',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
    },
    category: 'other-authors',
    categoryName: 'Bài viết của các tác giả khác',
    subCategory: 'Tái cấu trúc & M&A',
    publishedDate: '30/06/2026',
    readTime: '9 phút đọc',
    tags: ['M&A', 'Tái cấu trúc Vốn', 'Thẩm định Doanh nghiệp', 'Chiến lược'],
    imagePlaceholder: '[Ảnh minh họa: Tái cấu trúc vốn và thương vụ M&A]',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-other-05',
    title: 'Thể Chế Pháp Lý và Rủi Ro Tuân Thủ Cho Ban Lãnh Đạo Trong Giai Đoạn Mới',
    sapo: 'Nhận diện các rủi ro hình sự hóa quan hệ kinh tế và xây dựng hệ thống phòng thủ pháp lý nội bộ vững chắc cho HĐQT.',
    content: [
      'Môi trường kinh doanh hiện đại đòi hỏi ban điều hành phải có tư duy tuân thủ chủ động (Proactive Compliance) thay vì xử lý sự vụ đối phó.',
      'Việc thiết lập Ban Kiểm soát Độc lập và kênh báo cáo ẩn danh (Whistleblower Protection) là lá chắn hữu hiệu bảo vệ người đứng đầu trước các sai phạm tiềm ẩn ở các cấp quản lý trung gian.'
    ],
    author: {
      name: 'Luật sư Trương Thanh Đức',
      role: 'Trọng tài viên VIAC, Giám đốc Công ty Luật ANVI',
      bio: 'Chuyên gia pháp luật doanh nghiệp và ngân hàng với hơn 30 năm kinh nghiệm.',
      avatarPlaceholder: '[Ảnh chân dung: LS Trương Thanh Đức]',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80'
    },
    category: 'other-authors',
    categoryName: 'Bài viết của các tác giả khác',
    subCategory: 'Pháp lý & Thể chế',
    publishedDate: '19/06/2026',
    readTime: '12 phút đọc',
    tags: ['Pháp lý Doanh nghiệp', 'Rủi ro Tuân thủ', 'Bảo vệ Ban Điều hành'],
    imagePlaceholder: '[Ảnh minh họa: Thể chế pháp lý và quản trị rủi ro]',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-other-06',
    title: 'Xây Dựng Chuỗi Cung Ứng Linh Hoạt: Đa Dạng Hóa Thị Trường và Tối Ưu Tồn Kho',
    sapo: 'Giải pháp ứng phó với xu hướng tái định vị chuỗi giá trị toàn cầu và chiến lược sản xuất gần (Nearshoring).',
    content: [
      'Mô hình Just-in-Time truyền thống đang dần nhường chỗ cho Just-in-Case khi các rủi ro vận tải biển và tắc nghẽn luồng hàng địa chính trị gia tăng.',
      'Doanh nghiệp sản xuất Việt Nam cần chủ động số hóa toàn bộ hệ thống nhà cung ứng bậc 2, bậc 3 để phát hiện điểm nghẽn trước khi chúng gây tê liệt dây chuyền.'
    ],
    author: {
      name: 'TS. Đỗ Thiên Anh Tuấn',
      role: 'Giảng viên Trường Chính sách Công và Quản lý Fulbright',
      bio: 'Chuyên gia nghiên cứu chính sách kinh tế công và chuỗi cung ứng khu vực Đông Nam Á.',
      avatarPlaceholder: '[Ảnh chân dung: TS. Đỗ Thiên Anh Tuấn]',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    },
    category: 'other-authors',
    categoryName: 'Bài viết của các tác giả khác',
    subCategory: 'Kinh tế vĩ mô & Chu kỳ',
    publishedDate: '10/06/2026',
    readTime: '8 phút đọc',
    tags: ['Chuỗi cung ứng', 'Logistics', 'Sản xuất', 'Chiến lược'],
    imagePlaceholder: '[Ảnh minh họa: Chuỗi cung ứng linh hoạt và quản trị tồn kho]',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-other-07',
    title: 'Chiến Lược Nhân Sự Kế Nhiệm: Chuẩn Bị Thế Hệ C-Level Tiếp Nối Cho Doanh Nghiệp Gia Đình',
    sapo: 'Quy trình 4 bước chuyển giao quyền lực bài bản giúp bảo toàn di sản kinh doanh và ngăn ngừa khủng hoảng chuyển đổi.',
    content: [
      'Giai đoạn chuyển giao giữa thế hệ sáng lập (F1) và thế hệ kế nghiệp (F2) là giai đoạn mong manh nhất trong vòng đời của một doanh nghiệp gia đình.',
      'Sự chuẩn bị cần diễn ra ít nhất 5 đến 7 năm trước khi bàn giao quyền lực chính thức, thông qua việc luân chuyển F2 qua các vị trí khó khăn nhất để xây dựng uy tín tự thân đối với HĐQT và ban điều hành.'
    ],
    author: {
      name: 'Bà Tiêu Yến Trinh',
      role: 'Tổng Giám đốc Talentnet Corporation',
      bio: 'Chuyên gia hàng đầu về quản trị nhân tài và hoạch định nhân sự cấp cao tại Việt Nam.',
      avatarPlaceholder: '[Ảnh chân dung: Bà Tiêu Yến Trinh]',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
    },
    category: 'other-authors',
    categoryName: 'Bài viết của các tác giả khác',
    subCategory: 'Quản trị Công ty & HĐQT',
    publishedDate: '01/06/2026',
    readTime: '9 phút đọc',
    tags: ['Kế nhiệm', 'Doanh nghiệp Gia đình', 'F1 F2', 'Nhân sự C-Level'],
    imagePlaceholder: '[Ảnh minh họa: Chuyển giao quyền lực và nhân sự kế nhiệm]',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80'
  },

  // THƯ MỤC 3: TRI THỨC PHÁI SINH & CASE STUDY
  {
    id: 'article-derived-01',
    title: 'Case Study Tái cấu trúc Toàn diện: Bài học từ 500 Ngày Thay máu Vận hành của một Tập đoàn Bán lẻ',
    sapo: 'Nghiên cứu điển hình do Ban Nghiên cứu VLGM biên soạn và phân tích từ tài liệu tái cơ cấu nội bộ.',
    content: [
      'Nghiên cứu này tổng hợp quá trình cắt giảm 35% chi phí vận hành cố định, tái thương lượng hợp đồng mặt bằng và số hóa 100% quy trình kiểm kho trong vòng 18 tháng.',
      'Các bài học rút ra được lượng hóa thành bộ chỉ số cảnh báo sớm (Early Warning KPIs) mà các CEO doanh nghiệp quy mô tương tự có thể áp dụng ngay.'
    ],
    author: {
      name: 'Ban Nghiên cứu & Phát triển Tri thức VLGM',
      role: 'Bộ phận Nghiên cứu Học thuật',
      bio: 'Nhóm chuyên gia phân tích dữ liệu và tình huống quản trị thực tiễn.',
      avatarPlaceholder: '[Ảnh minh họa: Ban Nghiên cứu VLGM]',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    },
    category: 'derived-knowledge',
    categoryName: 'Tri thức phái sinh',
    subCategory: 'Case Study Doanh nghiệp',
    publishedDate: '05/07/2026',
    readTime: '12 phút đọc',
    tags: ['Case Study', 'Tái cấu trúc', 'Bán lẻ', 'Chi phí Vận hành'],
    imagePlaceholder: '[Ảnh minh họa: Phân tích case study tái cấu trúc]',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
    sourceReference: {
      originalSource: 'Báo cáo Nghiên cứu Tái cơ cấu Doanh nghiệp Bán lẻ Việt Nam 2024-2026',
      author: 'Hội đồng Khoa học VLGM & PTIT',
      year: '2026',
      notes: 'Nội dung được tổng hợp, chuẩn hóa và bảo mật tên định danh doanh nghiệp theo quy định.'
    }
  },
  {
    id: 'article-derived-02',
    title: 'Tóm lược Sách Chuyên khảo: Quản trị theo Mục tiêu & Kết quả Then chốt (OKR) cho Khối Sản xuất',
    sapo: 'Bản đúc kết cô đọng các nguyên lý thiết lập mục tiêu đột phá kết hợp kiểm soát an toàn vận hành nhà máy.',
    content: [
      'Khác với doanh nghiệp công nghệ, việc áp dụng OKR vào nhà máy sản xuất đòi hỏi sự linh hoạt trong việc phân tầng mục tiêu: tách biệt rõ mục tiêu duy trì (KPIs) và mục tiêu đổi mới bứt phá (OKRs).',
      'Tài liệu phái sinh cung cấp biểu mẫu mẫu và hướng dẫn họp CFR (Conversation - Feedback - Recognition) định kỳ hàng tuần cho quản đốc phân xưởng.'
    ],
    author: {
      name: 'Tổ Biên dịch & Hiệu đính Học viện PTIT',
      role: 'Bộ phận Xuất bản Học thuật',
      bio: 'Chuyên trách dịch thuật và biên soạn các tài liệu quản trị thế giới.',
      avatarPlaceholder: '[Ảnh minh họa: Tổ Biên dịch PTIT]',
      avatarUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
    },
    category: 'derived-knowledge',
    categoryName: 'Tri thức phái sinh',
    subCategory: 'Tóm lược Sách Quản trị',
    publishedDate: '20/06/2026',
    readTime: '9 phút đọc',
    tags: ['OKR', 'Sản xuất', 'Tóm tắt Sách', 'Hiệu suất'],
    imagePlaceholder: '[Ảnh minh họa: Phương pháp OKR cho khối sản xuất]',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80',
    sourceReference: {
      originalSource: 'Monograph: High-Output Management & Agile Manufacturing Systems',
      author: 'Prof. Andrew S. & PTIT Editorial Board',
      year: '2025',
      notes: 'Bản dịch và chú giải tình huống đặc thù áp dụng tại các khu công nghiệp Việt Nam.'
    }
  },
  {
    id: 'article-derived-03',
    title: 'Khung Năng Lực 6D Của Nhà Lãnh Đạo Tinh Hoa LGM: Từ Tâm Thế Đến Thực Thi Xuất Sắc',
    sapo: 'Hệ thống hóa chuẩn mực 6 chiều năng lực điều hành do Hội đồng Khoa học VLGM đúc kết cho CEO Việt Nam.',
    content: [
      'Mô hình 6D bao gồm: Định vị Tầm nhìn (Direction), Dụng nhân Hợp lực (Development), Điều phối Dòng tiền (Dollars), Dẫn dắt Chuyển đổi (Digital), Đạo đức Phụng sự (Duty) và Kỷ luật Thực thi (Delivery).',
      'Mỗi chiều năng lực đều đi kèm bộ thang đo đánh giá bản thân (Self-Assessment Rubric) với 24 hành vi biểu hiện cụ thể.'
    ],
    author: {
      name: 'Hội đồng Khoa học VLGM',
      role: 'Ban Lý luận Quản trị',
      bio: 'Cơ quan nghiên cứu học thuyết và phương pháp luận LGM.',
      avatarPlaceholder: '[Ảnh minh họa: Hội đồng Khoa học VLGM]',
      avatarUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
    },
    category: 'derived-knowledge',
    categoryName: 'Tri thức phái sinh',
    subCategory: 'Khung Năng lực LGM',
    publishedDate: '12/06/2026',
    readTime: '14 phút đọc',
    tags: ['Khung Năng lực', 'LGM 6D', 'Chuẩn mực Lãnh đạo', 'Đánh giá Năng lực'],
    imagePlaceholder: '[Ảnh minh họa: Khung năng lực 6D lãnh đạo tinh hoa]',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    sourceReference: {
      originalSource: 'Báo cáo Thường niên Năng lực Lãnh đạo Doanh nghiệp Việt 2026',
      author: 'Viện Quản trị LGM & Học viện PTIT',
      year: '2026',
      notes: 'Tài liệu độc quyền lưu hành nội bộ cho hội viên chính thức VCF.'
    }
  },
  {
    id: 'article-derived-04',
    title: 'Case Study: Chuyển Đổi Mô Hình Kinh Doanh Từ Truyền Thống Sang Nền Tảng DaaS (Data-as-a-Service)',
    sapo: 'Phân tích hành trình 3 năm khai phá mỏ vàng dữ liệu khách hàng của một công ty dịch vụ tài chính quy mô trung bình.',
    content: [
      'Công ty đã biến kho dữ liệu giao dịch 10 năm thành các gói dịch vụ phân tích chấm điểm tín dụng vi mô, tạo ra nguồn thu định kỳ (ARR) chiếm 42% tổng doanh thu sau 3 năm.',
      'Bài học then chốt là không vội vàng đầu tư công nghệ đắt đỏ mà phải giải quyết dứt điểm vấn đề chất lượng và làm sạch dữ liệu (Data Cleansing) ở tầng gốc rễ.'
    ],
    author: {
      name: 'Ban Nghiên cứu & Phát triển Tri thức VLGM',
      role: 'Bộ phận Nghiên cứu Học thuật',
      bio: 'Nhóm chuyên gia phân tích dữ liệu và tình huống quản trị thực tiễn.',
      avatarPlaceholder: '[Ảnh minh họa: Ban Nghiên cứu VLGM]',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    },
    category: 'derived-knowledge',
    categoryName: 'Tri thức phái sinh',
    subCategory: 'Case Study Doanh nghiệp',
    publishedDate: '02/06/2026',
    readTime: '11 phút đọc',
    tags: ['Case Study', 'DaaS', 'Kinh doanh Dữ liệu', 'Đổi mới Mô hình'],
    imagePlaceholder: '[Ảnh minh họa: Chuyển đổi mô hình kinh doanh nền tảng dữ liệu]',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    sourceReference: {
      originalSource: 'Chuyên khảo Tình huống Thực tiễn Kinh tế Số Việt Nam',
      author: 'Nhóm Tác giả Viện LGM',
      year: '2026',
      notes: 'Được phép công bố dưới dạng ẩn danh dữ liệu thương mại.'
    }
  },
  {
    id: 'article-derived-05',
    title: 'Tóm Tắt Ấn Phẩm Kinh Điển: "Lãnh Đạo Trắc Ẩn" (Compassionate Leadership) và Hiệu Suất Vượt Trội',
    sapo: 'Tổng hợp luận điểm khoa học chứng minh lòng trắc ẩn kết hợp tiêu chuẩn khắt khe giúp tăng 30% hiệu suất đội ngũ.',
    content: [
      'Nhiều CEO lo sợ rằng sự thấu cảm sẽ làm mềm yếu tổ chức. Nhưng nghiên cứu thực nghiệm của Harvard Business Review cho thấy lòng trắc ẩn sáng suốt (Wise Compassion) là chất xúc tác mạnh mẽ nhất cho lòng trung thành và tính dấn thân.',
      'Bản tóm lược cung cấp ma trận 4 góc phần tư giữa Mức độ Quan tâm và Tiêu chuẩn Kỳ vọng để người lãnh đạo tự hiệu chỉnh phong cách điều hành.'
    ],
    author: {
      name: 'Tổ Biên dịch & Hiệu đính Học viện PTIT',
      role: 'Bộ phận Xuất bản Học thuật',
      bio: 'Chuyên trách dịch thuật và biên soạn các tài liệu quản trị thế giới.',
      avatarPlaceholder: '[Ảnh minh họa: Tổ Biên dịch PTIT]',
      avatarUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
    },
    category: 'derived-knowledge',
    categoryName: 'Tri thức phái sinh',
    subCategory: 'Tóm lược Sách Quản trị',
    publishedDate: '25/05/2026',
    readTime: '8 phút đọc',
    tags: ['Lãnh đạo Trắc ẩn', 'Tóm tắt Sách', 'Tâm lý Đội ngũ', 'Văn hóa'],
    imagePlaceholder: '[Ảnh minh họa: Lãnh đạo trắc ẩn và quản trị cảm xúc]',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    sourceReference: {
      originalSource: 'Compassionate Leadership: How to Do Hard Things in a Human Way',
      author: 'Rasmus Hougaard & Jacqueline Carter',
      year: '2024',
      notes: 'Biên dịch tóm tắt và bình chú góc nhìn văn hóa doanh nghiệp phương Đông.'
    }
  },
  {
    id: 'article-derived-06',
    title: 'Cẩm Nang Xây Dựng Hệ Thống Kiểm Soát Nội Bộ & Quản Trị Rủi Ro ERM Chuẩn Quốc Tế',
    sapo: 'Khung COSO ERM phiên bản tinh giản phù hợp với nguồn lực và tốc độ vận hành của doanh nghiệp tư nhân quy mô vừa và lớn.',
    content: [
      'Quản trị rủi ro không phải là ngăn cản doanh nghiệp mạo hiểm, mà là trang bị cho chiếc xe đua F1 bộ phanh an toàn nhất để tay đua dám nhấn ga hết tốc lực.',
      'Cẩm nang phân loại 4 nhóm rủi ro: Chiến lược, Vận hành, Tài chính và Tuân thủ, kèm theo mẫu Bảng Ma trận Rủi ro (Risk Heatmap) chuẩn hóa.'
    ],
    author: {
      name: 'Ban Nghiên cứu & Phát triển Tri thức VLGM',
      role: 'Bộ phận Nghiên cứu Học thuật',
      bio: 'Nhóm chuyên gia phân tích dữ liệu và tình huống quản trị thực tiễn.',
      avatarPlaceholder: '[Ảnh minh họa: Ban Nghiên cứu VLGM]',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    },
    category: 'derived-knowledge',
    categoryName: 'Tri thức phái sinh',
    subCategory: 'Cẩm nang Vận hành',
    publishedDate: '15/05/2026',
    readTime: '13 phút đọc',
    tags: ['ERM', 'Kiểm soát Nội bộ', 'Quản trị Rủi ro', 'Cẩm nang'],
    imagePlaceholder: '[Ảnh minh họa: Cẩm nang quản trị rủi ro và kiểm soát nội bộ]',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    sourceReference: {
      originalSource: 'Enterprise Risk Management Framework for Vietnamese Enterprises',
      author: 'Ban Cố vấn Quản trị VLGM',
      year: '2026',
      notes: 'Tài liệu cẩm nang nghiệp vụ số 04 thuộc Tủ sách Điều hành VCF.'
    }
  },
  {
    id: 'article-derived-07',
    title: 'Case Study: Ứng Dụng GenAI Tự Động Hóa 40% Quy Trình CSKH & Vận Hành Khối Ngân Hàng',
    sapo: 'Phân tích kiến trúc triển khai Private LLM an toàn dữ liệu, giảm thiểu ảo giác thông tin và tỷ lệ hoàn vốn ROI đạt 280%.',
    content: [
      'Bằng cách áp dụng kiến trúc RAG (Retrieval-Augmented Generation) kết hợp mô hình ngôn ngữ lớn chạy nội bộ trên máy chủ riêng, ngân hàng đã xử lý hơn 120.000 truy vấn mỗi ngày với độ chính xác trên 96%.',
      'Thành công lớn nhất không chỉ là cắt giảm chi phí mà là giải phóng thời gian cho các chuyên viên tư vấn tài chính tập trung vào nhóm khách hàng VIP có giá trị cao.'
    ],
    author: {
      name: 'Ban Nghiên cứu & Phát triển Tri thức VLGM',
      role: 'Bộ phận Nghiên cứu Học thuật',
      bio: 'Nhóm chuyên gia phân tích dữ liệu và tình huống quản trị thực tiễn.',
      avatarPlaceholder: '[Ảnh minh họa: Ban Nghiên cứu VLGM]',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    },
    category: 'derived-knowledge',
    categoryName: 'Tri thức phái sinh',
    subCategory: 'Case Study Doanh nghiệp',
    publishedDate: '05/05/2026',
    readTime: '10 phút đọc',
    tags: ['Case Study', 'GenAI', 'Fintech', 'Tự động hóa', 'LLM'],
    imagePlaceholder: '[Ảnh minh họa: Ứng dụng trí tuệ nhân tạo tạo sinh trong ngân hàng]',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    sourceReference: {
      originalSource: 'Báo cáo Ứng dụng Công nghệ AI trong Quản trị Tài chính 2026',
      author: 'Liên minh Công nghệ PTIT & Đối tác Ngân hàng',
      year: '2026',
      notes: 'Tài liệu case study thực chiến tại các ngân hàng thương mại cổ phần Việt Nam.'
    }
  },
  {
    id: 'article-hung-bt-08',
    title: 'Đổi Mới Sáng Tạo Từ Trọng Tâm Quốc Gia: Bài Học Biến Khó Khăn Thành Năng Lực Cạnh Tranh',
    sapo: 'Việt Nam muốn bứt phá trong kỷ nguyên số phải dám nhận những bài toán lớn nhất của đất nước, dùng công nghệ để giải quyết các nút thắt phát triển bền vững.',
    content: [
      'Không có áp lực lớn thì không có sáng tạo lớn. Doanh nghiệp chỉ trưởng thành khi đối diện với các thách thức mang tầm vóc lịch sử.',
      'Sự tự chủ về công nghệ và năng lực giải quyết vấn đề thực tiễn là nền tảng cốt lõi của độc lập tự cường trong giai đoạn mới.'
    ],
    author: {
      name: 'Nguyễn Mạnh Hùng',
      role: 'Bộ trưởng Bộ Thông tin và Truyền thông',
      bio: 'Chủ tịch Danh dự Hội đồng Cố vấn VLGM, nguyên Chủ tịch Tập đoàn Viễn thông Quân đội (Viettel).',
      avatarPlaceholder: '[Ảnh chân dung: Tác giả Nguyễn Mạnh Hùng]',
      avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    },
    category: 'hung-bt',
    categoryName: 'Bài viết của BT Nguyễn Mạnh Hùng',
    subCategory: 'Tầm nhìn Quốc gia',
    publishedDate: '28/04/2026',
    readTime: '7 phút đọc',
    tags: ['Đổi mới sáng tạo', 'Tầm nhìn Quốc gia', 'LGM', 'Công nghệ số'],
    imagePlaceholder: '[Ảnh minh họa: Đổi mới sáng tạo từ trọng tâm quốc gia]',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-other-08',
    title: 'Quản Trị Tinh Gọn (Lean Management) Trong Khối Doanh Nghiệp Dịch Vụ & Bán Lẻ',
    sapo: 'Nguyên lý loại bỏ lãng phí vô hình, tối ưu hóa điểm chạm khách hàng và rút ngắn thời gian xử lý đơn hàng từ 48 giờ xuống 4 giờ.',
    content: [
      'Quản trị tinh gọn không chỉ áp dụng trong nhà máy sản xuất của Toyota, mà là tư duy tối thượng của các chuỗi bán lẻ hiện đại.',
      'Mỗi quy trình thừa thãi là một rào cản ngăn cách doanh nghiệp với khách hàng trung thành.'
    ],
    author: {
      name: 'TS. Trịnh Quốc Bảo',
      role: 'Viện trưởng Viện Quản trị Thực chiến LGM',
      bio: 'Chuyên gia tư vấn tái cấu trúc chuỗi cung ứng và vận hành tinh gọn cho 50+ tập đoàn.',
      avatarPlaceholder: '[Ảnh chân dung: TS. Trịnh Quốc Bảo]',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    },
    category: 'other-authors',
    categoryName: 'Bài viết của các tác giả khác',
    subCategory: 'Cẩm nang Vận hành',
    publishedDate: '24/04/2026',
    readTime: '9 phút đọc',
    tags: ['Lean', 'Vận hành tinh gọn', 'Bán lẻ', 'Dịch vụ'],
    imagePlaceholder: '[Ảnh minh họa: Quản trị tinh gọn trong bán lẻ và dịch vụ]',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-other-09',
    title: 'Nghệ Thuật Giữ Chân Nhân Tài Cốt Lõi: Đãi Ngộ Phi Tài Chính & Khung Phát Triển Bản Thân',
    sapo: 'Tiền lương chỉ là điều kiện cần. Để nhân sự cấp cao cống hiến hết mình, tổ chức phải trao quyền tự chủ và lộ trình di sản cá nhân.',
    content: [
      'Khảo sát của VLGM với 500 giám đốc nhân sự chỉ ra rằng nguyên nhân hàng đầu khiến nhân sự cấp cao rời đi là cảm giác bị bóp nghẹt quyền sáng tạo và thiếu niềm tin từ người đứng đầu.',
      'Thiết kế chính sách cổ phần thưởng (ESOP) gắn chặt với kết quả dài hạn là đòn bẩy giữ chân hiệu quả nhất.'
    ],
    author: {
      name: 'Bà Nguyễn Mai Phương',
      role: 'Phó Chủ tịch Hiệp hội Nhân lực C-Suite',
      bio: 'Chuyên gia tư vấn thiết kế tổ chức và chính sách đãi ngộ nhân tài cấp cao.',
      avatarPlaceholder: '[Ảnh chân dung: Bà Nguyễn Mai Phương]',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
    },
    category: 'other-authors',
    categoryName: 'Bài viết của các tác giả khác',
    subCategory: 'Quản trị Công ty & HĐQT',
    publishedDate: '20/04/2026',
    readTime: '8 phút đọc',
    tags: ['Nhân tài', 'ESOP', 'Văn hóa tổ chức', 'Giữ chân nhân sự'],
    imagePlaceholder: '[Ảnh minh họa: Giữ chân nhân tài cấp cao và đãi ngộ]',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-derived-08',
    title: 'Cẩm Nang Xây Dựng Bản Đồ Chiến Lược (Strategy Map) & Thẻ Điểm Cân Bằng (BSC)',
    sapo: 'Khung phương pháp liên kết mục tiêu tài chính, khách hàng, quy trình nội bộ và học hỏi phát triển thành một thể thống nhất.',
    content: [
      'Hầu hết các bản chiến lược thất bại không phải vì ý tưởng tồi, mà vì không thể phiên dịch chiến lược cấp cao thành hành động thường nhật cho từng phòng ban.',
      'Bộ tài liệu cung cấp 12 biểu mẫu Balanced Scorecard thực chiến dành riêng cho các ngành sản xuất, thương mại và công nghệ.'
    ],
    author: {
      name: 'Tổ Biên dịch & Hiệu đính Học viện PTIT',
      role: 'Bộ phận Xuất bản Học thuật',
      bio: 'Chuyên trách dịch thuật và biên soạn các tài liệu quản trị thế giới.',
      avatarPlaceholder: '[Ảnh minh họa: Tổ Biên dịch PTIT]',
      avatarUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
    },
    category: 'derived-knowledge',
    categoryName: 'Tri thức phái sinh',
    subCategory: 'Cẩm nang Vận hành',
    publishedDate: '15/04/2026',
    readTime: '11 phút đọc',
    tags: ['Strategy Map', 'BSC', 'Chiến lược', 'Thực thi'],
    imagePlaceholder: '[Ảnh minh họa: Bản đồ chiến lược và BSC]',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-hung-bt-09',
    title: 'Trách Nhiệm Xã Hội Của Doanh Nghiệp (CSR) Trong Thế Kỷ 21: Từ Thiện Nguyện Đến Giá Trị Chung (CSV)',
    sapo: 'Tạo lập giá trị chung (Creating Shared Value) là việc giải quyết các bài toán của cộng đồng thông qua mô hình kinh doanh có lợi nhuận bền vững.',
    content: [
      'Doanh nghiệp không thể phát triển thịnh vượng trên một cộng đồng suy thoái hay một môi trường bị hủy hoại.',
      'Chiến lược CSR hiện đại là biến việc bảo vệ môi trường, nâng đỡ người yếu thế thành lợi thế cạnh tranh cốt lõi của thương hiệu.'
    ],
    author: {
      name: 'Nguyễn Mạnh Hùng',
      role: 'Bộ trưởng Bộ Thông tin và Truyền thông',
      bio: 'Chủ tịch Danh dự Hội đồng Cố vấn VLGM, nguyên Chủ tịch Tập đoàn Viễn thông Quân đội (Viettel).',
      avatarPlaceholder: '[Ảnh chân dung: Tác giả Nguyễn Mạnh Hùng]',
      avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    },
    category: 'hung-bt',
    categoryName: 'Bài viết của BT Nguyễn Mạnh Hùng',
    subCategory: 'Triết lý Lãnh đạo',
    publishedDate: '10/04/2026',
    readTime: '6 phút đọc',
    tags: ['CSR', 'CSV', 'Phụng sự', 'Phát triển bền vững'],
    imagePlaceholder: '[Ảnh minh họa: Trách nhiệm xã hội và giá trị chung]',
    imageUrl: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-other-10',
    title: 'Phân Tích Dòng Tiền & Quản Trị Vốn Lưu Động: Bí Quyết Sinh Tồn Khi Lãi Suất Biến Động',
    sapo: 'Lợi nhuận là quan điểm kế toán, nhưng dòng tiền mới là thực tế sống còn. Hướng dẫn thiết lập bảng dự phóng dòng tiền 13 tuần (13-Week Cash Flow).',
    content: [
      'Nhiều doanh nghiệp báo lãi hàng chục tỷ nhưng vẫn phá sản vì nghẽn dòng tiền thanh toán nợ ngắn hạn.',
      'Việc tối ưu chu kỳ chuyển đổi tiền mặt (Cash Conversion Cycle) là ưu tiên số một của mọi Giám đốc Tài chính trong chu kỳ thắt chặt tín dụng.'
    ],
    author: {
      name: 'Ông Hoàng Minh Tuấn',
      role: 'Chuyên gia Tài chính Doanh nghiệp',
      bio: 'Thành viên Hiệp hội Kiểm toán & Tài chính Công chứng Anh quốc (ACCA).',
      avatarPlaceholder: '[Ảnh chân dung: Ông Hoàng Minh Tuấn]',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80'
    },
    category: 'other-authors',
    categoryName: 'Bài viết của các tác giả khác',
    subCategory: 'Kinh tế vĩ mô & Chu kỳ',
    publishedDate: '05/04/2026',
    readTime: '10 phút đọc',
    tags: ['Dòng tiền', 'Vốn lưu động', 'Tài chính', 'Thanh khoản'],
    imagePlaceholder: '[Ảnh minh họa: Quản trị dòng tiền doanh nghiệp]',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-derived-09',
    title: 'Case Study: Tái Cấu Trúc Khối Bán Lược Thể Thao Đa Kênh (Omnichannel) Tại Thị Trường Đông Nam Á',
    sapo: 'Cách thức hợp nhất kho vận, dữ liệu khách hàng CRM và chính sách giá đồng nhất giữa 120 cửa hàng vật lý và các sàn thương mại điện tử.',
    content: [
      'Khách hàng ngày nay không mua sắm theo kênh đơn lẻ. Họ tìm kiếm trên điện thoại, trải nghiệm tại showroom và chốt đơn tại nhà.',
      'Sự liên thông kho hàng ảo (Virtual Inventory) giúp giảm 35% chi phí lưu kho và tăng tỷ lệ lấp đầy đơn hàng lên 98.5%.'
    ],
    author: {
      name: 'Ban Nghiên cứu & Phát triển Tri thức VLGM',
      role: 'Bộ phận Nghiên cứu Học thuật',
      bio: 'Nhóm chuyên gia phân tích dữ liệu và tình huống quản trị thực tiễn.',
      avatarPlaceholder: '[Ảnh minh họa: Ban Nghiên cứu VLGM]',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    },
    category: 'derived-knowledge',
    categoryName: 'Tri thức phái sinh',
    subCategory: 'Case Study Doanh nghiệp',
    publishedDate: '29/03/2026',
    readTime: '12 phút đọc',
    tags: ['Omnichannel', 'Bán lẻ', 'Tái cấu trúc', 'Case Study'],
    imagePlaceholder: '[Ảnh minh họa: Mô hình bán lẻ đa kênh Omnichannel]',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-other-11',
    title: 'Chỉ Số Xanh ESG & Xu Hướng Tín Dụng Xanh Cho Doanh Nghiệp Sản Xuất Xuất Khẩu',
    sapo: 'Tiêu chuẩn CBAM của Châu Âu và lộ trình kiểm kê khí nhà kính bắt buộc: Thách thức chi phí hay tấm hộ chiếu vươn ra thị trường toàn cầu.',
    content: [
      'ESG không còn là khẩu hiệu quan hệ công chúng mà đã trở thành hàng rào kỹ thuật quyết định sự tồn vong của hàng hóa xuất khẩu Việt Nam.',
      'Các ngân hàng quốc tế đang ưu đãi giảm từ 0.5% đến 1.2% lãi suất cho các khoản vay đáp ứng chứng chỉ công trình xanh và năng lượng tái tạo.'
    ],
    author: {
      name: 'TS. Phạm Hải Yến',
      role: 'Cố vấn Phát triển Bền vững & Kinh tế Tuần hoàn',
      bio: 'Chuyên gia thẩm định chính sách ESG thuộc Mạng lưới Khí hậu Quốc tế.',
      avatarPlaceholder: '[Ảnh chân dung: TS. Phạm Hải Yến]',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80'
    },
    category: 'other-authors',
    categoryName: 'Bài viết của các tác giả khác',
    subCategory: 'Pháp lý & Thể chế',
    publishedDate: '22/03/2026',
    readTime: '9 phút đọc',
    tags: ['ESG', 'Tín dụng xanh', 'CBAM', 'Bền vững'],
    imagePlaceholder: '[Ảnh minh họa: Doanh nghiệp xanh ESG và phát triển bền vững]',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-derived-10',
    title: 'Tóm Tắt Sách: "Chuyển Đổi Mô Hình Kinh Doanh Trong Kỷ Nguyên AI" (Business Model Shift)',
    sapo: '6 quy tắc tái định vị đề xuất giá trị và xây dựng hào kinh tế phòng thủ vững chắc trước làn sóng trí tuệ nhân tạo toàn diện.',
    content: [
      'Công nghệ AI tạo sinh đang làm giảm chi phí cận biên của nội dung và mã nguồn về gần bằng 0. Giá trị gia tăng dịch chuyển về phía dữ liệu độc quyền và mạng lưới quan hệ sâu sắc với khách hàng.',
      'Ấn phẩm phân tích các công thức biến sản phẩm truyền thống thành gói dịch vụ thuê bao thông minh (Smart Subscriptions).'
    ],
    author: {
      name: 'Tổ Biên dịch & Hiệu đính Học viện PTIT',
      role: 'Bộ phận Xuất bản Học thuật',
      bio: 'Chuyên trách dịch thuật và biên soạn các tài liệu quản trị thế giới.',
      avatarPlaceholder: '[Ảnh minh họa: Tổ Biên dịch PTIT]',
      avatarUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
    },
    category: 'derived-knowledge',
    categoryName: 'Tri thức phái sinh',
    subCategory: 'Tóm lược Sách Quản trị',
    publishedDate: '16/03/2026',
    readTime: '8 phút đọc',
    tags: ['AI', 'Mô hình kinh doanh', 'Tóm tắt Sách', 'Đổi mới'],
    imagePlaceholder: '[Ảnh minh họa: Đổi mới mô hình kinh doanh trong kỷ nguyên AI]',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-hung-bt-10',
    title: 'Xây Dựng Văn Hóa Trọng Dụng Người Hiền Tài: Tâm Thế Của Người Đứng Đầu',
    sapo: 'Người tài chỉ hội tụ ở nơi có khát vọng lớn và có sự tôn trọng chân thành. Người lãnh đạo lớn là người biết dung nạp sự khác biệt để đạt mục tiêu chung.',
    content: [
      'Nếu chúng ta chỉ tìm những người nghe lời, tổ chức sẽ nhỏ dần theo thời gian. Người lãnh đạo dũng cảm là người dám dùng những người giỏi hơn mình trong các lĩnh vực chuyên môn cụ thể.',
      'Sự khiêm nhường của thuyền trưởng chính là bến đỗ an lành cho những trí tuệ tài hoa nhất.'
    ],
    author: {
      name: 'Nguyễn Mạnh Hùng',
      role: 'Bộ trưởng Bộ Thông tin và Truyền thông',
      bio: 'Chủ tịch Danh dự Hội đồng Cố vấn VLGM, nguyên Chủ tịch Tập đoàn Viễn thông Quân đội (Viettel).',
      avatarPlaceholder: '[Ảnh chân dung: Tác giả Nguyễn Mạnh Hùng]',
      avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    },
    category: 'hung-bt',
    categoryName: 'Bài viết của BT Nguyễn Mạnh Hùng',
    subCategory: 'Văn hóa Doanh nghiệp',
    publishedDate: '10/03/2026',
    readTime: '7 phút đọc',
    tags: ['Hiền tài', 'Dụng nhân', 'Văn hóa tổ chức', 'Tâm thế'],
    imagePlaceholder: '[Ảnh minh họa: Xây dựng văn hóa trọng dụng người hiền tài]',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-other-12',
    title: 'Quản Trị Khủng Hoảng Truyền Thông Trong Thời Đại Mạng Xã Hội Lan Truyền',
    sapo: 'Quy tắc 3 giờ vàng để minh bạch thông tin, lắng nghe dư luận và ngăn chặn làn sóng tẩy chay thương hiệu từ các sự cố ngoài ý muốn.',
    content: [
      'Trong thời đại TikTok và Facebook, tốc độ lan truyền của tin giả gấp 6 lần tin xác thực. Sự im lặng hay bao biện luôn bị công chúng diễn giải là sự thừa nhận sai phạm.',
      'Cẩm nang đưa ra quy trình 5 bước phản ứng nhanh cho ban giám đốc và người phát ngôn chính thức.'
    ],
    author: {
      name: 'Ông Đỗ Vũ Hoàng',
      role: 'Chuyên gia Chiến lược Truyền thông & Thương hiệu',
      bio: 'Cố vấn thương hiệu cấp cao cho nhiều thương hiệu quốc gia và tập đoàn đa ngành.',
      avatarPlaceholder: '[Ảnh chân dung: Ông Đỗ Vũ Hoàng]',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
    },
    category: 'other-authors',
    categoryName: 'Bài viết của các tác giả khác',
    subCategory: 'Lãnh đạo Thích ứng & Khủng hoảng',
    publishedDate: '02/03/2026',
    readTime: '10 phút đọc',
    tags: ['Khủng hoảng', 'Truyền thông', 'Thương hiệu', 'Quan hệ công chúng'],
    imagePlaceholder: '[Ảnh minh họa: Xử lý khủng hoảng truyền thông hiện đại]',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-derived-11',
    title: 'Khung Năng Lực Đàm Phán & Thâu Tóm M&A Cho Doanh Nghiệp Vừa & Nhỏ (SMEs)',
    sapo: 'Các kỹ thuật định giá thực tế, thẩm định pháp lý Due Diligence và phương án hòa nhập văn hóa hậu sáp nhập (Post-Merger Integration).',
    content: [
      '70% thương vụ M&A thất bại sau khi ký kết hợp đồng vì xung đột văn hóa lãnh đạo và hệ thống quản trị không tương thích.',
      'Tài liệu phân tích danh mục 50 câu hỏi thẩm định sống còn trước khi đưa ra quyết định mua lại đối thủ cạnh tranh.'
    ],
    author: {
      name: 'Ban Nghiên cứu & Phát triển Tri thức VLGM',
      role: 'Bộ phận Nghiên cứu Học thuật',
      bio: 'Nhóm chuyên gia phân tích dữ liệu và tình huống quản trị thực tiễn.',
      avatarPlaceholder: '[Ảnh minh họa: Ban Nghiên cứu VLGM]',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    },
    category: 'derived-knowledge',
    categoryName: 'Tri thức phái sinh',
    subCategory: 'Tái cấu trúc & M&A',
    publishedDate: '21/02/2026',
    readTime: '13 phút đọc',
    tags: ['M&A', 'Thẩm định', 'Định giá', 'Tái cấu trúc'],
    imagePlaceholder: '[Ảnh minh họa: Đàm phán và sáp nhập doanh nghiệp M&A]',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'article-other-13',
    title: 'Kỷ Luật Tài Chính Trong Giai Đoạn Mở Rộng Thần Tốc (Scaling-Up)',
    sapo: 'Làm thế nào để tăng trưởng doanh số gấp 3 lần mà không đánh mất sự kiểm soát chi phí vận hành và tính an toàn thanh khoản.',
    content: [
      'Tăng trưởng quá nhanh mà thiếu hệ thống kiểm soát tài chính tựa như việc lái xe tốc độ 200km/h mà không có dây an toàn.',
      'Xây dựng các chốt chặn chi phí (Unit Economics) cho từng sản phẩm trước khi quyết định bơm vốn mở rộng quy mô là bài học xương máu của giới khởi nghiệp công nghệ.'
    ],
    author: {
      name: 'TS. Lê Đình Trọng',
      role: 'Thành viên HĐQT Độc lập & Cố vấn Chiến lược Vốn',
      bio: 'Nguyên Giám đốc Khối Đầu tư Quỹ Tăng trưởng Đông Nam Á.',
      avatarPlaceholder: '[Ảnh chân dung: TS. Lê Đình Trọng]',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
    },
    category: 'other-authors',
    categoryName: 'Bài viết của các tác giả khác',
    subCategory: 'Quản trị Công ty & HĐQT',
    publishedDate: '12/02/2026',
    readTime: '9 phút đọc',
    tags: ['Scaling-Up', 'Kỷ luật tài chính', 'Tăng trưởng', 'HĐQT'],
    imagePlaceholder: '[Ảnh minh họa: Mở rộng quy mô doanh nghiệp và kỷ luật tài chính]',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
  }
];

export const MOCK_PROGRAMS: TrainingProgram[] = [
  {
    id: 'program-ceo-lgm-mastery',
    title: 'Chương trình Đào tạo Giám đốc Điều hành Tinh hoa (CEO LGM Mastery)',
    code: 'LGM-CEO-2026',
    targetAudience: 'Chủ tịch, Thành viên HĐQT, Tổng Giám đốc doanh nghiệp quy mô từ 100 nhân sự hoặc doanh thu từ 100 tỷ VNĐ.',
    shortDesc: 'Chương trình đào tạo đỉnh cao 6 tháng kết hợp lý luận quản trị LGM, đối thoại chuyên gia thực chiến và xây dựng bản đồ chiến lược doanh nghiệp.',
    duration: '6 tháng (12 chuyên đề cuối tuần)',
    format: 'Trực tiếp tại Hà Nội & Thực địa doanh nghiệp',
    nextCohort: 'Khóa 08 — Khai giảng ngày 14/11/2026',
    tuitionFee: '120.000.000 VNĐ / Học viên (Bao gồm tài liệu, ăn trưa và chi phí thực địa)',
    scholarshipInfo: 'Học bổng 20% dành cho Hội viên Doanh nghiệp VCF đăng ký trước 30/09/2026.',
    externalUrl: 'https://daotao.ptit.edu.vn/khoa-hoc/ceo-lgm-mastery-demo',
    imagePlaceholder: '[Ảnh chương trình: Lớp học CEO LGM Mastery cao cấp]',
    objectives: [
      'Làm chủ tư duy quản trị hệ thống và hoạch định chiến lược kinh doanh 5 năm',
      'Hoàn thiện cấu trúc tài chính, dòng tiền và kiểm soát rủi ro pháp lý toàn diện',
      'Xây dựng văn hóa thực thi mạnh mẽ và phát triển đội ngũ kế cận xuất sắc',
      'Được cố vấn trực tiếp đồ án chiến lược áp dụng vào chính doanh nghiệp mình'
    ],
    modules: [
      {
        title: 'Học phần 1: Tâm thế Lãnh đạo & Triết lý Quản trị LGM',
        duration: '2 ngày (16 giờ)',
        topics: ['Hệ giá trị người đứng đầu', 'Mô hình quản trị doanh nghiệp hiện đại', 'Phân định HĐQT và Ban Điều hành']
      },
      {
        title: 'Học phần 2: Chiến lược Cạnh tranh & Đổi mới Mô hình Kinh doanh',
        duration: '2 ngày (16 giờ)',
        topics: ['Định vị giá trị cốt lõi', 'Chiến lược Đại dương Xanh', 'Chuyển đổi số và mô hình nền tảng']
      },
      {
        title: 'Học phần 3: Tài chính Chiến lược & Quản trị Dòng tiền cho CEO',
        duration: '2 ngày (16 giờ)',
        topics: ['Đọc hiểu và giải mã báo cáo tài chính', 'Định giá doanh nghiệp & Gọi vốn', 'Quản trị rủi ro thanh khoản']
      },
      {
        title: 'Học phần 4: Đồ án Chiến lược Thực tế & Bảo vệ trước Hội đồng',
        duration: '1 tháng kèm cặp',
        topics: ['Xây dựng bản đồ chiến lược 3 năm', 'Phản biện từ Hội đồng Chuyên gia VLGM', 'Kế hoạch hành động 100 ngày']
      }
    ],
    faculty: [
      {
        name: 'PGS. TS. Trần Đình Thiên',
        role: 'Chủ tịch Hội đồng Khoa học',
        bio: 'Nguyên Viện trưởng Viện Kinh tế Việt Nam, Cố vấn kinh tế cấp cao.',
        avatarPlaceholder: '[Ảnh giảng viên: PGS. TS. Trần Đình Thiên]'
      },
      {
        name: 'TS. Nguyễn Thanh Tùng',
        role: 'Giám đốc Chương trình CEO LGM',
        bio: 'Chuyên gia tư vấn tái cấu trúc tập đoàn, hơn 20 năm kinh nghiệm điều hành.',
        avatarPlaceholder: '[Ảnh giảng viên: TS. Nguyễn Thanh Tùng]'
      }
    ],
    upcomingSchedules: [
      {
        cohort: 'Khóa 08 (Hà Nội)',
        startDate: '14/11/2026',
        location: 'Trung tâm Đào tạo Quốc tế PTIT, Hà Đông, Hà Nội',
        status: 'Đang nhận hồ sơ'
      },
      {
        cohort: 'Khóa 09 (TP. Hồ Chí Minh)',
        startDate: '12/12/2026',
        location: 'Khách sạn Rex Sài Gòn, Quận 1, TP. HCM',
        status: 'Đang nhận hồ sơ'
      }
    ]
  },
  {
    id: 'program-cfo-transformation',
    title: 'Giám đốc Tài chính Chiến lược & Quản trị Rủi ro (Strategic CFO)',
    code: 'LGM-CFO-2026',
    targetAudience: 'Giám đốc Tài chính, Kế toán trưởng, Giám đốc Đầu tư các công ty cổ phần và tập đoàn.',
    shortDesc: 'Nâng tầm vai trò từ người ghi chép số liệu thành đối tác chiến lược của CEO trong mọi quyết định kinh doanh sống còn.',
    duration: '3 tháng (6 chuyên đề cuối tuần)',
    format: 'Hybrid (Trực tiếp kết hợp Trực tuyến chất lượng cao)',
    nextCohort: 'Khóa 05 — Khai giảng ngày 20/10/2026',
    tuitionFee: '65.000.000 VNĐ / Học viên',
    externalUrl: 'https://daotao.ptit.edu.vn/khoa-hoc/strategic-cfo-demo',
    imagePlaceholder: '[Ảnh chương trình: Khóa đào tạo Strategic CFO]',
    objectives: [
      'Thiết lập hệ thống kiểm soát tài chính tự động hóa bằng công nghệ',
      'Nắm vững kỹ thuật M&A, định giá và cấu trúc thương vụ đầu tư',
      'Tối ưu hóa chi phí vốn và chính sách thuế an toàn cho doanh nghiệp'
    ],
    modules: [
      {
        title: 'Học phần 1: Tái định vị Chân dung CFO Chiến lược',
        duration: '16 giờ',
        topics: ['Business Partnering', 'KPIs tài chính phi truyền thống', 'Dashboard quản trị dữ liệu lớn']
      },
      {
        title: 'Học phần 2: Cấu trúc Vốn & Huy động Nguồn lực',
        duration: '16 giờ',
        topics: ['Trái phiếu doanh nghiệp', 'Tín dụng xanh & Quỹ đầu tư mạo hiểm', 'Cân đối dòng tiền']
      }
    ],
    faculty: [
      {
        name: 'TS. Lê Xuân Nghĩa',
        role: 'Chuyên gia Tài chính Tiền tệ',
        bio: 'Nguyên Phó Chủ tịch Ủy ban Giám sát Tài chính Quốc gia.',
        avatarPlaceholder: '[Ảnh giảng viên: TS. Lê Xuân Nghĩa]'
      }
    ],
    upcomingSchedules: [
      {
        cohort: 'Khóa 05 (Toàn quốc)',
        startDate: '20/10/2026',
        location: 'PTIT Hà Nội & Trực tuyến LMS',
        status: 'Đang nhận hồ sơ'
      }
    ]
  }
];

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'mentor-01',
    name: 'Nguyễn Mạnh Hùng',
    role: 'Bộ trưởng Bộ TT&TT, Cố vấn Danh dự VLGM',
    organization: 'Bộ Thông tin & Truyền thông',
    specialties: ['Triết lý Lãnh đạo', 'Chuyển đổi số Quốc gia', 'Chiến lược Đột phá'],
    bio: 'Nhà lãnh đạo với tầm nhìn đưa công nghệ số vào mọi ngóc ngách của đời sống kinh tế xã hội và xây dựng văn hóa phụng sự.',
    avatarPlaceholder: '[Ảnh chân dung: Mentor Nguyễn Mạnh Hùng]'
  },
  {
    id: 'mentor-02',
    name: 'PGS. TS. Trần Đình Thiên',
    role: 'Chuyên gia Kinh tế Cao cấp',
    organization: 'Hội đồng Tư vấn Chính sách Quốc gia',
    specialties: ['Kinh tế Vĩ mô', 'Tái cơ cấu Doanh nghiệp', 'Chiến lược Hội nhập'],
    bio: 'Chuyên gia hàng đầu về kinh tế vĩ mô và thể chế kinh tế thị trường Việt Nam.',
    avatarPlaceholder: '[Ảnh chân dung: Mentor PGS. TS. Trần Đình Thiên]'
  },
  {
    id: 'mentor-03',
    name: 'TS. Nguyễn Thanh Tùng',
    role: 'Viện trưởng Viện Quản trị LGM',
    organization: 'Học viện Quản trị LGM & PTIT',
    specialties: ['Quản trị Công ty', 'M&A', 'Tổ chức Nhân sự Cấp cao'],
    bio: 'Hơn 20 năm kinh nghiệm tư vấn và trực tiếp điều hành các tập đoàn công nghiệp tư nhân.',
    avatarPlaceholder: '[Ảnh chân dung: Mentor TS. Nguyễn Thanh Tùng]'
  },
  {
    id: 'mentor-04',
    name: 'TS. Lê Xuân Nghĩa',
    role: 'Chuyên gia Tài chính Doanh nghiệp',
    organization: 'Viện Nghiên cứu Phát triển Kinh doanh',
    specialties: ['Tài chính Tiền tệ', 'Kiểm soát Rủi ro', 'Đầu tư & Ngân hàng'],
    bio: 'Chuyên gia tư vấn tài chính cấp cao cho các định chế tài chính và ngân hàng thương mại.',
    avatarPlaceholder: '[Ảnh chân dung: Mentor TS. Lê Xuân Nghĩa]'
  }
];

export const MOCK_LOGGED_USER: UserProfile = {
  id: 'usr-0089',
  fullName: 'Phạm Minh Đức',
  email: 'duc.pham@vinasteel.com.vn',
  phone: '0912 345 678',
  jobTitle: 'Tổng Giám Đốc (CEO)',
  companyName: 'Công ty Cổ phần Thép VinaSteel',
  industry: 'Sản xuất & Công nghiệp chế tạo',
  companySize: 'Từ 100 - 300 nhân sự',
  membershipStatus: 'approved',
  memberId: 'VCF-VIP-2026-089',
  joinedDate: '15/01/2026',
  interestedActivities: ['ceo-summit', 'ceo-forum', 'ceo-peer-group', 'ceo-talk'],
  isProfileComplete: true,
  leadSource: 'Giới thiệu từ Hội viên VCF',
  businessPainPoints: 'Tối ưu hoá chi phí chuỗi cung ứng và chuyển đổi số quy trình quản lý chất lượng.',
  questionForMentor: 'Làm thế nào để duy trì động lực đổi mới sáng tạo trong doanh nghiệp sản xuất truyền thống?'
};

export const MOCK_REGISTRATIONS: RegistrationHistoryItem[] = [
  {
    id: 'reg-01',
    eventId: 'event-summit-2025',
    eventTitle: 'CEO Summit 2025: Nâng cao Năng lực Cạnh tranh Quốc tế',
    activityName: 'CEO Summit',
    datetime: '08:00 - 17:30, Thứ Năm, 16/10/2025',
    location: 'Trung tâm Hội nghị Quốc gia, Hà Nội',
    registeredDate: '10/08/2025',
    status: 'attended',
    qrCodePlaceholder: '[QR Code: VCF-TICKET-SUMMIT-2025-089]',
    passType: 'member',
    details: {
      name: 'Phạm Minh Đức',
      email: 'duc.pham@vinasteel.com.vn',
      phone: '0912 345 678',
      jobTitle: 'Tổng Giám Đốc (CEO)',
      companyName: 'Công ty Cổ phần Thép VinaSteel',
      industry: 'Sản xuất & Công nghiệp chế tạo',
      companySize: 'Từ 100 - 300 nhân sự',
      interestedActivities: ['ceo-summit', 'ceo-forum', 'ceo-talk'],
      leadSource: 'Giới thiệu từ Hội viên VCF',
      businessPainPoints: 'Tối ưu hoá chi phí chuỗi cung ứng và chuyển đổi số quy trình quản lý chất lượng.',
      questionForMentor: 'Làm thế nào để duy trì động lực đổi mới sáng tạo trong doanh nghiệp sản xuất truyền thống?'
    }
  },
  {
    id: 'reg-02',
    eventId: 'event-talk-ep14',
    eventTitle: 'CEO Talk #14: Quyết định Khó khăn Nhất — Bài học từ Khủng hoảng Vận hành',
    activityName: 'CEO Talk',
    datetime: '19:30 - 21:00, Thứ Ba, 29/09/2026',
    location: 'Studio PTIT & Trực tuyến Zoom',
    registeredDate: '05/08/2026',
    status: 'confirmed',
    qrCodePlaceholder: '[QR Code: VCF-TICKET-TALK14-089]',
    passType: 'member',
    details: {
      name: 'Phạm Minh Đức',
      email: 'duc.pham@vinasteel.com.vn',
      phone: '0912 345 678',
      jobTitle: 'Tổng Giám Đốc (CEO)',
      companyName: 'Công ty Cổ phần Thép VinaSteel',
      industry: 'Sản xuất & Công nghiệp chế tạo',
      companySize: 'Từ 100 - 300 nhân sự',
      interestedActivities: ['ceo-talk'],
      leadSource: 'Giới thiệu từ Hội viên VCF',
      businessPainPoints: 'Quản trị khủng hoảng vận hành trong chuỗi cung ứng',
      questionForMentor: 'Kinh nghiệm tái cấu trúc bộ máy khi thị trường suy giảm đột ngột?'
    }
  },
  {
    id: 'reg-wait-01',
    eventId: 'event-peer-hanoi',
    eventTitle: 'CEO Peer Group Hà Nội: Phiên Thảo luận Bàn tròn Tái cấu trúc Vốn & Dòng tiền',
    activityName: 'CEO Peer Group',
    datetime: '14:00 - 17:00, Thứ Tư, 07/10/2026',
    location: 'Phòng Hội đồng LGM, Hà Nội',
    registeredDate: '15/08/2026',
    status: 'waitlisted',
    qrCodePlaceholder: '[Mã danh sách chờ: VCF-WAITLIST-PEER-042]',
    passType: 'member'
  },
  {
    id: 'reg-03',
    eventId: 'event-forum-supplychain',
    eventTitle: 'CEO Forum Quý II: Tối ưu Hóa Chi phí Logistics & Vận tải Đa phương thức',
    activityName: 'CEO Forum',
    datetime: '13:30 - 17:00, Thứ Sáu, 22/05/2026',
    location: 'Khách sạn Daewoo Hanoi',
    registeredDate: '12/05/2026',
    status: 'attended',
    qrCodePlaceholder: '[QR Code: VCF-TICKET-FORUM-ATTENDED]',
    passType: 'member'
  }
];

