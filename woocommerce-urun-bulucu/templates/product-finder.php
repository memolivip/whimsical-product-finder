
<?php
/**
 * Ürün bulucu sihirbazı ana şablonu
 */

// Doğrudan erişimi engelle
if (!defined('ABSPATH')) {
    exit;
}

// Kaydedilmiş soruları al
$questions = get_option('urun_bulucu_questions', array());

// Varsayılan sorular yoksa örnek sorular oluştur
if (empty($questions)) {
    $questions = array(
        array(
            'id' => 'category',
            'title' => 'Hangi ürün kategorisi ile ilgileniyorsunuz?',
            'description' => 'Sizin için en uygun ürünleri bulmamıza yardımcı olun.',
            'options' => array(
                array(
                    'id' => 'electronics',
                    'text' => 'Elektronik',
                    'imageUrl' => 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&h=350&q=80'
                ),
                array(
                    'id' => 'clothing',
                    'text' => 'Giyim',
                    'imageUrl' => 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&h=350&q=80'
                ),
                array(
                    'id' => 'home',
                    'text' => 'Ev & Yaşam',
                    'imageUrl' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=350&q=80'
                ),
                array(
                    'id' => 'sports',
                    'text' => 'Spor & Outdoor',
                    'imageUrl' => 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=350&q=80'
                )
            )
        ),
        array(
            'id' => 'price',
            'title' => 'Fiyat aralığınız nedir?',
            'description' => 'Bütçenize uygun ürünleri göstermeye çalışacağız.',
            'options' => array(
                array(
                    'id' => 'budget',
                    'text' => 'Ekonomik'
                ),
                array(
                    'id' => 'mid',
                    'text' => 'Orta Seviye'
                ),
                array(
                    'id' => 'premium',
                    'text' => 'Premium'
                ),
                array(
                    'id' => 'any',
                    'text' => 'Fark Etmez'
                )
            )
        ),
        array(
            'id' => 'purpose',
            'title' => 'Ürünü ne amaçla kullanacaksınız?',
            'description' => 'İhtiyacınıza en uygun ürünleri önerebilmemiz için bize biraz bilgi verin.',
            'options' => array(
                array(
                    'id' => 'personal',
                    'text' => 'Kişisel Kullanım'
                ),
                array(
                    'id' => 'gift',
                    'text' => 'Hediye'
                ),
                array(
                    'id' => 'professional',
                    'text' => 'Profesyonel Kullanım'
                ),
                array(
                    'id' => 'other',
                    'text' => 'Diğer'
                )
            )
        )
    );
}
?>

<div class="urun-bulucu-container">
    <div class="urun-bulucu-header">
        <h2><?php echo esc_html($atts['title']); ?></h2>
        <p><?php echo esc_html($atts['subtitle']); ?></p>
    </div>
    
    <div class="urun-bulucu-wizard">
        <div class="progress-indicator">
            <?php foreach ($questions as $index => $question): ?>
                <div class="step-indicator" data-step="<?php echo esc_attr($index); ?>">
                    <?php echo esc_html($index + 1); ?>
                </div>
            <?php endforeach; ?>
        </div>
        
        <div class="wizard-content">
            <?php foreach ($questions as $index => $question): ?>
                <div class="wizard-step" data-step="<?php echo esc_attr($index); ?>" style="<?php echo $index === 0 ? '' : 'display: none;'; ?>">
                    <h3><?php echo esc_html($question['title']); ?></h3>
                    <p><?php echo esc_html($question['description']); ?></p>
                    
                    <div class="options-grid">
                        <?php foreach ($question['options'] as $option): ?>
                            <div class="option-card" data-option-id="<?php echo esc_attr($option['id']); ?>">
                                <?php if (!empty($option['imageUrl'])): ?>
                                    <div class="option-image">
                                        <img src="<?php echo esc_url($option['imageUrl']); ?>" alt="<?php echo esc_attr($option['text']); ?>">
                                    </div>
                                <?php endif; ?>
                                <div class="option-text">
                                    <?php echo esc_html($option['text']); ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endforeach; ?>
            
            <div class="wizard-results" style="display: none;">
                <h3>Ürün Sonuçları</h3>
                <div class="loading-indicator">
                    <div class="spinner"></div>
                    <p>Ürünler yükleniyor...</p>
                </div>
                <div class="products-grid"></div>
                <div class="no-results" style="display: none;">
                    <p>Seçtiğiniz kriterlere uygun ürün bulamadık. Lütfen farklı seçeneklerle tekrar deneyin.</p>
                    <button class="reset-wizard-button">Sihirbazı Yeniden Başlat</button>
                </div>
            </div>
        </div>
        
        <div class="wizard-controls">
            <div class="left-controls">
                <button class="prev-button" disabled><span class="dashicons dashicons-arrow-left-alt"></span></button>
                <button class="reset-button"><span class="dashicons dashicons-image-rotate"></span></button>
            </div>
            
            <div class="step-indicator-text">
                <span class="current-step">1</span> / <span class="total-steps"><?php echo count($questions); ?></span>
            </div>
            
            <button class="next-button" disabled><span class="dashicons dashicons-arrow-right-alt"></span></button>
        </div>
    </div>
</div>
