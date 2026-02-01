Changelog
Tüm önemli teknik güncellemeler ve hata düzeltmeleri bu dosya üzerinden takip edilebilir.

[1.3.1] - 2026-02-02
✨ Eklendi
Dosya Silme Takibi (File System Watcher): onDidDeleteFiles özelliği entegre edildi. Bir .todo dosyası VS Code içerisinden silindiğinde, o dosyaya ait hafıza (globalState) otomatik olarak temizlenir.

Otomatik Hafıza Senkronizasyonu: Dosya içeriği manuel olarak temizlendiğinde veya satır sayısı azaltıldığında, hafızadaki "hayalet" tikler (geçersiz indexler) anında ayıklanır.

🐛 Düzeltildi
Hafıza Sızıntısı ve Çakışma: Dosya silinip aynı isimle tekrar açıldığında eski verilerin gelmesi sorunu, dosya boyutu kontrolüyle giderildi.

Değişken Hataları: const atama hataları giderilerek depolama (Storage) yönetimi daha stabil bir hale getirildi.

⚙️ Değiştirildi
Hassas Hitbox: Tıklama alanı, sadece ikonun üzerine odaklanacak şekilde 3 karakter (<= 3) olarak güncellendi.

[1.3.0] - 2026-02-01
✨ Eklendi
Seri Tıklama Desteği: Aynı satıra üst üste tıklandığında imleci kaydırarak event tetiklenmesini sağlayan mekanizma eklendi.

Dinamik Başlatma: Uzantının onStartupFinished ile daha hızlı uyanması sağlandı.

🐛 Düzeltildi
Benzersiz Satır Kimliği (Index System): Metin bazlı kontrolden Satır İndeksi bazlı kontrol sistemine geçilerek aynı isme sahip satırların çakışması engellendi.

[1.1.1] - 2026-02-01
🐛 Düzeltildi
Whitespace Optimizasyonu: Satır başındaki boşlukların renklendirmeyi bozması engellendi.

Trigger Hataları: :e ve error: komutlarından sonraki boşluk algılama hataları giderildi.

[1.1.0] - 2026-02-01
✨ Eklendi
Akıllı Çift Kelime Kontrolü: Satır başındaki ilk iki kelimeyi analiz eden tarama sistemi.

Hiyerarşik Öncelik Sistemi: Görevler için !!!, !!, ! desteği eklendi.