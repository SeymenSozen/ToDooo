Changelog
Tüm önemli değişiklikler bu dosyada kayıt altında tutulacaktır.

[1.3.0] - 2026-02-01
✨ Eklendi
Seri Tıklama Desteği: Aynı satıra üst üste tıklandığında imleci otomatik olarak bir karakter kaydıran mekanizma eklendi. Bu sayede "boşluğa tıklayıp geri gelme" zorunluluğu ortadan kalktı, akıcı bir kullanım sağlandı.

Profesyonel Açılış Bildirimi: Uzantı uyandığında kullanıcıyı karşılayan ve komut paleti (Ctrl+Shift+P) kullanımını hatırlatan interaktif bir rehber mesajı eklendi.

Dinamik Başlatma Güvencesi: Uzantının sadece .todo dosyası açıldığında değil, VS Code oturumu başladığında hazır olması sağlandı (onStartupFinished).

🐛 Düzeltildi
Benzersiz Satır Kimliği (Index System): Aynı metne sahip satırların (örneğin iki ayrı "Python Çalış" satırı) aynı anda renk değiştirmesi bug'ı, metin bazlı kontrolden Satır İndeksi bazlı kontrol sistemine geçilerek kalıcı olarak çözüldü.

Hitbox Hassasiyeti: Kullanıcı geri bildirimleri doğrultusunda, 20 karakterlik geniş tıklama alanı daha kontrollü bir deneyim için 6 karakterlik stratejik bir bölgeye daraltıldı.

⚙️ Değiştirildi
Bağımsız Katman Mimarisi: İkon dekorasyonları ve arka plan renklendirmeleri birbirinden ayrıldı. Kullanıcı renklendirmeyi kapatsa bile görev ikonları (logolar) rehberlik amacıyla görünür kalmaya devam ediyor.

[1.1.1] - 2026-02-01
🐛 Düzeltildi
Whitespace Optimizasyonu: Satır başındaki veya kelime aralarındaki gereksiz boşlukların renklendirme algoritmasını bozması engellendi.

Trigger Hataları: :e, error: gibi tetikleyicilerden sonra boşluk bırakıldığında oluşan "yanlış yeşil mod" hatası giderildi.

⚙️ Değiştirildi
Gelişmiş Kelime Ayrıştırma: Algoritma, cümle içindeki rastgele kelimeler yerine sadece satır başındaki gerçek komutlara odaklanacak şekilde kararlı hale getirildi.

[1.1.0] - 2026-02-01
✨ Eklendi
Akıllı Çift Kelime Kontrolü: Satır başındaki ilk iki kelimeyi analiz eden akıllı tarama sistemi.

Genişletilmiş Komut Desteği: !e, !error, error:, e: ve !bug kısayolları için tam entegrasyon.

Hiyerarşik Öncelik Sistemi: Görevler için görsel hiyerarşi sağlayan seviye desteği (!!!, !!, !).