import { useState, useEffect, useRef } from "react";

const CONFETTI_COLORS = ["#F59E0B", "#F43F5E", "#7C3AED", "#06B6D4", "#84CC16", "#EC4899", "#FF6B35"];

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  shape: "circle" | "rect" | "star";
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  emoji: string;
  category: string;
  selected: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 10, name: "С жареным баклажаном", description: "Баклажан, томаты, руккола, брокколи, киноа", emoji: "🥗", category: "Салаты", selected: false },
  { id: 11, name: "С индейкой, руколой и томатами", description: "Нежная индейка, свежая руккола, черри, заправка", emoji: "🥙", category: "Салаты", selected: false },
  { id: 12, name: "Салат с языком", description: "Говяжий язык, авокадо, каперсы, зелень, лайм", emoji: "🫛", category: "Салаты", selected: false },
  { id: 13, name: "Греческий", description: "Томаты, огурцы, перец, маслины, фета, каперсы", emoji: "🫒", category: "Салаты", selected: false },
  { id: 33, name: "С тунцом", description: "Зелень, картофель, яйцо и соус тоннато", emoji: "🐟", category: "Салаты", selected: false },
  { id: 14, name: "С копчёным цыплёнком и персиком", description: "Копчёный цыплёнок, персик, романо, томаты, пармезан", emoji: "🍑", category: "Салаты", selected: false },

  { id: 4, name: "Говяжья вырезка", description: "Медальоны с соусом из красного вина", emoji: "🥩", category: "Горячее", selected: false },
  { id: 5, name: "Запечённый лосось", description: "С лимонно-укропным соусом и овощами гриль", emoji: "🐠", category: "Горячее", selected: false },
  { id: 6, name: "Ризотто с грибами", description: "Белые грибы, пармезан, трюфельное масло", emoji: "🍄", category: "Горячее", selected: false },
  { id: 15, name: "Котлеты из курицы", description: "Куриные котлеты с картофельным пюре", emoji: "🍗", category: "Горячее", selected: false },
  { id: 16, name: "Котлета из трески", description: "Нежная рыбная котлета с соусом", emoji: "🐟", category: "Горячее", selected: false },
  { id: 17, name: "Строганов из 3-х видов мяса", description: "Говядина и телятина в натуральном бульоне", emoji: "🫕", category: "Горячее", selected: false },
  { id: 18, name: "Куриный шницель", description: "Хрустящий шницель с картофелем фри", emoji: "🍳", category: "Горячее", selected: false },
  { id: 19, name: "Бургер Цезарь", description: "Куриная котлета, романо, черри, соус цезарь", emoji: "🍔", category: "Горячее", selected: false },
  { id: 20, name: "Помодоро", description: "Паста в томатном соусе", emoji: "🍝", category: "Горячее", selected: false },
  { id: 21, name: "Болоньезе", description: "Фарш мясо и томатный соус", emoji: "🍝", category: "Горячее", selected: false },
  { id: 22, name: "Карбонара", description: "Бекон в сливочно-сырном соусе", emoji: "🥓", category: "Горячее", selected: false },
  { id: 23, name: "Фетучини", description: "Широкая паста в сливочном соусе", emoji: "🍜", category: "Горячее", selected: false },
  { id: 24, name: "Ригатони с говядиной", description: "Ригатони с говядиной и томатным соусом", emoji: "🍝", category: "Горячее", selected: false },
  { id: 25, name: "Спагетти с митболами", description: "Мясные шарики в томатном соусе", emoji: "🧆", category: "Горячее", selected: false },
  { id: 26, name: "Качо-э-пэппе", description: "Паста с сыром и чёрным перцем", emoji: "🧀", category: "Горячее", selected: false },
  { id: 27, name: "Фузилли Бифрагу", description: "Фузилли в сливочном соусе", emoji: "🍝", category: "Горячее", selected: false },
  { id: 28, name: "С говядиной в перечном соусе", description: "Паста с говядиной и перечным соусом", emoji: "🌶", category: "Горячее", selected: false },
  { id: 29, name: "Казаречче с креветками фарфалле", description: "Паста с креветками и фарфалле", emoji: "🦐", category: "Горячее", selected: false },
  { id: 30, name: "Фрутти ди маре", description: "Паста с морепродуктами", emoji: "🦑", category: "Горячее", selected: false },
  { id: 31, name: "Казаречче с томлёными щёчками", description: "Паста с томлёными говяжьими щёчками", emoji: "🥩", category: "Горячее", selected: false },
  { id: 32, name: "Брачиолле с копчёным цыплёнком", description: "Паста с копчёным цыплёнком, соус из трав", emoji: "🍗", category: "Горячее", selected: false },
  { id: 7, name: "Торт «Три шоколада»", description: "Мусс из трёх видов шоколада на брауни", emoji: "🎂", category: "Десерты", selected: false },
  { id: 8, name: "Клубничный тарт", description: "Свежая клубника, крем патисьер, хрустящее тесто", emoji: "🍓", category: "Десерты", selected: false },
  { id: 9, name: "Фруктовый сорбет", description: "Манго, маракуйя, малина", emoji: "🍧", category: "Десерты", selected: false },
];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 10 + 6,
    duration: Math.random() * 4 + 4,
    delay: Math.random() * 6,
    shape: (["circle", "rect", "star"] as const)[Math.floor(Math.random() * 3)],
  }));
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [confetti] = useState(() => generateConfetti(60));
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const homeRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const scrollTo = (section: string) => {
    setActiveSection(section);
    const ref = { home: homeRef, menu: menuRef, info: infoRef }[section];
    ref?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section");
            if (id) setActiveSection(id);
          }
        });
      },
      { threshold: 0.4 }
    );
    [homeRef, menuRef, infoRef].forEach((ref) => ref.current && observer.observe(ref.current));
    return () => observer.disconnect();
  }, []);

  const toggleItem = (id: number) => {
    setMenuItems((prev) => prev.map((item) => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const selectedCount = menuItems.filter((i) => i.selected).length;
  const categories = [...new Set(MENU_ITEMS.map((i) => i.category))];

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen font-rubik bg-[#0D0520] overflow-x-hidden relative">

      {/* Confetti Layer */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute animate-confetti-fall"
            style={{
              left: `${piece.x}%`,
              animationDuration: `${piece.duration}s`,
              animationDelay: `${piece.delay}s`,
              top: "-20px",
            }}
          >
            {piece.shape === "circle" && (
              <div style={{ width: piece.size, height: piece.size, backgroundColor: piece.color, borderRadius: "50%" }} />
            )}
            {piece.shape === "rect" && (
              <div style={{ width: piece.size, height: piece.size * 0.6, backgroundColor: piece.color, transform: `rotate(${Math.random() * 45}deg)` }} />
            )}
            {piece.shape === "star" && (
              <div style={{ color: piece.color, fontSize: piece.size }}>★</div>
            )}
          </div>
        ))}
      </div>

      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
            <span className="font-pacifico text-xl text-amber-400">🎉 День рождения!</span>
            <div className="flex gap-2">
              {[
                { id: "home", label: "Главная", emoji: "🏠" },
                { id: "menu", label: "Меню", emoji: "🍽" },
                { id: "info", label: "Инфо", emoji: "📍" },
              ].map((nav) => (
                <button
                  key={nav.id}
                  onClick={() => scrollTo(nav.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeSection === nav.id
                      ? "bg-amber-400 text-purple-900 shadow-lg shadow-amber-400/30"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="hidden sm:inline">{nav.label}</span>
                  <span className="sm:hidden">{nav.emoji}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section ref={homeRef} data-section="home" className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative">
        <div className="text-center max-w-3xl mx-auto">
          {/* Balloons row */}
          <div className="flex justify-center gap-4 mb-8">
            {["🎈", "🎀", "🎈", "🎊", "🎈"].map((b, i) => (
              <span
                key={i}
                className="text-5xl"
                style={{
                  animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  display: "inline-block",
                }}
              >
                {b}
              </span>
            ))}
          </div>

          <div className="animate-pop-in" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <p className="text-amber-400/80 font-rubik font-semibold text-lg tracking-[0.3em] uppercase mb-3">
              ✦ Вы получили приглашение ✦
            </p>
          </div>

          <div className="animate-pop-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <h1
              className="font-pacifico text-6xl sm:text-8xl text-transparent bg-clip-text mb-6 leading-tight"
              style={{ backgroundImage: "linear-gradient(135deg, #F59E0B 0%, #EC4899 40%, #7C3AED 80%, #06B6D4 100%)" }}
            >
              Празднование моего дня рождения!
            </h1>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "0.5s", opacity: 0 }}>
            <p className="text-white/80 text-xl sm:text-2xl font-rubik font-light mb-2">
              Я рада пригласить тебя на мой особенный вечер
            </p>
            <p className="text-white text-2xl sm:text-3xl font-rubik font-bold mb-8">
              Жду тебя! 🥂
            </p>
          </div>

          {/* Date badge */}
          <div className="animate-fade-up" style={{ animationDelay: "0.7s", opacity: 0 }}>
            <div className="inline-flex items-center gap-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-8 py-5 mb-8 shadow-xl">
              <div className="text-center">
                <div className="text-amber-400 font-pacifico text-4xl">1</div>
                <div className="text-white/60 text-sm font-rubik uppercase tracking-wider">Мая</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-white font-rubik font-bold text-xl">2026</div>
                <div className="text-white/60 text-sm uppercase tracking-wider">Пятница</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-pink-400 font-rubik font-bold text-xl">17:00</div>
                <div className="text-white/60 text-sm uppercase tracking-wider">Начало</div>
              </div>
            </div>
          </div>

          {/* Hero photo */}
          <div className="animate-fade-up" style={{ animationDelay: "0.9s", opacity: 0 }}>
            <div className="relative mx-auto max-w-xs">
              {/* Age badge */}
              <div
                className="absolute -top-5 -right-5 z-20 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-[#0D0520] animate-pulse-glow"
                style={{ background: "linear-gradient(135deg, #F59E0B, #EC4899)" }}
              >
                <span className="font-pacifico text-3xl text-white leading-none">25</span>
                <span className="text-white/80 text-xs font-rubik font-semibold uppercase tracking-wider">лет</span>
              </div>

              {/* Decorative balloons */}
              <div className="absolute -left-8 top-1/3 text-4xl animate-float z-10">🎈</div>
              <div className="absolute -right-10 bottom-1/4 text-3xl animate-float-delayed z-10">🎀</div>

              {/* Photo frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/50"
                style={{ boxShadow: "0 0 40px rgba(245,158,11,0.3), 0 0 80px rgba(236,72,153,0.2)" }}>
                <img
                  src="https://cdn.poehali.dev/projects/1d1a0b93-104c-4a50-af9b-f79618539395/bucket/ce9e051c-71fc-4a5b-81b6-f984790ec4f6.jpg"
                  alt="Именинник"
                  className="w-full object-cover object-top"
                  style={{ maxHeight: "400px" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0520]/50 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-pacifico text-xl whitespace-nowrap drop-shadow-lg">
                  Ждём вас! 🎊
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "1.1s", opacity: 0 }}>
            <button
              onClick={() => scrollTo("menu")}
              className="px-8 py-4 rounded-2xl font-rubik font-bold text-lg text-purple-900 transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-400/30"
              style={{ background: "linear-gradient(135deg, #F59E0B, #F43F5E)" }}
            >
              Выбрать блюда 🍽
            </button>
            <button
              onClick={() => scrollTo("info")}
              className="px-8 py-4 rounded-2xl font-rubik font-bold text-lg text-white border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              Как добраться 📍
            </button>
          </div>
        </div>
      </section>

      {/* MENU SECTION */}
      <section ref={menuRef} data-section="menu" className="min-h-screen px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-400 font-rubik font-semibold text-sm tracking-[0.3em] uppercase mb-3">✦ Выберите блюда ✦</p>
            <h2 className="font-pacifico text-5xl sm:text-6xl text-white mb-4">Праздничное меню</h2>
            <p className="text-white/60 font-rubik text-lg">Отметьте блюда, которые вы хотели бы попробовать</p>
          </div>

          {selectedCount > 0 && (
            <div className="mb-8 flex justify-center">
              <div className="flex items-center gap-3 backdrop-blur-xl bg-amber-400/20 border border-amber-400/40 rounded-2xl px-6 py-3">
                <span className="text-2xl">✅</span>
                <span className="text-amber-300 font-rubik font-semibold">
                  Выбрано блюд: {selectedCount}
                </span>
              </div>
            </div>
          )}

          {categories.map((category) => (
            <div key={category} className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-white/10" />
                <h3 className="text-white/80 font-rubik font-bold text-sm tracking-[0.2em] uppercase px-4">
                  {category}
                </h3>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.filter((item) => item.category === category).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`relative text-left rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] group ${
                      item.selected
                        ? "bg-gradient-to-br from-amber-400/20 to-pink-500/20 border-amber-400/60 shadow-lg shadow-amber-400/20"
                        : "backdrop-blur-sm bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    {item.selected && (
                      <div className="absolute top-3 right-3 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-purple-900 text-xs font-bold">✓</span>
                      </div>
                    )}
                    <div className="text-4xl mb-3">{item.emoji}</div>
                    <h4 className={`font-rubik font-bold text-base mb-1 ${item.selected ? "text-amber-300" : "text-white"}`}>
                      {item.name}
                    </h4>
                    <p className="text-white/50 font-rubik text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-10 text-center">
            <button
              onClick={handleSave}
              disabled={selectedCount === 0}
              className={`px-10 py-4 rounded-2xl font-rubik font-bold text-lg transition-all duration-300 ${
                selectedCount > 0
                  ? "text-purple-900 hover:scale-105 shadow-xl shadow-pink-400/30 cursor-pointer"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
              style={selectedCount > 0 ? { background: "linear-gradient(135deg, #F59E0B, #EC4899, #7C3AED)" } : {}}
            >
              {savedSuccess ? "✅ Предпочтения сохранены!" : `Сохранить выбор (${selectedCount} блюд) 🎊`}
            </button>
            {selectedCount === 0 && (
              <p className="text-white/40 text-sm mt-3 font-rubik">Выберите хотя бы одно блюдо</p>
            )}
          </div>
        </div>
      </section>

      {/* INFO SECTION */}
      <section ref={infoRef} data-section="info" className="min-h-screen px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-400 font-rubik font-semibold text-sm tracking-[0.3em] uppercase mb-3">✦ Всё, что нужно знать ✦</p>
            <h2 className="font-pacifico text-5xl sm:text-6xl text-white mb-4">Информация</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {[
              {
                icon: "📅",
                title: "Дата и время",
                lines: ["Суббота, 15 июня 2025", "Начало в 19:00", "Окончание около 23:00"],
                color: "from-amber-400/20 to-orange-500/10",
                border: "border-amber-400/30",
              },
              {
                icon: "📍",
                title: "Место проведения",
                lines: ["Ресторан «Золотой зал»", "ул. Праздничная, 15", "Большой зал, 2-й этаж"],
                color: "from-pink-500/20 to-rose-600/10",
                border: "border-pink-400/30",
              },
              {
                icon: "👗",
                title: "Дресс-код",
                lines: ["Нарядный / Полуформальный", "Приветствуются яркие цвета", "Будьте собой! 🌟"],
                color: "from-purple-500/20 to-violet-600/10",
                border: "border-purple-400/30",
              },
              {
                icon: "📞",
                title: "Контакт организатора",
                lines: ["Анна Иванова", "+7 (999) 123-45-67", "anna@example.com"],
                color: "from-teal-400/20 to-cyan-600/10",
                border: "border-teal-400/30",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`rounded-2xl border bg-gradient-to-br ${card.color} ${card.border} p-6 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="font-rubik font-bold text-white text-lg mb-3">{card.title}</h3>
                {card.lines.map((line, j) => (
                  <p key={j} className="text-white/70 font-rubik text-sm leading-relaxed">{line}</p>
                ))}
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="rounded-3xl overflow-hidden border border-white/10 backdrop-blur-sm bg-white/5 p-8 text-center">
            <div className="text-6xl mb-4">🗺</div>
            <h3 className="font-rubik font-bold text-white text-xl mb-2">Схема проезда</h3>
            <p className="text-white/50 font-rubik mb-4">ул. Праздничная, 15 — в центре города, рядом с парком</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                <span className="text-xl">🚇</span>
                <span className="text-white/70 text-sm font-rubik">Метро «Центральная» — 5 мин</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                <span className="text-xl">🚗</span>
                <span className="text-white/70 text-sm font-rubik">Парковка на территории</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                <span className="text-xl">🚕</span>
                <span className="text-white/70 text-sm font-rubik">Такси до входа</span>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <div className="inline-block backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl px-10 py-8">
              <div className="text-5xl mb-4 animate-bounce-slow inline-block">🥂</div>
              <p
                className="font-pacifico text-3xl text-transparent bg-clip-text mb-2"
                style={{ backgroundImage: "linear-gradient(135deg, #F59E0B, #EC4899)" }}
              >
                До встречи!
              </p>
              <p className="text-white/60 font-rubik">Мы будем рады видеть вас на нашем празднике</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-white/30 font-rubik text-sm">
        🎉 С любовью и радостью для наших дорогих гостей 🎉
      </footer>
    </div>
  );
}