
/**
 * Ürün Bulucu Sihirbazı JavaScript
 */
jQuery(document).ready(function($) {
    // Sihirbaz değişkenleri
    var $wizard = $('.urun-bulucu-wizard');
    var $steps = $('.wizard-step');
    var $stepIndicators = $('.step-indicator');
    var $currentStepText = $('.current-step');
    var $totalStepsText = $('.total-steps');
    var $prevButton = $('.prev-button');
    var $nextButton = $('.next-button');
    var $resetButton = $('.reset-button');
    var $resetWizardButton = $('.reset-wizard-button');
    
    var currentStep = 0;
    var totalSteps = $steps.length;
    var selections = {};
    
    // İlk adımı ayarla
    updateStepDisplay();
    
    // Seçenek kartı tıklama
    $wizard.on('click', '.option-card', function() {
        var $this = $(this);
        var $currentStepElement = $steps.eq(currentStep);
        var questionId = $currentStepElement.data('step-id') || 'question_' + currentStep;
        var optionId = $this.data('option-id');
        
        // Seçimi güncelle
        $currentStepElement.find('.option-card').removeClass('selected');
        $this.addClass('selected');
        
        // Seçimi kaydet
        selections[questionId] = optionId;
        
        // İleri düğmesini etkinleştir
        $nextButton.prop('disabled', false);
        
        // Son adımdaysak sonuçları göster
        if (currentStep === totalSteps - 1) {
            setTimeout(function() {
                showResults();
            }, 300);
        }
    });
    
    // İleri düğmesi tıklama
    $nextButton.on('click', function() {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            updateStepDisplay();
        }
    });
    
    // Geri düğmesi tıklama
    $prevButton.on('click', function() {
        if (currentStep > 0) {
            currentStep--;
            updateStepDisplay();
        }
    });
    
    // Sıfırla düğmesi tıklama
    $resetButton.on('click', resetWizard);
    $resetWizardButton.on('click', resetWizard);
    
    // Adım göstergesini güncelle
    function updateStepDisplay() {
        // Aktif adımı göster, diğerlerini gizle
        $steps.hide();
        $steps.eq(currentStep).show();
        
        // Adım göstergelerini güncelle
        $stepIndicators.removeClass('active completed');
        
        for (var i = 0; i < totalSteps; i++) {
            if (i < currentStep) {
                $stepIndicators.eq(i).addClass('completed');
            } else if (i === currentStep) {
                $stepIndicators.eq(i).addClass('active');
            }
        }
        
        // Adım sayısını güncelle
        $currentStepText.text(currentStep + 1);
        $totalStepsText.text(totalSteps);
        
        // Geri düğmesini etkinleştir/devre dışı bırak
        $prevButton.prop('disabled', currentStep === 0);
        
        // İleri düğmesini etkinleştir/devre dışı bırak
        var currentQuestionId = $steps.eq(currentStep).data('step-id') || 'question_' + currentStep;
        var hasSelection = selections[currentQuestionId] !== undefined;
        $nextButton.prop('disabled', !hasSelection);
    }
    
    // Sonuçları göster
    function showResults() {
        $steps.hide();
        $('.wizard-results').show();
        $('.loading-indicator').show();
        $('.products-grid').empty();
        $('.no-results').hide();
        
        // AJAX isteği
        $.ajax({
            url: urun_bulucu_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'get_filtered_products',
                nonce: urun_bulucu_ajax.nonce,
                selections: JSON.stringify(selections)
            },
            success: function(response) {
                $('.loading-indicator').hide();
                
                if (response.success && response.data.length > 0) {
                    displayProducts(response.data);
                } else {
                    $('.no-results').show();
                }
            },
            error: function() {
                $('.loading-indicator').hide();
                $('.no-results').show();
            }
        });
    }
    
    // Ürünleri göster
    function displayProducts(products) {
        var $grid = $('.products-grid');
        
        products.forEach(function(product) {
            var productHtml = createProductCard(product);
            $grid.append(productHtml);
        });
    }
    
    // Ürün kartı oluştur
    function createProductCard(product) {
        var attributes = '';
        if (product.attributes) {
            for (var key in product.attributes) {
                if (product.attributes.hasOwnProperty(key)) {
                    attributes += '<span class="attribute-tag">' + key + ': ' + product.attributes[key] + '</span>';
                }
            }
        }
        
        var formattedPrice = new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            maximumFractionDigits: 0
        }).format(product.price);
        
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image || 'https://via.placeholder.com/500'}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <div class="product-title">${product.name}</div>
                    <div class="product-description">${product.description || ''}</div>
                    <div class="product-meta">
                        <div class="product-attributes">
                            ${attributes}
                        </div>
                        <div class="product-footer">
                            <div class="product-price">${formattedPrice}</div>
                            <a href="${product.permalink}" class="add-to-cart-button" title="Ürünü Görüntüle">
                                <span class="dashicons dashicons-cart"></span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Sihirbazı sıfırla
    function resetWizard() {
        currentStep = 0;
        selections = {};
        $('.option-card').removeClass('selected');
        $('.wizard-results').hide();
        updateStepDisplay();
    }
    
    // Admin sayfası için JavaScript
    if ($('.urun-bulucu-admin').length) {
        // Tab değişimi
        $('.tab-button').on('click', function() {
            var tabId = $(this).data('tab');
            $('.tab-button').removeClass('active');
            $('.tab-content').removeClass('active');
            $(this).addClass('active');
            $('.' + tabId + '-tab').addClass('active');
        });
        
        // Yeni soru ekle
        $('#add-question-button').on('click', function() {
            var questionIndex = $('.question-card').length;
            var newQuestionHtml = `
                <div class="question-card" data-index="${questionIndex}">
                    <div class="question-header">
                        <h3>Soru ${questionIndex + 1}</h3>
                        <button class="remove-question-button" title="Bu soruyu sil"><span class="dashicons dashicons-trash"></span></button>
                    </div>
                    
                    <div class="question-inputs">
                        <div class="form-group">
                            <label for="question-id-${questionIndex}">Soru ID</label>
                            <input type="text" id="question-id-${questionIndex}" value="question_${Date.now()}" class="question-id">
                        </div>
                        
                        <div class="form-group">
                            <label for="question-title-${questionIndex}">Soru Başlığı</label>
                            <input type="text" id="question-title-${questionIndex}" value="Yeni Soru" class="question-title">
                        </div>
                        
                        <div class="form-group">
                            <label for="question-desc-${questionIndex}">Soru Açıklaması</label>
                            <textarea id="question-desc-${questionIndex}" class="question-description">Soru açıklaması</textarea>
                        </div>
                    </div>
                    
                    <div class="options-section">
                        <h4>Seçenekler</h4>
                        <div class="options-container">
                            <div class="option-item" data-option-index="0">
                                <div class="option-inputs">
                                    <div class="form-group">
                                        <label>Seçenek ID</label>
                                        <input type="text" value="option_${Date.now()}" class="option-id">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>Seçenek Metni</label>
                                        <input type="text" value="Yeni Seçenek" class="option-text">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>Resim URL (isteğe bağlı)</label>
                                        <input type="text" value="" class="option-image">
                                    </div>
                                </div>
                                
                                <button class="remove-option-button" title="Bu seçeneği sil"><span class="dashicons dashicons-no-alt"></span></button>
                            </div>
                        </div>
                        
                        <button class="add-option-button" data-question-index="${questionIndex}">
                            <span class="dashicons dashicons-plus"></span> Yeni Seçenek Ekle
                        </button>
                    </div>
                </div>
            `;
            
            $('#questions-container').append(newQuestionHtml);
            $('.empty-questions').hide();
        });
        
        // Yeni seçenek ekle
        $(document).on('click', '.add-option-button', function() {
            var $questionCard = $(this).closest('.question-card');
            var $optionsContainer = $questionCard.find('.options-container');
            var optionIndex = $optionsContainer.find('.option-item').length;
            
            var newOptionHtml = `
                <div class="option-item" data-option-index="${optionIndex}">
                    <div class="option-inputs">
                        <div class="form-group">
                            <label>Seçenek ID</label>
                            <input type="text" value="option_${Date.now()}" class="option-id">
                        </div>
                        
                        <div class="form-group">
                            <label>Seçenek Metni</label>
                            <input type="text" value="Yeni Seçenek" class="option-text">
                        </div>
                        
                        <div class="form-group">
                            <label>Resim URL (isteğe bağlı)</label>
                            <input type="text" value="" class="option-image">
                        </div>
                    </div>
                    
                    <button class="remove-option-button" title="Bu seçeneği sil"><span class="dashicons dashicons-no-alt"></span></button>
                </div>
            `;
            
            $optionsContainer.append(newOptionHtml);
        });
        
        // Seçenek sil
        $(document).on('click', '.remove-option-button', function() {
            var $optionsContainer = $(this).closest('.options-container');
            var $optionItem = $(this).closest('.option-item');
            
            if ($optionsContainer.find('.option-item').length > 1) {
                $optionItem.remove();
            } else {
                alert('Her soru için en az bir seçenek olmalıdır.');
            }
        });
        
        // Soru sil
        $(document).on('click', '.remove-question-button', function() {
            var $questionsContainer = $('#questions-container');
            var $questionCard = $(this).closest('.question-card');
            
            $questionCard.remove();
            
            // Soru kalmadıysa boş mesajı göster
            if ($questionsContainer.find('.question-card').length === 0) {
                $('.empty-questions').show();
            }
            
            // Kalan soruların numaralarını güncelle
            $questionsContainer.find('.question-card').each(function(index) {
                $(this).attr('data-index', index);
                $(this).find('h3').text('Soru ' + (index + 1));
            });
        });
        
        // Soruları kaydet
        $('#save-questions-button').on('click', function() {
            var questions = [];
            
            $('.question-card').each(function() {
                var $question = $(this);
                var questionId = $question.find('.question-id').val();
                var questionTitle = $question.find('.question-title').val();
                var questionDesc = $question.find('.question-description').val();
                
                var options = [];
                $question.find('.option-item').each(function() {
                    var $option = $(this);
                    var optionId = $option.find('.option-id').val();
                    var optionText = $option.find('.option-text').val();
                    var optionImage = $option.find('.option-image').val();
                    
                    var option = {
                        id: optionId,
                        text: optionText
                    };
                    
                    if (optionImage) {
                        option.imageUrl = optionImage;
                    }
                    
                    options.push(option);
                });
                
                questions.push({
                    id: questionId,
                    title: questionTitle,
                    description: questionDesc,
                    options: options
                });
            });
            
            // AJAX ile sunucuya gönder
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'save_wizard_questions',
                    nonce: urun_bulucu_ajax.nonce,
                    questions: JSON.stringify(questions)
                },
                success: function(response) {
                    if (response.success) {
                        alert('Sorular başarıyla kaydedildi!');
                    } else {
                        alert('Hata: ' + response.data);
                    }
                },
                error: function() {
                    alert('Sunucu hatası! Lütfen daha sonra tekrar deneyin.');
                }
            });
        });
    }
});
