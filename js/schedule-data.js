/* Расписание студии SDS.
   Источник: картинка «Актуальное расписание студии танцев SDS», пост от 14 февраля.
   Подписи групп, возрастов и пометок — ровно как у студии. Залы в расписании не указаны.
   style — направление для фильтра; title — название как в расписании. */
window.SDS = window.SDS || {};
window.SDS.schedule = {
  source: "по данным студии (расписание от 14 февраля)",
  days: [
    { id: "mon", short: "ПН", name: "Понедельник" },
    { id: "tue", short: "ВТ", name: "Вторник" },
    { id: "wed", short: "СР", name: "Среда" },
    { id: "thu", short: "ЧТ", name: "Четверг" },
    { id: "fri", short: "ПТ", name: "Пятница" }
  ],
  slots: [
    { id: "17", label: "17–18", start: "17:00" },
    { id: "18", label: "18–19", start: "18:00" },
    { id: "19", label: "19–20", start: "19:00" },
    { id: "20", label: "20–21", start: "20:00" }
  ],
  items: [
    // ПН
    { day: "mon", slot: "17", style: "К-поп", title: "К-поп", age: "9–12", teacher: "Дима Ким" },
    { day: "mon", slot: "17", style: "Хип-хоп", title: "Хип-хоп", age: "13+", teacher: "Соня" },
    { day: "mon", slot: "17", style: "Современный", title: "Современный, база+сцена", age: "7–9", teacher: "Яна" },
    { day: "mon", slot: "18", style: "К-поп", title: "К-поп", age: "13+", teacher: "Дима Ким" },
    { day: "mon", slot: "18", style: "Уличные", title: "Уличные, база+сцена", age: "7–9", teacher: "Соня" },
    { day: "mon", slot: "18", style: "Baby style", title: "Baby style", age: "5–6", teacher: "Яна" },
    { day: "mon", slot: "19", style: "Уличные", title: "Уличные, база+сцена+конкурс", age: "10–12", teacher: "Соня" },
    { day: "mon", slot: "19", style: "Контемп", title: "Контемп", age: "13+", teacher: "Яна" },
    { day: "mon", slot: "19", style: "К-поп", title: "К-поп КД", age: null, closed: true, teacher: "Дима Ким" },
    { day: "mon", slot: "20", style: "Дивы", title: "Дивы", age: "14+", teacher: "Дима П." },
    { day: "mon", slot: "20", style: "Пилатес", title: "Пилатес", age: "18+", teacher: "Яна" },
    { day: "mon", slot: "20", style: "К-поп", title: "К-поп КД", age: null, closed: true, teacher: "Дима Ким" },
    // ВТ (17–18 занятий нет)
    { day: "tue", slot: "18", style: "Джаз-фанк", title: "Джаз-фанк", age: "14+", teacher: "Снежана" },
    { day: "tue", slot: "19", style: "Современный", title: "Современный, база+сцена", age: "10–12", teacher: "Кристина" },
    { day: "tue", slot: "19", style: "High heels", title: "High heels «с нуля»", age: "18+", teacher: "Снежана" },
    { day: "tue", slot: "20", style: "High heels", title: "High heels «проект»", age: "18+", teacher: "Снежана" },
    { day: "tue", slot: "20", style: "Леди", title: "Леди", age: "14+", teacher: "Рубчинская" },
    { day: "tue", slot: "20", style: "Современный", title: "Современный, сцена", age: "10–12", teacher: "Кристина" },
    // СР
    { day: "wed", slot: "17", style: "К-поп", title: "К-поп", age: "9–12", teacher: "Дима Ким" },
    { day: "wed", slot: "17", style: "Хип-хоп", title: "Хип-хоп", age: "13+", teacher: "Соня" },
    { day: "wed", slot: "18", style: "К-поп", title: "К-поп", age: "13+", teacher: "Дима Ким" },
    { day: "wed", slot: "18", style: "Уличные", title: "Уличные, база+сцена", age: "7–9", teacher: "Соня" },
    { day: "wed", slot: "19", style: "Уличные", title: "Уличные, база+сцена+конкурс", age: "10–12", teacher: "Соня" },
    { day: "wed", slot: "19", style: "К-поп", title: "К-поп КД", age: null, closed: true, teacher: "Дима Ким" },
    { day: "wed", slot: "20", style: "Дивы", title: "Дивы", age: "14+", teacher: "Дима П." },
    { day: "wed", slot: "20", style: "К-поп", title: "К-поп КД", age: null, closed: true, teacher: "Дима Ким" },
    // ЧТ
    { day: "thu", slot: "17", style: "Современный", title: "Современный, база+сцена", age: "7–9", teacher: "Яна" },
    { day: "thu", slot: "18", style: "Джаз-фанк", title: "Джаз-фанк", age: "14+", teacher: "Снежана" },
    { day: "thu", slot: "18", style: "Baby style", title: "Baby style", age: "5–6", teacher: "Яна" },
    { day: "thu", slot: "19", style: "Современный", title: "Современный, база+сцена", age: "10–12", teacher: "Кристина" },
    { day: "thu", slot: "19", style: "Контемп", title: "Контемп", age: "13+", teacher: "Яна" },
    { day: "thu", slot: "19", style: "High heels", title: "High heels «с нуля»", age: "18+", teacher: "Снежана" },
    { day: "thu", slot: "20", style: "High heels", title: "High heels «проект»", age: "18+", teacher: "Снежана" },
    { day: "thu", slot: "20", style: "Пилатес", title: "Пилатес", age: "18+", teacher: "Яна" },
    { day: "thu", slot: "20", style: "Современный", title: "Современный, конкурс", age: "10–12", teacher: "Кристина" },
    // ПТ
    { day: "fri", slot: "17", style: "Современный", title: "Современный, сцена", age: "7–9", teacher: "Яна" },
    { day: "fri", slot: "18", style: "Джаз-фанк", title: "Джаз-фанк", age: null, closed: true, teacher: "Снежана" },
    { day: "fri", slot: "18", style: "Уличные", title: "Уличные, сцена", age: "7–9", teacher: "Соня" },
    { day: "fri", slot: "19", style: "Уличные", title: "Уличные, сцена+конкурс", age: "10–12", teacher: "Соня" },
    { day: "fri", slot: "19", style: "SDS Crew", title: "SDS Crew", age: null, closed: true, teacher: null },
    { day: "fri", slot: "20", style: "Уличные", title: "Уличные, конкурс", age: "10–12", teacher: "Соня" },
    { day: "fri", slot: "20", style: "Леди", title: "Леди", age: "14+", teacher: "Рубчинская" }
  ]
};
