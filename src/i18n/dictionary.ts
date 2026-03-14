export type AppLanguage = 'ru' | 'kg' | 'en';

interface Dict {
  [key: string]: string | Dict;
}

export const dictionary: Record<AppLanguage, Dict> = {
  ru: {
    nav: { home: 'Главная', menu: 'Меню', orders: 'Заказы', profile: 'Профиль' },
    auth: {
      title: 'Вход',
      subtitle: 'Введите номер телефона для продолжения',
      phoneLabel: 'Телефон',
      phonePlaceholder: '+996 (___) __-__-__',
      submit: 'Войти',
      loading: 'Проверяем...',
      helper: 'Мы отправим код подтверждения по SMS',
      invalidPhone: 'Введите корректный номер Кыргызстана',
      genericError: 'Не удалось войти. Попробуйте еще раз.',
    },
    common: {
      openMenu: 'Открыть меню',
      addToCart: 'Добавить в корзину',
      continueToPayment: 'Продолжить к оплате',
      setDeliveryAddress: 'Указать адрес доставки',
      placeOrder: 'Оформить заказ',
    },
    home: {
      title: 'Главная',
      subtitle: 'Фирменные блюда и быстрый заказ',
      heroKicker: 'Меню ресторана Faiza',
      heroTitle: 'Вкусно, быстро, с доставкой',
      heroSubtitle: 'Оформляйте заказ в несколько шагов и отслеживайте статус онлайн.',
      reorder: 'Повторить',
      favorites: 'Избранное',
      qrPay: 'QR-оплата',
      categories: 'Категории',
      popular: 'Популярно сейчас',
    },
    menu: { title: 'Меню Faiza', subtitle: 'Все категории и актуальные цены', search: 'Поиск блюда', details: 'Подробнее', toCart: 'В корзину', from: 'от', min: 'мин' },
    cart: {
      title: 'Корзина',
      subtitle: 'позиций в заказе',
      empty: 'Корзина пустая. Добавьте блюда из меню.',
      extras: 'Добавки',
      subtotal: 'Сумма',
      delivery: 'Доставка',
      service: 'Сервис',
      total: 'Итого',
    },
    orders: { title: 'Мои заказы', subtitle: 'История и отслеживание', empty: 'Заказов пока нет. Оформите первый заказ из меню.', track: 'Трек', reorder: 'Повторить', items: 'позиций' },
    profile: {
      title: 'Профиль',
      subtitle: 'Личные данные и настройки',
      name: 'Имя',
      email: 'Email',
      notifications: 'Push-уведомления',
      history: 'История заказов',
      save: 'Сохранить изменения',
      logout: 'Выйти из аккаунта',
      noPhone: 'Номер не указан',
      historyEmpty: 'Здесь появится история ваших заказов.',
      invalidEmail: 'Введите корректный email',
    },
    customize: {
      subtitle: 'Настройте состав перед добавлением в корзину',
      size: 'Размер',
      milk: 'Молоко',
      sugar: 'Сахар',
      temperature: 'Температура',
      extras: 'Добавки',
      comment: 'Комментарий',
      commentPlaceholder: 'Например: без лука, меньше соли...',
      finalPrice: 'Итоговая цена',
      kcal: 'ккал',
    },
    delivery: {
      title: 'Доставка',
      subtitle: 'Укажите точку доставки перед оформлением',
      gps: 'Текущая геолокация',
      map: 'Выбрать на карте',
      manual: 'Ввести адрес вручную',
      detect: 'Определить местоположение',
      pointNotSelected: 'Точка не выбрана',
      confirm: 'Подтвердить адрес доставки',
    },
    payment: { title: 'Оплата', subtitle: 'Выберите удобный способ оплаты', qr: 'QR-оплата', card: 'Карта', cash: 'Наличные', locationFirst: 'Сначала укажите адрес доставки' },
    confirmation: { title: 'Заказ подтвержден', thanks: 'Спасибо! Заказ принят', track: 'Отслеживать заказ', reorderLater: 'Повторить позже' },
    tracking: { title: 'Отслеживание', orderReceived: 'Заказ принят', preparing: 'Готовится', out: 'Готов / В пути', done: 'Доставлен', history: 'История заказов', update: 'Обновить статус' },
  },
  kg: {
    nav: { home: 'Башкы', menu: 'Меню', orders: 'Буйрутмалар', profile: 'Профиль' },
    auth: {
      title: 'Кирүү',
      subtitle: 'Улантуу үчүн телефон номериңизди киргизиңиз',
      phoneLabel: 'Телефон',
      phonePlaceholder: '+996 (___) __-__-__',
      submit: 'Кирүү',
      loading: 'Текшерилүүдө...',
      helper: 'SMS аркылуу ырастоо коду жөнөтүлөт',
      invalidPhone: 'Кыргызстан номери туура киргизилсин',
      genericError: 'Кирүү мүмкүн болгон жок. Кайра аракет кылыңыз.',
    },
    common: { openMenu: 'Менюну ачуу', addToCart: 'Себетке кошуу', continueToPayment: 'Төлөмгө өтүү', setDeliveryAddress: 'Даректи көрсөтүү', placeOrder: 'Буйрутма берүү' },
    home: { title: 'Башкы', subtitle: 'Faiza фирмалык тамактары', heroKicker: 'Faiza ресторанынын менюсу', heroTitle: 'Даамдуу, тез, жеткирүү менен', heroSubtitle: 'Буйрутманы бир нече кадамда жасап, статусун көзөмөлдөңүз.', reorder: 'Кайра', favorites: 'Сүйүктүүлөр', qrPay: 'QR төлөм', categories: 'Категориялар', popular: 'Азыр популярдуу' },
    menu: { title: 'Faiza Меню', subtitle: 'Бардык категориялар жана баалар', search: 'Тамак издөө', details: 'Толугураак', toCart: 'Себетке', from: 'баштап', min: 'мүн' },
    cart: { title: 'Себет', subtitle: 'позиция', empty: 'Себет бош. Менюдан тамак кошуңуз.', extras: 'Кошумчалар', subtotal: 'Сумма', delivery: 'Жеткирүү', service: 'Кызмат', total: 'Жыйынтык' },
    orders: { title: 'Буйрутмаларым', subtitle: 'Тарых жана көзөмөл', empty: 'Азырынча буйрутма жок.', track: 'Көзөмөл', reorder: 'Кайра', items: 'позиция' },
    profile: { title: 'Профиль', subtitle: 'Жеке маалымат жана жөндөөлөр', name: 'Аты', email: 'Email', notifications: 'Push-билдирмелер', history: 'Буйрутма тарыхы', save: 'Сактоо', logout: 'Чыгуу', noPhone: 'Номер көрсөтүлгөн эмес', historyEmpty: 'Буйрутма тарыхы ушул жерде.', invalidEmail: 'Туура email киргизиңиз' },
    customize: { subtitle: 'Себетке кошуудан мурун курамын тандаңыз', size: 'Өлчөм', milk: 'Сүт', sugar: 'Кант', temperature: 'Температура', extras: 'Кошумчалар', comment: 'Комментарий', commentPlaceholder: 'Мисалы: пиязсыз, тузу аз...', finalPrice: 'Жыйынтык баа', kcal: 'ккал' },
    delivery: { title: 'Жеткирүү', subtitle: 'Буйрутмадан мурун даректи көрсөтүңүз', gps: 'Учурдагы геолокация', map: 'Картадан тандоо', manual: 'Даректи кол менен киргизүү', detect: 'Жайгашкан жерди аныктоо', pointNotSelected: 'Чекит тандалган жок', confirm: 'Жеткирүү дарегин ырастоо' },
    payment: { title: 'Төлөм', subtitle: 'Ыңгайлуу төлөм түрүн тандаңыз', qr: 'QR төлөм', card: 'Карта', cash: 'Накталай', locationFirst: 'Адегенде жеткирүү дарегин көрсөтүңүз' },
    confirmation: { title: 'Буйрутма тастыкталды', thanks: 'Рахмат! Буйрутма кабыл алынды', track: 'Буйрутманы көзөмөлдөө', reorderLater: 'Кийин кайталоо' },
    tracking: { title: 'Көзөмөлдөө', orderReceived: 'Буйрутма кабыл алынды', preparing: 'Даярдалууда', out: 'Даяр / Жолдо', done: 'Жеткирилди', history: 'Буйрутма тарыхы', update: 'Статусту жаңылоо' },
  },
  en: {
    nav: { home: 'Home', menu: 'Menu', orders: 'Orders', profile: 'Profile' },
    auth: {
      title: 'Sign in',
      subtitle: 'Enter your phone number to continue',
      phoneLabel: 'Phone',
      phonePlaceholder: '+996 (___) __-__-__',
      submit: 'Sign in',
      loading: 'Verifying...',
      helper: 'We will send a confirmation code via SMS',
      invalidPhone: 'Enter a valid Kyrgyzstan phone number',
      genericError: 'Sign-in failed. Please try again.',
    },
    common: { openMenu: 'Open menu', addToCart: 'Add to cart', continueToPayment: 'Continue to payment', setDeliveryAddress: 'Set delivery address', placeOrder: 'Place order' },
    home: { title: 'Home', subtitle: 'Signature dishes and quick ordering', heroKicker: 'Faiza restaurant menu', heroTitle: 'Tasty, fast, delivered', heroSubtitle: 'Place your order in a few taps and track status online.', reorder: 'Reorder', favorites: 'Favorites', qrPay: 'QR Pay', categories: 'Categories', popular: 'Popular now' },
    menu: { title: 'Faiza Menu', subtitle: 'All categories and current prices', search: 'Search dish', details: 'Details', toCart: 'To cart', from: 'from', min: 'min' },
    cart: { title: 'Cart', subtitle: 'items in order', empty: 'Cart is empty. Add dishes from menu.', extras: 'Extras', subtotal: 'Subtotal', delivery: 'Delivery', service: 'Service', total: 'Total' },
    orders: { title: 'My orders', subtitle: 'History and tracking', empty: 'No orders yet. Place your first order.', track: 'Track', reorder: 'Reorder', items: 'items' },
    profile: { title: 'Profile', subtitle: 'Personal data and settings', name: 'Name', email: 'Email', notifications: 'Push notifications', history: 'Order history', save: 'Save changes', logout: 'Log out', noPhone: 'No phone set', historyEmpty: 'Your order history will appear here.', invalidEmail: 'Enter a valid email' },
    customize: { subtitle: 'Adjust details before adding to cart', size: 'Size', milk: 'Milk', sugar: 'Sugar', temperature: 'Temperature', extras: 'Extras', comment: 'Comment', commentPlaceholder: 'Example: no onion, less salt...', finalPrice: 'Final price', kcal: 'kcal' },
    delivery: { title: 'Delivery', subtitle: 'Select delivery point before checkout', gps: 'Current GPS location', map: 'Pick on map', manual: 'Enter address manually', detect: 'Detect location', pointNotSelected: 'No point selected', confirm: 'Confirm delivery address' },
    payment: { title: 'Payment', subtitle: 'Choose a payment method', qr: 'QR payment', card: 'Card', cash: 'Cash', locationFirst: 'Set delivery address first' },
    confirmation: { title: 'Order confirmed', thanks: 'Thanks! Order has been received', track: 'Track order', reorderLater: 'Reorder later' },
    tracking: { title: 'Tracking', orderReceived: 'Order received', preparing: 'Being prepared', out: 'Ready / Out for delivery', done: 'Completed', history: 'Order history', update: 'Update status' },
  },
};

export const translate = (lang: AppLanguage, key: string): string => {
  const read = (obj: Dict, path: string[]) => {
    let cur: string | Dict | undefined = obj;
    for (const p of path) {
      if (!cur || typeof cur === 'string') return undefined;
      cur = cur[p];
    }
    return typeof cur === 'string' ? cur : undefined;
  };
  const path = key.split('.');
  return read(dictionary[lang], path) ?? read(dictionary.ru, path) ?? key;
};
