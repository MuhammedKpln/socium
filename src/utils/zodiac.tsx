export interface IZodiac {
  name: string
  dateRange: string
  qualification: string
  qualificationTitle: string
  zodiacAbout: string
  about: string
  image: string
}

export const zodiacs = {
  Koç: {
    image: 'zodiac-aries',
    name: 'Koç',
    dateRange: '(21 Mart – 20 Nisan)',
    qualification: 'Ateş',
    qualificationTitle: 'Kardinal',
    zodiacAbout:
      'Cesur, kararlı, öz güvenli, coşkulu, iyimser, dürüst, tutkulu',
    about:
      'Bir komutan edasında olabilir ve yönetme arzusu ruhunda vardır. Hızlıdır, bir süreci tamamladığında diğerine geçmekte zorlanmaz ancak her şeyi çabuk tüketen ve çabuk sıkılan bir yapıya sahiptir.',
  },
  Boğa: {
    name: 'Boğa',
    image: 'zodiac-taurus',
    dateRange: '(21 Nisan – 20 Mayıs)',
    qualification: 'Toprak',
    qualificationTitle: 'Sabit',
    zodiacAbout:
      'Güvenilir, sabırlı, pratik, adanmış, sorumluluk sahibi, stabil olmaları',
    about:
      'Güven ve sadakat önemlidir. Güveninizi kazanan biri sizden kolay kolay vazgeçmez. Bakımlı kişilerden hoşlanırsınız. İlişkilerinizde güven çok önemlidir. Karşılığında sonsuz bir sadakat sunabilirsiniz.      ',
  },
  İkizler: {
    name: 'İkizler',
    image: 'zodiac-gemini',
    dateRange: '(21 Nisan – 20 Mayıs)  ',
    qualification: 'Hava',
    qualificationTitle: 'Değişken',
    zodiacAbout:
      'Kibar, sevecen, meraklı, uyumlu, yeni fikirleri çabucak öğrenebilir olmaları',
    about:
      'Değişime herkesten çok ihtiyacınız vardır. Bulunduğuz ortamda çabuk sıkılır, dışarı çıkmak, hava almak istersiniz. Özgürlüğünüze karışılmamalıdır. Tatlı dilli ve konuşkansınız.      ',
  },
  Yengeç: {
    name: 'Yengeç',
    image: 'zodiac-cancer',
    dateRange: '(21 Haziran – 30 Temmuz)',
    qualification: 'Su',
    qualificationTitle: 'Kardinal (öncü)',
    zodiacAbout:
      'Sebatkâr, hayal gücü yüksek, sadık, duygusal, sempatik, ikna gücü yüksek olmaları',
    about:
      'Evine, annesine, ailesine, yurduna düşkün, duyarlı, hassas, yemeğe, sofraya meraklı, tarihsel konulara ilgili, müzik yeteneğine sahip birisiniz.',
  },
  Aslan: {
    name: 'Aslan',
    image: 'zodiac-leo',
    dateRange: '(23 Temmuz – 22 Ağustos)',
    qualification: 'Ateş',
    qualificationTitle: 'Sabit',
    zodiacAbout:
      'Yaratıcı, tutkulu, cömert, cana yakın, neşeli, esprili olmaları',
    about:
      'Gururunuzun okşanmasından, hizmet görmekten, pohpohlanmaktan hoşlanırsınız. Lider olmak için doğduğunuz, korumacı ve kollayıcı özellikleriniz size öne çıkarır',
  },
  Başak: {
    name: 'Başak',
    image: 'zodiac-virgo',
    dateRange: '(23 Ağustos – 22 Eylül)',
    qualification: 'Toprak',
    qualificationTitle: 'Değişken',
    zodiacAbout: 'Sadık, analitik, nazik, çalışkan, pratik olmaları',
    about:
      'Akılcı ve pratik bir zekaya sahipsiniz. Dakik, çalışkan ve detaylara önem veriyorsunuz. Eleştirel ve titiz yönleri zaman zaman sizi zorlayıcı kılabilir.',
  },
  Terazi: {
    name: 'Terazi',
    image: 'zodiac-libra',
    dateRange: '(23 Eylül – 22 Ekim)',
    qualification: 'Hava',
    qualificationTitle: 'Kardinal',
    zodiacAbout: 'Dayanışmacı, diplomat, zarif, tarafsız, sosyal olmaları',
    about:
      'Sakin, uyumlu görüntünüzün ardında ne istediğini iyi bilen ve dominant bir yapınız vardır. Huzur sizin için önemlidir. Sanata düşkünsünüz. Keyif aldığı konularda para harcamayı seviyorsunuz. İlişkinizde denge ve eşitlik beklersiniz.',
  },
  Akrep: {
    name: 'Akrep',
    image: 'zodiac-scorpio',
    dateRange: '(24 Ekim – 21 Kasım)',
    qualification: 'Su',
    qualificationTitle: 'Sabit',
    zodiacAbout: 'Güçlü beden, psikolojik direnç, sabır ve sükut',
    about:
      'Mücadeleci, güçlü, yılmaz, hırslı bir kişiliğe sahipsiniz. Pes ettiğinizi düşündükleri anda küllerinizden yeniden doğabilirsiniz. Güvenilir, kaliteli bir insansınız.',
  },
  Yay: {
    name: 'Yay',
    image: 'zodiac-sagittarius',
    dateRange: '(22 Kasım – 21 Aralık)',
    qualification: 'Ateş',
    qualificationTitle: 'Değişken',
    zodiacAbout: 'Cömert, idealist, esprili olması',
    about:
      'Bağımsız bir ruha sahipsiniz. Gezmeyi, tozmayı, eğlenmeyi sever. Yeni yerler görmekten, yeni dost ve arkadaşlar tanımaktan, ufkunu ve sınırlarını zorlamaktan zevk alıyorsunuz. Zor olan tek şey sizin hızınıza ayak uydurabilmek.      ',
  },
  Oğlak: {
    name: 'Oğlak',
    image: 'zodiac-capricorn',
    dateRange: '(22 Aralık – 19 Ocak)',
    qualification: 'Toprak',
    qualificationTitle: 'Kardinal (öncü)',
    zodiacAbout:
      'Sorumluluk sahibi, disiplinli, otokontrollü olmaları, iyi yönetici olmaları',
    about:
      'Evinize ve ailenize düşkünsünüz. Yalnız kalmayı, tek başına hareket etmeyi sever. Kendi kural ve prensipleriniz vardır. Zaman zaman fazlasıyla disiplinli ve soğuk olabilirsiniz. Tam bir görev insanısınız.      ',
  },
  Kova: {
    name: 'Kova',
    image: 'zodiac-aquarius',
    dateRange: '(20 Ocak – 18 Şubat)',
    qualification: 'Hava',
    qualificationTitle: 'Sabit',
    zodiacAbout:
      'Özgün fikirler üretebilmek, hızlı öğrenmek, yeniliklere açık olmak',
    about:
      'Farklı, sıradışı ve zekisiniz. Oldukça sosyal ve arkadaş canlısı olsanızda eş seçimleriniz zordur. Zeka ve akılcılığınız ile yol gösterir, vizyoner bakış açılarıyla yaşadığınız topluma etki ediyorsunuz.',
  },
  Balık: {
    name: 'Balık',
    image: 'zodiac-pisces',
    dateRange: '(19 Şubat – 20 Mart)',
    qualification: 'Su',
    qualificationTitle: 'Değişken',
    zodiacAbout: 'Şefkatli, sanatçı ruhlu, sezgisel, nazik, bilge',
    about:
      'Etrafınızda olan biten her şeyden ve etrafındaki herkesten kolayca etkilenebilen hassas bir kişiliğiniz var. Tam olarak anlaşılamayan, kendilerini de belirli kalıplar içinde tanımlayamayan muğlak, gizemli, karmaşık yönleriniz vardır.  Hassas ve alıngansınız ancak her ne kadar fazlaca etki altında kalsanız da bir şekilde zor durumlardan sıyrılmasını, kurtulmasını bilirsiniz. Akışta yaşıyorsunuz.',
  },
}

function parseDate(input: string) {
  const date = new Date(input)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return { month, day }
}

export const getZodiac = (date: string): IZodiac => {
  const { month, day } = parseDate(date)

  if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) {
    return zodiacs.Oğlak
  } else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) {
    return zodiacs.Kova
  } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
    return zodiacs.Balık
  } else if ((month == 3 && day >= 21) || (month == 4 && day <= 20)) {
    return zodiacs.Koç
  } else if ((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
    return zodiacs.Boğa
  } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
    return zodiacs.İkizler
  } else if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) {
    return zodiacs.Yengeç
  } else if ((month == 7 && day >= 23) || (month == 8 && day <= 23)) {
    return zodiacs.Aslan
  } else if ((month == 8 && day >= 24) || (month == 9 && day <= 23)) {
    return zodiacs.Başak
  } else if ((month == 9 && day >= 24) || (month == 10 && day <= 23)) {
    return zodiacs.Terazi
  } else if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) {
    return zodiacs.Akrep
  } else if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) {
    return zodiacs.Yay
  } else {
    return zodiacs.Koç
  }
}
