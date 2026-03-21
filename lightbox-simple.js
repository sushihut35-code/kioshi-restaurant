/**
 * SimpleLightbox
 * Simplified version for menu images
 */
(function() {
    'use strict';

    var SimpleLightbox = function() {
        this.overlay = null;
        this.wrap = null;
        this.content = null;
        this.closeBtn = null;
        this.currentImage = null;

        this.init();
    };

    SimpleLightbox.prototype = {
        init: function() {
            // Create overlay
            this.overlay = document.createElement('div');
            this.overlay.className = 'slbOverlay';
            document.body.appendChild(this.overlay);

            // Create wrap
            this.wrap = document.createElement('div');
            this.wrap.className = 'slbWrap';
            document.body.appendChild(this.wrap);

            // Create close button
            this.closeBtn = document.createElement('div');
            this.closeBtn.className = 'slbClose';
            this.closeBtn.innerHTML = '×';
            this.closeBtn.onclick = this.close.bind(this);
            this.wrap.appendChild(this.closeBtn);

            // Close on overlay click
            this.overlay.onclick = this.close.bind(this);

            // Close on ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    this.close();
                }
            }.bind(this));
        },

        open: function(img) {
            this.currentImage = img;

            // Clear previous content
            var oldContent = this.wrap.querySelector('.slbContentOuter');
            if (oldContent) {
                oldContent.remove();
            }

            // Create content
            var contentOuter = document.createElement('div');
            contentOuter.className = 'slbContentOuter';

            var content = document.createElement('div');
            content.className = 'slbContent';

            var imgClone = document.createElement('img');
            imgClone.src = img.src;
            imgClone.alt = img.alt;

            content.appendChild(imgClone);
            contentOuter.appendChild(content);
            this.wrap.appendChild(contentOuter);

            // Show
            this.overlay.style.display = 'block';
            this.wrap.style.display = 'block';

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        },

        close: function() {
            this.overlay.style.display = 'none';
            this.wrap.style.display = 'none';
            document.body.style.overflow = 'auto';

            // Clear content
            var oldContent = this.wrap.querySelector('.slbContentOuter');
            if (oldContent) {
                oldContent.remove();
            }
        }
    };

    // Initialize
    var lightbox = new SimpleLightbox();

    // Attach to menu images
    document.addEventListener('DOMContentLoaded', function() {
        var menuImages = document.querySelectorAll('.menu-table-image');
        menuImages.forEach(function(img) {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                lightbox.open(this);
            });
        });
    });

    // Export
    window.SimpleLightbox = SimpleLightbox;
})();
