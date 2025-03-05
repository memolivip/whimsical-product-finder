
<?php
/**
 * Plugin Name: WooCommerce Ürün Bulucu
 * Description: Müşterilere sorular sorarak en uygun ürünleri bulan bir sihirbaz.
 * Version: 1.0.0
 * Author: Your Name
 * Text Domain: woocommerce-urun-bulucu
 * Domain Path: /languages
 * Requires at least: 5.6
 * Requires PHP: 7.3
 * WC requires at least: 5.0
 */

// Doğrudan erişimi engelle
if (!defined('ABSPATH')) {
    exit;
}

// Plugin yolu ve URL'sini tanımla
define('WURUN_BULUCU_PATH', plugin_dir_path(__FILE__));
define('WURUN_BULUCU_URL', plugin_dir_url(__FILE__));
define('WURUN_BULUCU_VERSION', '1.0.0');

// Eklenti sınıfı
class WC_Urun_Bulucu {
    /**
     * Singleton instance
     */
    protected static $instance = null;

    /**
     * Singleton pattern için get_instance metodu
     */
    public static function get_instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    public function __construct() {
        // WooCommerce kurulu ve aktif mi kontrol et
        add_action('plugins_loaded', array($this, 'check_dependencies'));
        
        // Eklenti kaynaklarını (CSS, JS) yükle
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        
        // Kısa kodları kaydet
        add_shortcode('urun_bulucu', array($this, 'render_product_finder'));
        
        // Admin menüsünü ekle
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Ajax işleyicilerini kaydet
        add_action('wp_ajax_save_wizard_questions', array($this, 'save_wizard_questions'));
        add_action('wp_ajax_nopriv_get_filtered_products', array($this, 'get_filtered_products'));
        add_action('wp_ajax_get_filtered_products', array($this, 'get_filtered_products'));
    }

    /**
     * WooCommerce bağımlılığını kontrol et
     */
    public function check_dependencies() {
        if (!class_exists('WooCommerce')) {
            add_action('admin_notices', function() {
                echo '<div class="error"><p>';
                echo 'WooCommerce Ürün Bulucu için WooCommerce eklentisinin kurulu ve aktif olması gerekiyor.';
                echo '</p></div>';
            });
            return false;
        }
        
        return true;
    }

    /**
     * Script ve stilleri kaydet
     */
    public function enqueue_scripts() {
        // Ana CSS
        wp_enqueue_style(
            'urun-bulucu-css',
            WURUN_BULUCU_URL . 'assets/css/urun-bulucu.css',
            array(),
            WURUN_BULUCU_VERSION
        );
        
        // Ana JS
        wp_enqueue_script(
            'urun-bulucu-js',
            WURUN_BULUCU_URL . 'assets/js/urun-bulucu.js',
            array('jquery'),
            WURUN_BULUCU_VERSION,
            true
        );
        
        // Ajax URL'sini JS'e aktar
        wp_localize_script('urun-bulucu-js', 'urun_bulucu_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('urun-bulucu-nonce')
        ));
    }

    /**
     * Ürün bulucu sihirbazını render et
     */
    public function render_product_finder($atts) {
        // Shortcode özelliklerini işle
        $atts = shortcode_atts(array(
            'title' => 'Ürün Bulma Sihirbazı',
            'subtitle' => 'İhtiyacınıza uygun ürünleri bulmak için birkaç soruyu yanıtlayın.',
        ), $atts, 'urun_bulucu');
        
        // Çıktı tamponlamasını başlat
        ob_start();
        
        // Şablon dosyasını dahil et
        include WURUN_BULUCU_PATH . 'templates/product-finder.php';
        
        // Tamponu döndür
        return ob_get_clean();
    }

    /**
     * Admin menüsünü ekle
     */
    public function add_admin_menu() {
        add_menu_page(
            'Ürün Bulucu', 
            'Ürün Bulucu',
            'manage_options',
            'urun-bulucu',
            array($this, 'render_admin_page'),
            'dashicons-search',
            56
        );
    }

    /**
     * Admin sayfasını render et
     */
    public function render_admin_page() {
        include WURUN_BULUCU_PATH . 'templates/admin-page.php';
    }

    /**
     * Sihirbaz sorularını kaydet
     */
    public function save_wizard_questions() {
        // Güvenlik kontrolü
        check_ajax_referer('urun-bulucu-nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Yetkiniz yok');
        }
        
        $questions = isset($_POST['questions']) ? $_POST['questions'] : '';
        
        if (empty($questions)) {
            wp_send_json_error('Geçersiz veri');
        }
        
        $questions = json_decode(stripslashes($questions), true);
        
        // Soruları veritabanına kaydet
        update_option('urun_bulucu_questions', $questions);
        
        wp_send_json_success('Sorular başarıyla kaydedildi');
    }

    /**
     * Filtrelenmiş ürünleri getir
     */
    public function get_filtered_products() {
        // Güvenlik kontrolü
        check_ajax_referer('urun-bulucu-nonce', 'nonce');
        
        $selections = isset($_POST['selections']) ? $_POST['selections'] : '';
        
        if (empty($selections)) {
            wp_send_json_error('Geçersiz veri');
        }
        
        $selections = json_decode(stripslashes($selections), true);
        
        // WooCommerce ürünlerini al ve filtrele
        $filtered_products = $this->filter_products($selections);
        
        wp_send_json_success($filtered_products);
    }
    
    /**
     * Seçimlere göre ürünleri filtrele
     */
    private function filter_products($selections) {
        $args = array(
            'status' => 'publish',
            'limit' => 100,
            'orderby' => 'date',
            'order' => 'DESC',
        );
        
        // Kategori filtresi ekle
        if (isset($selections['category']) && $selections['category'] !== 'any') {
            $args['tag'] = array($selections['category']);
        }
        
        // Diğer filtreler için tag'leri kullan
        foreach ($selections as $key => $value) {
            if ($value !== 'any' && $key !== 'category') {
                if (!isset($args['tag'])) {
                    $args['tag'] = array();
                }
                $args['tag'][] = $value;
            }
        }
        
        // Ürünleri al
        $products = wc_get_products($args);
        $filtered_products = array();
        
        foreach ($products as $product) {
            $product_data = array(
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'price' => $product->get_price(),
                'regular_price' => $product->get_regular_price(),
                'description' => $product->get_short_description(),
                'permalink' => get_permalink($product->get_id()),
                'image' => wp_get_attachment_url($product->get_image_id()),
                'attributes' => array(),
            );
            
            // Ürün özniteliklerini ekle
            $attributes = $product->get_attributes();
            foreach ($attributes as $attribute) {
                $name = wc_attribute_label($attribute->get_name());
                if ($attribute->is_taxonomy()) {
                    $terms = wp_get_post_terms($product->get_id(), $attribute->get_name(), array('fields' => 'names'));
                    $product_data['attributes'][$name] = implode(', ', $terms);
                } else {
                    $product_data['attributes'][$name] = $attribute->get_options();
                }
            }
            
            $filtered_products[] = $product_data;
        }
        
        return $filtered_products;
    }
}

// Eklentiyi başlat
function wc_urun_bulucu_init() {
    return WC_Urun_Bulucu::get_instance();
}

// Main instance
$GLOBALS['wc_urun_bulucu'] = wc_urun_bulucu_init();
