export const movies = [
    {
            title: 'Звёздные войны XXIII: Атака клонированных клонов',
            description: 'Две сотни лет назад малороссийские хутора разоряла шайка нехристей-ляхов во главе с могущественным колдуном.',
            time: '130 минут',
            country: 'США',
        },
    {
        title: 'Альфа',
        description: '20 тысяч лет назад Земля была холодным и неуютным местом, в котором смерть подстерегала человека на каждом шагу.',
        time: '96 минут',
        country: 'Франция'
    },
    {
        title: 'Хищник',
        description: 'Самые опасные хищники Вселенной, прибыв из глубин космоса, высаживаются на улицах маленького городка, чтобы начать свою кровавую охоту. Генетически модернизировав себя с помощью ДНК других видов, охотники стали ещё сильнее, умнее и беспощаднее.',
        time: '101 минута',
        country: 'Канада, США'
    }
]


export const buyingScheme = [
  [ null, null, null, null, null, { row: 1, seat: 1 }, { row: 1, seat: 2 }, null, null, null, null, null ],

  [ null, null, null, null, { row: 2, seat: 1 }, { row: 2, seat: 2 }, { row: 2, seat: 3 }, 
    { row: 2, seat: 4 }, null, null, null, null ],

  [ null, {row: 3, seat: 1}, {row: 3, seat: 2}, {row: 3, seat: 3}, {row: 3, seat: 4}, {row: 3, seat: 5},
    {row: 3, seat: 6}, {row: 3, seat: 7}, {row: 3, seat: 8}, null, null, null ],

  [ { row: 4, seat: 1 }, { row: 4, seat: 2 }, { row: 4, seat: 3, }, 
    { row: 4, seat: 4, }, { row: 4, seat: 5, }, { row: 4, seat: 6, isVip: true}, 
    { row: 4, seat: 7, isVip: true }, { row: 4, seat: 8 }, { row: 4, seat: 9 }, null, null, null],

  [ { row: 5, seat: 1 }, { row: 5, seat: 2 }, { row: 5, seat: 3 }, { row: 5, seat: 4, }, 
    { row: 5, seat: 5, isVip: true}, { row: 5, seat: 6, isVip: true }, { row: 5, seat: 7, isVip: true }, 
    { row: 5, seat: 8, isVip: true }, { row: 5, seat: 9 }, null, null, null],

  [ { row: 6, seat: 1 }, { row: 6, seat: 2 }, { row: 6, seat: 3}, 
    { row: 6, seat: 4}, { row: 6, seat: 5, isVip: true }, { row: 6, seat: 6, isVip: true},
    { row: 6, seat: 7, isVip: true }, { row: 6, seat: 8, isVip: true }, { row: 6, seat: 9 }, null, null, null],

  [ { row: 7, seat: 1 }, { row: 7, seat: 2 }, { row: 7, seat: 3 }, { row: 7, seat: 4, }, 
    { row: 7, seat: 5, isVip: true }, { row: 7, seat: 6, isVip: true }, { row: 7, seat: 7, isVip: true }, 
    { row: 7, seat: 8, isVip: true }, { row: 7, seat: 9 }, null, null, null ],

  [ {row: 5, seat: 1}, {row: 5, seat: 2}, {row: 5, seat: 3}, {row: 5, seat: 4}, {row: 5, seat: 5}, 
    {row: 5, seat: 6}, {row: 5, seat: 7}, {row: 5, seat: 8}, {row: 5, seat: 9} , null, null, null],

  [ {row: 9, seat: 1}, {row: 9, seat: 2}, {row: 9, seat: 3}, {row: 9, seat: 4}, {row: 9, seat: 5}, 
    {row: 9, seat: 6}, {row: 9, seat: 7}, {row: 9, seat: 8}, {row: 9, seat: 9}, {row: 9, seat: 10}, 
    {row: 9, seat: 11}, {row: 9, seat: 12}],

  [ {row: 10, seat: 1}, {row: 10, seat: 2}, {row: 10, seat: 3}, {row: 10, seat: 4}, {row: 10, seat: 5}, 
    {row: 10, seat: 6}, {row: 10, seat: 7}, {row: 10, seat: 8}, {row: 10,seat: 9}, {row: 10, seat: 10}, 
    {row: 10, seat: 11}, {row: 10, seat: 12}]
];
