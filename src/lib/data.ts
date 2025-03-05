
export interface Option {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  options: Option[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  tags: string[];
  attributes: Record<string, string>;
}

export const questions: Question[] = [
  {
    id: "category",
    title: "Hangi ürün kategorisi ile ilgileniyorsunuz?",
    description: "Sizin için en uygun ürünleri bulmamıza yardımcı olun.",
    options: [
      {
        id: "electronics",
        text: "Elektronik",
        imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&h=350&q=80"
      },
      {
        id: "clothing",
        text: "Giyim",
        imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&h=350&q=80"
      },
      {
        id: "home",
        text: "Ev & Yaşam",
        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=350&q=80"
      },
      {
        id: "sports",
        text: "Spor & Outdoor",
        imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=350&q=80"
      }
    ]
  },
  {
    id: "price",
    title: "Fiyat aralığınız nedir?",
    description: "Bütçenize uygun ürünleri göstermeye çalışacağız.",
    options: [
      {
        id: "budget",
        text: "Ekonomik"
      },
      {
        id: "mid",
        text: "Orta Seviye"
      },
      {
        id: "premium",
        text: "Premium"
      },
      {
        id: "any",
        text: "Fark Etmez"
      }
    ]
  },
  {
    id: "purpose",
    title: "Ürünü ne amaçla kullanacaksınız?",
    description: "İhtiyacınıza en uygun ürünleri önerebilmemiz için bize biraz bilgi verin.",
    options: [
      {
        id: "personal",
        text: "Kişisel Kullanım"
      },
      {
        id: "gift",
        text: "Hediye"
      },
      {
        id: "professional",
        text: "Profesyonel Kullanım"
      },
      {
        id: "other",
        text: "Diğer"
      }
    ]
  }
];

export const sampleProducts: Product[] = [
  {
    id: "p1",
    name: "Premium Akıllı Telefon",
    price: 12999,
    description: "En son teknolojiyle donatılmış, muhteşem kamera sistemi ve güçlü işlemciye sahip akıllı telefon.",
    imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&h=500&q=80",
    tags: ["electronics", "premium", "personal", "professional"],
    attributes: {
      color: "Siyah",
      memory: "128GB",
      brand: "TechX"
    }
  },
  {
    id: "p2",
    name: "Kablosuz Kulaklık",
    price: 2499,
    description: "Aktif gürültü önleme özelliği ve uzun pil ömrü ile premium ses deneyimi.",
    imageUrl: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&h=500&q=80",
    tags: ["electronics", "mid", "personal", "gift"],
    attributes: {
      color: "Beyaz",
      brand: "SoundMax",
      batteryLife: "24 saat"
    }
  },
  {
    id: "p3",
    name: "Casual Sweatshirt",
    price: 599,
    description: "Yumuşak kumaşı ve rahat kesimi ile günlük kullanım için ideal.",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&q=80",
    tags: ["clothing", "budget", "personal"],
    attributes: {
      color: "Gri",
      size: "M, L, XL",
      material: "Pamuk"
    }
  },
  {
    id: "p4",
    name: "Spor Ayakkabı",
    price: 1299,
    description: "Hafif ve esnek yapısı ile koşu ve fitness aktiviteleri için tasarlandı.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&q=80",
    tags: ["clothing", "sports", "mid", "personal"],
    attributes: {
      color: "Kırmızı/Siyah",
      size: "40-45",
      type: "Koşu"
    }
  },
  {
    id: "p5",
    name: "Akıllı Saat",
    price: 3499,
    description: "Fitness takibi, bildirimler ve şık tasarım ile hayatınızı kolaylaştırın.",
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&q=80",
    tags: ["electronics", "sports", "premium", "gift", "personal"],
    attributes: {
      color: "Siyah",
      brand: "FitTech",
      batteryLife: "7 gün"
    }
  },
  {
    id: "p6",
    name: "Otomatik Kahve Makinesi",
    price: 7999,
    description: "Profesyonel kalitede espresso ve cappuccino hazırlayın.",
    imageUrl: "https://images.unsplash.com/photo-1525088068744-d08ac486c3d9?w=500&h=500&q=80",
    tags: ["home", "premium", "professional", "gift"],
    attributes: {
      color: "Gümüş",
      brand: "BrewMaster",
      capacity: "1.5L"
    }
  },
  {
    id: "p7",
    name: "Akıllı Ev Sistemi",
    price: 1799,
    description: "Işıklar, termostat ve güvenlik kameraları için kontrol merkezi.",
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055e2ff3d9c?w=500&h=500&q=80",
    tags: ["home", "electronics", "mid", "professional", "personal"],
    attributes: {
      color: "Beyaz",
      brand: "SmartLife",
      compatibility: "Alexa, Google Home"
    }
  },
  {
    id: "p8",
    name: "Yoga Matı",
    price: 249,
    description: "Kaymaz yüzeyi ve taşıma kayışı ile yoga ve pilates için ideal.",
    imageUrl: "https://images.unsplash.com/photo-1592432678012-d419a4213bce?w=500&h=500&q=80",
    tags: ["sports", "budget", "personal"],
    attributes: {
      color: "Mavi",
      thickness: "6mm",
      material: "TPE"
    }
  }
];

export const filterProducts = (selections: Record<string, string>): Product[] => {
  return sampleProducts.filter(product => {
    for (const [questionId, optionId] of Object.entries(selections)) {
      if (optionId === "any") continue;
      
      if (!product.tags.includes(optionId)) {
        return false;
      }
    }
    return true;
  });
};
