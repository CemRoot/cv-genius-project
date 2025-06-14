# CVGenius - Local Development Guide 🛠️

Bu rehber CVGenius'u local'de çalıştırmak için gerekli adımları açıklar.

## 🚀 Hızlı Başlangıç

### 1. Tek Komutla Başlat (Önerilen)
```bash
npm run dev
```
Bu komut hem frontend'i hem backend'i aynı anda başlatır.

### 2. Manuel Başlatma
```bash
# Backend'i başlat (Terminal 1)
npm run dev:backend

# Frontend'i başlat (Terminal 2) 
npm run dev:frontend
```

## 📍 Local URL'ler

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000  
- **API Docs**: http://localhost:8000/docs

## 🤖 **Otomatik Environment Detection**

**Artık manual URL değiştirme yok!** Frontend otomatik olarak environment'ı detect eder:

- **Development**: `npm run dev` → http://localhost:8000
- **Production**: `npm run deploy` → Production backend URL

**Environment Indicator**: Development modunda sağ üstte yeşil bir badge görürsün.

## ⚙️ Environment Setup

### Backend (.env dosyası)
Backend klasöründe `.env` dosyası oluşturun:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
ENVIRONMENT=development
DEBUG=True
FRONTEND_URL=http://localhost:3000
```

**Gemini API Key nasıl alınır:**
1. https://aistudio.google.com/app/apikey adresine gidin
2. "Create API Key" butonuna tıklayın
3. Anahtarı kopyalayıp `.env` dosyasına yapıştırın

### Frontend (.env.local dosyası)
**Artık manual URL değiştirme gerekmez!** Sadece analytics için:

```env
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_ADSENSE_ID=
```

## 🔄 Development Workflow

### 1. Değişiklik Yap
- Frontend dosyalarında değişiklik yap
- Backend dosyalarında değişiklik yap
- Tarayıcı otomatik olarak yenilenir (hot reload)

### 2. Test Et
- http://localhost:3000 adresinde test et
- Hataları konsol'da kontrol et

### 3. Deploy Et
```bash
# Sadece frontend deploy et
npm run deploy

# Backend + Frontend birlikte deploy et
npm run deploy:full

# Sadece backend deploy et
npm run deploy:backend
```

## 🛑 Serverleri Durdur

### Tek komutla başlattıysan:
`Ctrl + C` tuşlarına bas

### Manuel başlattıysan:
Her terminal'de `Ctrl + C` tuşlarına bas

## 🎯 **Artık Hiç Manual Değişiklik Yok!**

✅ **Local çalıştır**: `npm run dev` - Otomatik localhost:8000  
✅ **Deploy et**: `npm run deploy` - Otomatik production URL  
✅ **Environment görüntüle**: Yeşil badge development modunda  

**No more manual URL changes! 🎉**

## 🐛 Common Issues

### Port zaten kullanımda hatası:
```bash
# Port 3000'i öldür
lsof -ti:3000 | xargs kill -9

# Port 8000'i öldür  
lsof -ti:8000 | xargs kill -9
```

### Backend bağlantı hatası:
1. Backend'in çalıştığını kontrol et: http://localhost:8000/docs
2. `.env` dosyasındaki `GEMINI_API_KEY`'i kontrol et
3. CORS ayarlarını kontrol et

### Frontend build hatası:
```bash
cd frontend
rm -rf .next
npm install
npm run dev
```

## 📁 Proje Yapısı

```
cv-genius-project/
├── frontend/           # Next.js React app
├── backend/           # FastAPI Python app  
├── start-local.sh     # Development script
├── package.json       # Root scripts
└── README-DEVELOPMENT.md
```

## 🎯 Development Tips

1. **Hot Reload**: Değişiklikler otomatik yansır
2. **API Docs**: http://localhost:8000/docs adresinde API'yi test edebilirsin
3. **Console Logs**: Browser DevTools'ta hataları gör
4. **Backend Logs**: Terminal'de API çağrılarını gör
5. **Environment Badge**: Development modunda yeşil indicator görürsün

Happy coding! 🚀 