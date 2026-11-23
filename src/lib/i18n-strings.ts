export type Lang = "vi" | "en";

/** Chọn nội dung theo ngôn ngữ; nếu bản tiếng Anh để trống thì dùng bản tiếng Việt. */
export const pick = (lang: Lang, vi?: string | null, en?: string | null) => (lang === "en" && en?.trim() ? en : vi ?? "");

export const T = {
  vi: {
    siteTitle: "Portfolio", home: "Trang chủ", about: "Giới thiệu", software: "Phần mềm", games: "Game", gallery: "Thư viện", contact: "Liên hệ",
    dark: "Tối", light: "Sáng", back: "Quay lại", viewSoftware: "Xem phần mềm", viewGames: "Xem game", downloadCv: "Tải CV",
    noSoftware: "Phần mềm đang được cập nhật.", noGames: "Game đang được cập nhật.", workWithMe: "Làm việc cùng mình", sendMessage: "Gửi tin nhắn",
    experience: "Kinh nghiệm", certificates: "Chứng chỉ", skills: "Kỹ năng", present: "nay",
    draftNote: "Bản nháp: chỉ bạn nhìn thấy trang này.", demo: "Mở demo", play: "Chơi thử", source: "Mã nguồn",
    noIntro: "Chưa có phần giới thiệu.", contactLead: "Cho mình biết bạn cần gì. Mình sẽ trả lời qua email.",
    name: "Họ tên", email: "Email", message: "Tin nhắn", send: "Gửi tin nhắn", sent: "Đã gửi tin nhắn. Cảm ơn bạn.",
    errInvalid: "Vui lòng nhập tên, email hợp lệ và tin nhắn từ 10 ký tự.", errServer: "Chưa gửi được tin nhắn. Vui lòng thử lại sau hoặc gửi email trực tiếp.",
    all: "Tất cả", galleryEmpty: "Chưa có hình ảnh hoặc video nào.", galleryError: "Không tải được thư viện. Vui lòng thử lại sau.",
    nothingWith: (n: string) => `Chưa có dự án hoặc game nào dùng ${n}.`,
    headline: "Lập trình viên full-stack & game", intro: "Mình xây dựng web, phần mềm và game.",
    docLabel: "Hồ sơ năng lực", hello: "Xin chào.", educationIntro: "Kinh nghiệm làm việc và chứng chỉ.", cvNote: "hồ sơ của mình",
    toolNote: "rê chuột vào từng công nghệ", skillsIntro: "Thiết kế và xây dựng phần mềm, web và game, từ database đến giao diện.",
    projectsNote: "Các sản phẩm mình đã làm", thanks: "Cảm ơn bạn",
    letter: "Cảm ơn bạn đã xem hồ sơ của mình.\n\nNếu bạn có dự án phần mềm, web hay game cần người cùng làm, mình rất muốn nghe ý tưởng của bạn.",
    software1: "Phần mềm", game1: "Game", webapp: "web / app", location: "Việt Nam", openLabel: "Mở",
    labels: { scroll: "cuộn xuống", education: "Kinh nghiệm", scanMe: "quét mã", openCv: "Mở CV: ", languages: "Ngôn ngữ", skills: "Kỹ năng", toolkit: "và còn nhiều công nghệ khác",
      projects: "Sản phẩm.", challenge: "thử thách:", seeCase: "xem chi tiết sản phẩm", facts: "Điều thú vị", copy: "Sao chép ", copied: "đã chép!", close: "đóng ×", contents: "Mục lục",
      sections: { cover: "bìa", hello: "giới thiệu", education: "kinh nghiệm", skills: "kỹ năng", projects: "sản phẩm", cases: "chi tiết", facts: "thú vị", thanks: "cảm ơn" } },
  },
  en: {
    siteTitle: "Portfolio", home: "Home", about: "About", software: "Software", games: "Games", gallery: "Gallery", contact: "Contact",
    dark: "Dark", light: "Light", back: "Back", viewSoftware: "View software", viewGames: "View games", downloadCv: "Download CV",
    noSoftware: "Software is being updated.", noGames: "Games are being updated.", workWithMe: "Work with me", sendMessage: "Send a message",
    experience: "Experience", certificates: "Certificates", skills: "Skills", present: "present",
    draftNote: "Draft: only you can see this page.", demo: "Open demo", play: "Play", source: "Source code",
    noIntro: "No introduction yet.", contactLead: "Tell me what you need. I will reply by email.",
    name: "Full name", email: "Email", message: "Message", send: "Send message", sent: "Message sent. Thank you.",
    errInvalid: "Please enter your name, a valid email and a message of at least 10 characters.", errServer: "The message could not be sent. Please try again later or email me directly.",
    all: "All", galleryEmpty: "No images or videos yet.", galleryError: "Could not load the gallery. Please try again later.",
    nothingWith: (n: string) => `No projects or games use ${n} yet.`,
    headline: "Full-stack & game developer", intro: "I build websites, software and games.",
    docLabel: "Portfolio", hello: "Hello.", educationIntro: "Work experience and certificates.", cvNote: "my CV",
    toolNote: "hover over each technology", skillsIntro: "I design and build software, websites and games, from the database to the interface.",
    projectsNote: "Things I have built", thanks: "Thank you",
    letter: "Thank you for looking at my portfolio.\n\nIf you have a software, web or game project that needs another pair of hands, I would love to hear your idea.",
    software1: "Software", game1: "Game", webapp: "web / app", location: "Vietnam", openLabel: "Open",
    labels: { scroll: "scroll", education: "Experience", scanMe: "scan me", openCv: "Open my CV: ", languages: "Languages", skills: "Skills", toolkit: "there's plenty more in my toolkit",
      projects: "Projects.", challenge: "my challenge:", seeCase: "see the full case study", facts: "Fun Facts", copy: "Copy ", copied: "copied!", close: "close ×", contents: "Contents",
      sections: { cover: "cover", hello: "hello", education: "experience", skills: "skills", projects: "projects", cases: "case studies", facts: "fun facts", thanks: "thank you" } },
  },
} as const;
