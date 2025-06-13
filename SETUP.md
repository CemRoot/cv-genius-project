# CVGenius - Kurulum Rehberi

## Hızlı Başlangıç

### 1. Gemini API Key Kurulumu (ÖNEMLİ!)

Projede AI özelliklerini kullanabilmek için Google Gemini API key'e ihtiyacınız var:

#### Adım 1: API Key Alın
1. [Google AI Studio](https://aistudio.google.com/app/apikey) adresine gidin
2. Google hesabınızla giriş yapın
3. "Create API Key" butonuna tıklayın
4. API key'inizi kopyalayın

#### Adım 2: API Key'i Ayarlayın
1. `/backend/.env` dosyasını açın
2. Bu satırı bulun:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. `your_gemini_api_key_here` kısmını gerçek API key'inizle değiştirin:
   ```
   GEMINI_API_KEY=AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q
   ```

### 2. Projeyi Çalıştırın

```bash
# Projeyi başlatın
./start-local.sh
```

### 3. Hata Çözümleri

#### "Gemini API key not configured" Hatası
- `.env` dosyasında API key'in doğru ayarlandığından emin olun
- Backend sunucusunu yeniden başlatın

#### "Invalid Gemini API key" Hatası  
- API key'inizin doğru kopyalandığından emin olun
- Google AI Studio'da key'in aktif olduğunu kontrol edin

#### "API Request Failed" Hatası
- İnternet bağlantınızı kontrol edin
- Google AI Studio'da quota limitinizi kontrol edin

### 4. Test Edin

1. Frontend: http://localhost:3000
2. Backend: http://localhost:8000
3. API Docs: http://localhost:8000/docs

## Başarılı Kurulum

Eğer her şey doğru kurulmuşsa:
- Frontend'te CV oluşturma sayfası açılacak
- CV upload işlevi çalışacak  
- AI destekli CV optimizasyonu aktif olacak

## Destek

Sorun yaşıyorsanız:
1. `.env` dosyasındaki API key'i kontrol edin
2. Backend loglarını kontrol edin
3. Google AI Studio'da quota limitinizi kontrol edin