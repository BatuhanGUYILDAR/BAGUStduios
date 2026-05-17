import { createContext, useContext } from 'react';
import type { Product } from '../types/Product';

export type Language = 'en' | 'tr';

type NavKey = 'home' | 'about' | 'projects' | 'education' | 'contact';
type FooterLinkKey = 'projects' | 'education' | 'contact';
type ProductCopy = Pick<Product, 'title' | 'shortDescription' | 'longDescription' | 'category' | 'tags'>;

export type AppCopy = {
  nav: {
    ariaLabel: string;
    toggleLabel: string;
    languageLabel: string;
    languageOptions: Record<Language, string>;
    links: Record<NavKey, string>;
  };
  common: {
    details: string;
    marketplace: string;
    previewAlt: string;
  };
  footer: {
    tagline: string;
    links: Record<FooterLinkKey, string>;
  };
  home: {
    brand: string;
    title: string;
    role: string;
    intro: string;
    viewProjects: string;
    contactMe: string;
    modules: Array<{ label: string; description: string }>;
    marketplacePipelineTitle: string;
    marketplacePipelineBody: string;
    featuredKicker: string;
    featuredTitle: string;
    viewAllProjects: string;
    coreSkillsKicker: string;
    coreSkillsTitle: string;
    skills: string[];
  };
  about: {
    kicker: string;
    title: string;
    intro: string;
    firstBody: string;
    secondBody: string;
    skillsTitle: string;
    skills: string[];
  };
  projects: {
    kicker: string;
    title: string;
    intro: string;
  };
  projectDetail: {
    loading: string;
    notFound: string;
    backToProjects: string;
    kicker: string;
    videoKicker: string;
    openMarketplace: string;
  };
  education: {
    kicker: string;
    title: string;
    label: string;
    school: string;
    department: string;
    body: string;
    focusAreas: string[];
  };
  contact: {
    kicker: string;
    title: string;
    intro: string;
    cards: Array<{ label: string; value: string; href: string }>;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendMessage: string;
    sending: string;
    success: string;
    error: string;
    emailSubject: string;
  };
  products: Record<string, ProductCopy>;
};

export const translations: Record<Language, AppCopy> = {
  en: {
    nav: {
      ariaLabel: 'Main navigation',
      toggleLabel: 'Toggle navigation menu',
      languageLabel: 'Language',
      languageOptions: {
        en: 'English',
        tr: 'Turkish',
      },
      links: {
        home: 'Home',
        about: 'About',
        projects: 'Projects',
        education: 'Education',
        contact: 'Contact',
      },
    },
    common: {
      details: 'Details',
      marketplace: 'Marketplace',
      previewAlt: 'preview',
    },
    footer: {
      tagline: 'Unreal Engine Blueprint systems and gameplay tools.',
      links: {
        projects: 'Projects',
        education: 'Education',
        contact: 'Contact',
      },
    },
    home: {
      brand: 'BAGU Studio',
      title: 'Batuhan Güyıldar',
      role: 'Game Developer & Unreal Engine Blueprint Developer',
      intro: 'I create gameplay systems, interactive mechanics, and marketplace-ready Unreal Engine Blueprint assets.',
      viewProjects: 'View Projects',
      contactMe: 'Contact Me',
      modules: [
        { label: 'Ability State', description: 'Blueprint-ready gameplay module' },
        { label: 'Cooldown', description: 'Blueprint-ready gameplay module' },
        { label: 'Possession', description: 'Blueprint-ready gameplay module' },
        { label: 'Interaction', description: 'Blueprint-ready gameplay module' },
      ],
      marketplacePipelineTitle: 'UE5 Marketplace Pipeline',
      marketplacePipelineBody: 'Reusable systems, clean setup, and designer-facing controls.',
      featuredKicker: 'Featured Work',
      featuredTitle: 'Marketplace-ready systems',
      viewAllProjects: 'View all projects',
      coreSkillsKicker: 'Core Skills',
      coreSkillsTitle: 'Built around gameplay feel and clean Blueprint logic',
      skills: ['Unreal Engine 5', 'Blueprint Systems', 'Gameplay Mechanics', 'Marketplace Assets'],
    },
    about: {
      kicker: 'About',
      title: 'Game systems with designer-friendly structure',
      intro:
        'I am Batuhan Güyıldar, a game developer focused on Unreal Engine 5 and Blueprint-driven gameplay systems. Through BAGU Studio, I build interactive mechanics, ability systems, UI flows, and marketplace assets that are easy to understand, extend, and use in production.',
      firstBody:
        'My work centers on turning gameplay ideas into practical systems: ghost mode abilities, possession mechanics, player interaction flows, level-ready logic, and reusable Blueprint assets. I care about clear variables, readable graphs, controlled state changes, and features that feel good during playtesting.',
      secondBody:
        'I combine game design thinking with technical Blueprint implementation, making tools that serve both players and developers. The goal is always the same: strong mechanics, clean structure, and assets that can be adapted quickly inside real Unreal Engine projects.',
      skillsTitle: 'Skills',
      skills: [
        'Unreal Engine 5',
        'Blueprint',
        'Game Design',
        'Level Design',
        'UI Systems',
        'Gameplay Programming',
        'Marketplace Asset Development',
      ],
    },
    projects: {
      kicker: 'Projects',
      title: 'Blueprint products and gameplay systems',
      intro:
        'A dynamic project list powered through a service layer. Today it uses local product data; later it can read from a marketplace API or your own backend.',
    },
    projectDetail: {
      loading: 'Loading project...',
      notFound: 'Project not found',
      backToProjects: 'Back to projects',
      kicker: 'Project Detail',
      videoKicker: 'Demo Video',
      openMarketplace: 'Open Marketplace',
    },
    education: {
      kicker: 'Education',
      title: 'Academic foundation in game development',
      label: 'University',
      school: 'Eastern Mediterranean University',
      department: 'Department: Digital Game Design / Game Development related studies',
      body:
        'Focused on the creative and technical foundations of game development, including gameplay design, programming logic, Unreal Engine workflows, and interactive system design.',
      focusAreas: ['Game Design', 'Programming', 'Unreal Engine', 'Interactive Systems'],
    },
    contact: {
      kicker: 'Contact',
      title: 'Let’s build a gameplay system',
      intro:
        'Reach out for Unreal Engine Blueprint systems, marketplace products, collaboration, or game development opportunities.',
      cards: [
        {
          label: 'Email',
          value: '38batuhan56@gmail.com',
          href: 'mailto:38batuhan56@gmail.com',
        },
        {
          label: 'LinkedIn',
          value: 'linkedin.com/in/batuhan-güyildar-5bb444394',
          href: 'https://www.linkedin.com/in/batuhan-güyildar-5bb444394/',
        },
        {
          label: 'Marketplace',
          value: 'fab.com/sellers/BAGU Studio',
          href: 'https://www.fab.com/sellers/BAGU%20Studio',
        },
      ],
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      messageLabel: 'Message',
      messagePlaceholder: 'Tell me about your project',
      sendMessage: 'Send Message',
      sending: 'Sending...',
      success: 'Thank you. Your message was sent successfully.',
      error: 'The message could not be sent right now. Please try again or email me directly.',
      emailSubject: 'New message from BAGU Studio website',
    },
    products: {
      'ghost-vision-system': {
        title: 'Ghost Vision System',
        shortDescription: 'A Blueprint-based ghost mode ability system for Unreal Engine 5.',
        longDescription:
          'A Blueprint-based ghost mode ability system for Unreal Engine 5. The player can leave the body, move freely for a short time, and return with cooldown-based gameplay. Built for single-player games that need a polished supernatural exploration mechanic with readable state handling and designer-friendly tuning.',
        category: 'Unreal Engine Blueprint System',
        tags: ['Unreal Engine', 'Blueprint', 'Ghost Mode', 'Ability System', 'Single Player'],
      },
      'soul-shift-possession-system': {
        title: 'Soul Shift - Possession System',
        shortDescription: 'A Blueprint-based possession system for Unreal Engine 5.',
        longDescription:
          'A Blueprint-based possession system for Unreal Engine 5. The player can enter soul mode, target possessable actors, and take control of different characters, pawns, or actors. Designed for interaction-heavy gameplay, puzzle systems, and character-switching mechanics.',
        category: 'Unreal Engine Blueprint System',
        tags: ['Unreal Engine', 'Blueprint', 'Possession', 'Gameplay System', 'Interaction'],
      },
    },
  },
  tr: {
    nav: {
      ariaLabel: 'Ana navigasyon',
      toggleLabel: 'Navigasyon menüsünü aç veya kapat',
      languageLabel: 'Dil',
      languageOptions: {
        en: 'İngilizce',
        tr: 'Türkçe',
      },
      links: {
        home: 'Ana Sayfa',
        about: 'Hakkımda',
        projects: 'Projeler',
        education: 'Eğitim',
        contact: 'İletişim',
      },
    },
    common: {
      details: 'Detaylar',
      marketplace: 'Marketplace',
      previewAlt: 'ön izlemesi',
    },
    footer: {
      tagline: 'Unreal Engine Blueprint sistemleri ve oynanış araçları.',
      links: {
        projects: 'Projeler',
        education: 'Eğitim',
        contact: 'İletişim',
      },
    },
    home: {
      brand: 'BAGU Studio',
      title: 'Batuhan Güyıldar',
      role: 'Game Developer & Unreal Engine Blueprint Developer',
      intro: 'Oynanış sistemleri, interaktif mekanikler ve marketplace hazır Unreal Engine Blueprint varlıkları oluşturuyorum.',
      viewProjects: 'Projeleri Gör',
      contactMe: 'İletişime Geç',
      modules: [
        { label: 'Yetenek Durumu', description: 'Blueprint hazır oynanış modülü' },
        { label: 'Bekleme Süresi', description: 'Blueprint hazır oynanış modülü' },
        { label: 'Kontrol Ele Geçirme', description: 'Blueprint hazır oynanış modülü' },
        { label: 'Etkileşim', description: 'Blueprint hazır oynanış modülü' },
      ],
      marketplacePipelineTitle: 'UE5 Marketplace Pipeline',
      marketplacePipelineBody: 'Yeniden kullanılabilir sistemler, temiz kurulum ve tasarımcıya dönük kontroller.',
      featuredKicker: 'Öne Çıkan İşler',
      featuredTitle: 'Marketplace hazır sistemler',
      viewAllProjects: 'Tüm projeleri gör',
      coreSkillsKicker: 'Temel Yetenekler',
      coreSkillsTitle: 'Oynanış hissi ve temiz Blueprint mantığı etrafında kuruldu',
      skills: ['Unreal Engine 5', 'Blueprint Sistemleri', 'Oynanış Mekanikleri', 'Marketplace Varlıkları'],
    },
    about: {
      kicker: 'Hakkımda',
      title: 'Tasarımcı dostu yapıya sahip oyun sistemleri',
      intro:
        'Ben Batuhan Güyıldar; Unreal Engine 5 ve Blueprint odaklı oynanış sistemlerine yoğunlaşan bir oyun geliştiricisiyim. BAGU Studio ile interaktif mekanikler, yetenek sistemleri, UI akışları ve anlaşılması, genişletilmesi, üretimde kullanılması kolay marketplace varlıkları geliştiriyorum.',
      firstBody:
        'Çalışmalarım oynanış fikirlerini pratik sistemlere dönüştürmeye odaklanır: hayalet modu yetenekleri, kontrol ele geçirme mekanikleri, oyuncu etkileşim akışları, seviyeye hazır mantık ve yeniden kullanılabilir Blueprint varlıkları. Net değişkenlere, okunabilir graph yapılarına, kontrollü durum değişimlerine ve playtest sırasında iyi hissettiren özelliklere önem veriyorum.',
      secondBody:
        'Oyun tasarımı düşüncesini teknik Blueprint uygulamasıyla birleştirerek hem oyunculara hem geliştiricilere hizmet eden araçlar üretiyorum. Hedef her zaman aynı: güçlü mekanikler, temiz yapı ve gerçek Unreal Engine projelerinde hızlıca uyarlanabilen varlıklar.',
      skillsTitle: 'Yetenekler',
      skills: [
        'Unreal Engine 5',
        'Blueprint',
        'Oyun Tasarımı',
        'Seviye Tasarımı',
        'UI Sistemleri',
        'Oynanış Programlama',
        'Marketplace Varlık Geliştirme',
      ],
    },
    projects: {
      kicker: 'Projeler',
      title: 'Blueprint ürünleri ve oynanış sistemleri',
      intro:
        'Servis katmanı üzerinden çalışan dinamik bir proje listesi. Şu anda yerel ürün verisini kullanıyor; ileride marketplace API veya kendi backend sisteminizden veri okuyabilir.',
    },
    projectDetail: {
      loading: 'Proje yükleniyor...',
      notFound: 'Proje bulunamadı',
      backToProjects: 'Projelere dön',
      kicker: 'Proje Detayı',
      videoKicker: 'Demo Videosu',
      openMarketplace: 'Marketplace Aç',
    },
    education: {
      kicker: 'Eğitim',
      title: 'Oyun geliştirmede akademik temel',
      label: 'Üniversite',
      school: 'Doğu Akdeniz Üniversitesi',
      department: 'Bölüm: Dijital Oyun Tasarımı / Oyun geliştirme odaklı çalışmalar',
      body:
        'Oynanış tasarımı, programlama mantığı, Unreal Engine iş akışları ve interaktif sistem tasarımı dahil olmak üzere oyun geliştirmenin yaratıcı ve teknik temellerine odaklandı.',
      focusAreas: ['Oyun Tasarımı', 'Programlama', 'Unreal Engine', 'Interaktif Sistemler'],
    },
    contact: {
      kicker: 'İletişim',
      title: 'Bir oynanış sistemi geliştirelim',
      intro:
        'Unreal Engine Blueprint sistemleri, marketplace ürünleri, iş birliği veya oyun geliştirme fırsatları için iletişime geçin.',
      cards: [
        {
          label: 'E-posta',
          value: '38batuhan56@gmail.com',
          href: 'mailto:38batuhan56@gmail.com',
        },
        {
          label: 'LinkedIn',
          value: 'linkedin.com/in/batuhan-güyildar-5bb444394',
          href: 'https://www.linkedin.com/in/batuhan-güyildar-5bb444394/',
        },
        {
          label: 'Marketplace',
          value: 'fab.com/sellers/BAGU Studio',
          href: 'https://www.fab.com/sellers/BAGU%20Studio',
        },
      ],
      nameLabel: 'İsim',
      namePlaceholder: 'Adınız',
      emailLabel: 'E-posta',
      emailPlaceholder: 'siz@example.com',
      messageLabel: 'Mesaj',
      messagePlaceholder: 'Projenizden bahsedin',
      sendMessage: 'Mesaj Gönder',
      sending: 'Gönderiliyor...',
      success: 'Teşekkürler. Mesajınız başarıyla gönderildi.',
      error: 'Mesaj şu anda gönderilemedi. Lütfen tekrar deneyin veya doğrudan e-posta gönderin.',
      emailSubject: 'BAGU Studio web sitesinden yeni mesaj',
    },
    products: {
      'ghost-vision-system': {
        title: 'Ghost Vision System',
        shortDescription: 'Unreal Engine 5 için Blueprint tabanlı hayalet modu yetenek sistemi.',
        longDescription:
          'Unreal Engine 5 için Blueprint tabanlı bir hayalet modu yetenek sistemi. Oyuncu bedenden ayrılabilir, kısa süre özgürce hareket edebilir ve bekleme süresine dayalı oynanışla geri dönebilir. Okunabilir durum yönetimi ve tasarımcı dostu ayarlarla cilalı bir doğaüstü keşif mekaniğine ihtiyaç duyan tek oyunculu oyunlar için geliştirildi.',
        category: 'Unreal Engine Blueprint Sistemi',
        tags: ['Unreal Engine', 'Blueprint', 'Hayalet Modu', 'Yetenek Sistemi', 'Tek Oyunculu'],
      },
      'soul-shift-possession-system': {
        title: 'Soul Shift - Possession System',
        shortDescription: 'Unreal Engine 5 için Blueprint tabanlı kontrol ele geçirme sistemi.',
        longDescription:
          'Unreal Engine 5 için Blueprint tabanlı bir kontrol ele geçirme sistemi. Oyuncu ruh moduna geçebilir, ele geçirilebilir aktörleri hedefleyebilir ve farklı karakterlerin, pawnların veya aktörlerin kontrolünü alabilir. Etkileşim ağırlıklı oynanış, bulmaca sistemleri ve karakter değiştirme mekanikleri için tasarlandı.',
        category: 'Unreal Engine Blueprint Sistemi',
        tags: ['Unreal Engine', 'Blueprint', 'Kontrol Ele Geçirme', 'Oynanış Sistemi', 'Etkileşim'],
      },
    },
  },
};

export type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: AppCopy;
};

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}

export function localizeProduct(product: Product, productCopies: Record<string, ProductCopy>): Product {
  const localizedProduct = productCopies[product.id];
  return localizedProduct ? { ...product, ...localizedProduct } : product;
}
