
<?php
/**
 * Admin sayfası şablonu
 */

// Doğrudan erişimi engelle
if (!defined('ABSPATH')) {
    exit;
}

// Kaydedilmiş soruları al
$questions = get_option('urun_bulucu_questions', array());
?>

<div class="wrap">
    <h1>Ürün Bulucu Yönetimi</h1>
    
    <div class="urun-bulucu-admin">
        <div class="urun-bulucu-tabs">
            <button class="tab-button active" data-tab="questions">Sorular</button>
            <button class="tab-button" data-tab="settings">Ayarlar</button>
            <button class="tab-button" data-tab="help">Yardım</button>
        </div>
        
        <div class="tab-content questions-tab active">
            <div class="card">
                <h2>Sihirbaz Soruları</h2>
                <p>Müşterilerinize sorulacak soruları ve seçenekleri burada düzenleyebilirsiniz.</p>
                
                <div id="questions-container">
                    <?php if (empty($questions)): ?>
                        <div class="empty-questions">
                            <p>Henüz soru eklenmemiş.</p>
                        </div>
                    <?php else: ?>
                        <?php foreach ($questions as $index => $question): ?>
                            <div class="question-card" data-index="<?php echo esc_attr($index); ?>">
                                <div class="question-header">
                                    <h3>Soru <?php echo esc_html($index + 1); ?></h3>
                                    <button class="remove-question-button" title="Bu soruyu sil"><span class="dashicons dashicons-trash"></span></button>
                                </div>
                                
                                <div class="question-inputs">
                                    <div class="form-group">
                                        <label for="question-id-<?php echo esc_attr($index); ?>">Soru ID</label>
                                        <input type="text" id="question-id-<?php echo esc_attr($index); ?>" value="<?php echo esc_attr($question['id']); ?>" class="question-id">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="question-title-<?php echo esc_attr($index); ?>">Soru Başlığı</label>
                                        <input type="text" id="question-title-<?php echo esc_attr($index); ?>" value="<?php echo esc_attr($question['title']); ?>" class="question-title">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="question-desc-<?php echo esc_attr($index); ?>">Soru Açıklaması</label>
                                        <textarea id="question-desc-<?php echo esc_attr($index); ?>" class="question-description"><?php echo esc_textarea($question['description']); ?></textarea>
                                    </div>
                                </div>
                                
                                <div class="options-section">
                                    <h4>Seçenekler</h4>
                                    <div class="options-container">
                                        <?php foreach ($question['options'] as $option_index => $option): ?>
                                            <div class="option-item" data-option-index="<?php echo esc_attr($option_index); ?>">
                                                <div class="option-inputs">
                                                    <div class="form-group">
                                                        <label>Seçenek ID</label>
                                                        <input type="text" value="<?php echo esc_attr($option['id']); ?>" class="option-id">
                                                    </div>
                                                    
                                                    <div class="form-group">
                                                        <label>Seçenek Metni</label>
                                                        <input type="text" value="<?php echo esc_attr($option['text']); ?>" class="option-text">
                                                    </div>
                                                    
                                                    <div class="form-group">
                                                        <label>Resim URL (isteğe bağlı)</label>
                                                        <input type="text" value="<?php echo isset($option['imageUrl']) ? esc_attr($option['imageUrl']) : ''; ?>" class="option-image">
                                                    </div>
                                                </div>
                                                
                                                <button class="remove-option-button" title="Bu seçeneği sil"><span class="dashicons dashicons-no-alt"></span></button>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                    
                                    <button class="add-option-button" data-question-index="<?php echo esc_attr($index); ?>">
                                        <span class="dashicons dashicons-plus"></span> Yeni Seçenek Ekle
                                    </button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
                
                <div class="questions-actions">
                    <button id="add-question-button" class="button">
                        <span class="dashicons dashicons-plus"></span> Yeni Soru Ekle
                    </button>
                    
                    <button id="save-questions-button" class="button button-primary">
                        <span class="dashicons dashicons-saved"></span> Değişiklikleri Kaydet
                    </button>
                </div>
            </div>
        </div>
        
        <div class="tab-content settings-tab">
            <div class="card">
                <h2>Eklenti Ayarları</h2>
                <p>Ürün Bulucu eklentisi ayarlarını buradan yapılandırabilirsiniz.</p>
                
                <form id="settings-form">
                    <div class="form-group">
                        <label for="results-per-page">Sayfa Başına Sonuç</label>
                        <input type="number" id="results-per-page" value="12" min="4" max="40">
                        <p class="description">Sonuç sayfasında gösterilecek maksimum ürün sayısı</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="primary-color">Ana Renk</label>
                        <input type="color" id="primary-color" value="#3B82F6">
                        <p class="description">Eklentinin ana renk tonu</p>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="show-price" checked>
                            Ürün fiyatlarını göster
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="show-add-to-cart" checked>
                            "Sepete Ekle" düğmesini göster
                        </label>
                    </div>
                    
                    <button type="submit" class="button button-primary">Ayarları Kaydet</button>
                </form>
            </div>
        </div>
        
        <div class="tab-content help-tab">
            <div class="card">
                <h2>Yardım & Dokümantasyon</h2>
                
                <div class="help-section">
                    <h3>Kısa Kod Kullanımı</h3>
                    <p>Sihirbazı sitenizde göstermek için şu kısa kodu kullanabilirsiniz:</p>
                    <code>[urun_bulucu]</code>
                    
                    <p>Özel başlık ve alt başlık ile kullanmak için:</p>
                    <code>[urun_bulucu title="Özel Başlık" subtitle="Alt başlık metni"]</code>
                </div>
                
                <div class="help-section">
                    <h3>Sorular ve Seçenekler</h3>
                    <p>Her soru için benzersiz bir ID tanımladığınızdan emin olun. Bu ID, veritabanında soruyu tanımlamak için kullanılır.</p>
                    <p>Seçenek ID'leri, WooCommerce ürün etiketleri (tag) ile eşleşmelidir, böylece ürün filtreleme düzgün çalışır.</p>
                </div>
                
                <div class="help-section">
                    <h3>Ürün Etiketleri</h3>
                    <p>Sihirbaz, ürünleri seçenek ID'leri ile eşleşen ürün etiketlerine göre filtreler.</p>
                    <p>Örnek: Bir "price" sorusunda "budget" seçeneği seçilirse, sistem "budget" etiketine sahip ürünleri filtreler.</p>
                </div>
            </div>
        </div>
    </div>
</div>
