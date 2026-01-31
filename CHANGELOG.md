# Changelog

## [1.1.1] - 2026-02-01
### Fixed
- Satır başındaki veya kelimeler arasındaki fazla boşlukların (whitespace) renklendirme mantığını bozması engellendi.
- `:e`, `error:` gibi ifadelerden sonra boşluk bırakıldığında satırın "tamamlandı" (yeşil) moduna geçme hatası düzeltildi.

### Changed
- Kelime ayrıştırma algoritması daha kararlı hale getirilerek sadece gerçek kelimelere odaklanması sağlandı.

## [1.1.0] - 2026-02-01
### Added
- Akıllı "ilk 2 kelime" kontrol sistemi eklendi.
- `!e`, `!error`, `error:`, `e:` ve `!bug` kısayolları için tam destek.
- `:!!!:`, `:!!:`, `:!:` formatında yeni öncelik sistemi.

### Fixed
- Cümle içinde geçen "error" kelimelerinin yanlışlıkla satırı kırmızı yapması düzeltildi.